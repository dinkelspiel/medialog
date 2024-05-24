import prisma from '@/server/db';
import { NextRequest } from 'next/server';
import { fetch, setGlobalDispatcher, Agent } from 'undici';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  setGlobalDispatcher(new Agent({ connect: { timeout: 50_000 } }));

  const id = request.nextUrl.searchParams.get('olId');

  if (id === null) {
    return Response.json(
      { error: 'No olId provided. This should be an OpenLibrary workId' },
      { status: 400 }
    );
  }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  };

  const work: any = await (
    await fetch(`https://openlibrary.org/works/${id}.json`, options)
  ).json();

  let editionsData: any = await (
    await fetch(`https://openlibrary.org/works/${id}/editions.json`, options)
  ).json();

  if (work.error) {
    return Response.json({
      error: work.error,
    });
  }

  let editions = editionsData.entries;

  for (let offset = 50; offset < editionsData.size; offset += 50) {
    editionsData = await (
      await fetch(
        `https://openlibrary.org/works/${id}/editions.json?offset=${offset}`,
        options
      )
    ).json();

    editions = [...editions, ...editionsData.entries];
  }

  let fallbackNumberOfPages = 0;
  let fallbackLanguages = [];
  let earliestPublishDate = new Date();
  let edition: any | undefined = undefined;

  for (let editionData of editions) {
    if (editionData.languages) {
      fallbackLanguages = editionData.languages;
    }
    if (editionData.number_of_pages) {
      fallbackNumberOfPages = editionData.number_of_pages;
    }
    if (edition) {
      if (
        new Date(editionData.publish_date).getTime() <
        earliestPublishDate.getTime()
      ) {
        earliestPublishDate = new Date(editionData.publish_date);
        edition = editionData;
      }
    } else {
      earliestPublishDate = new Date(editionData.publish_date);
      edition = editionData;
    }
  }

  let entry = await prisma.entry.findFirst({
    where: {
      foreignId: work.key.split('/')[work.key.split('/').length - 1],
      category: 'Book',
    },
  });

  if (entry) {
    return Response.json(
      {
        error: 'OpenLibrary book with same work id already imported',
      },
      { status: 400 }
    );
  }

  if (!edition) {
    return Response.json(
      {
        error: 'Work has no editions',
      },
      { status: 400 }
    );
  }

  const createData = {
    originalTitle: edition.title,
    foreignId: work.key.split('/')[work.key.split('/').length - 1],
    posterPath: `https://covers.openlibrary.org/b/id/${work.covers ? work.covers[0] : ''}-L.jpg`,
    tagline: '',
    overview: work.description
      ? typeof work.description === 'object'
        ? work.description.value
        : work.description
      : '',
    backdropPath: '',
    category: 'Book' as any,
    length: edition.number_of_pages ?? fallbackNumberOfPages ?? 0,
    releaseDate: earliestPublishDate,
    originalLanguageId: (
      await prisma.language.findFirst({
        where: {
          iso_639_2:
            edition.languages ?? fallbackLanguages
              ? (edition.languages ?? fallbackLanguages).length > 0
                ? (edition.languages ?? fallbackLanguages)[0].key.split('/')[
                    (edition.languages ?? fallbackLanguages)[0].key.split('/')
                      .length - 1
                  ]
                : 'eng'
              : 'eng',
        },
      })
    )?.id!,
  };

  entry = await prisma.entry.create({
    data: createData,
  });

  for (const languageKey of edition.languages ?? fallbackLanguages) {
    const language = await prisma.language.findFirst({
      where: {
        iso_639_2:
          languageKey.key.split('/')[languageKey.key.split('/').length - 1],
      },
    });

    await prisma.entrySpokenLanguage.create({
      data: {
        entryId: entry.id,
        languageId: language?.id!,
      },
    });
  }

  for (const editionData of editions) {
    const language = await prisma.language.findFirst({
      where: {
        iso_639_2:
          editionData.languages ?? fallbackLanguages
            ? (editionData.languages ?? fallbackLanguages).length > 0
              ? (editionData.languages ?? fallbackLanguages)[0].key.split('/')[
                  (editionData.languages ?? fallbackLanguages)[0].key.split('/')
                    .length - 1
                ]
              : 'eng'
            : 'eng',
      },
    });

    if (!language || language?.id === entry.originalLanguageId) {
      continue;
    }

    await prisma.entryAlternativeTitle.create({
      data: {
        entryId: entry.id,
        languageId: language.id!,
        title: editionData.title!,
      },
    });
  }

  return Response.json({
    message: `Imported book ${entry.originalTitle}`,
    entry: entry,
  });
};
