import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import axios from 'axios';
import { Pi } from 'lucide-react';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  const user = await validateSessionToken();
  if (!user) {
    return;
  }

  if (process.env.NODE_ENV !== 'development') {
    return new Response('Not dev', {
      status: 400,
    });
  }

  const options = {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };

  const langHr = await prisma.language.findFirst({
    where: {
      iso_639_1: 'hr',
    },
  });
  if (!langHr) {
    await prisma.language.create({
      data: {
        name: 'Croatian',
        iso_639_1: 'hr',
        iso_639_2: 'hrv',
      },
    });
  }

  const langZh = await prisma.language.findFirst({
    where: {
      iso_639_1: 'zh',
    },
  });
  if (!langZh) {
    await prisma.language.create({
      data: {
        name: 'Chinese',
        iso_639_1: 'zh',
        iso_639_2: 'chi',
      },
    });
  }

  const langSr = await prisma.language.findFirst({
    where: {
      iso_639_1: 'sr',
    },
  });
  if (!langSr) {
    await prisma.language.create({
      data: {
        name: 'Serbian',
        iso_639_1: 'sr',
        iso_639_2: 'srp',
      },
    });
  }

  const langBs = await prisma.language.findFirst({
    where: {
      iso_639_1: 'bs',
    },
  });
  if (!langBs) {
    await prisma.language.create({
      data: {
        name: 'Bosnian',
        iso_639_1: 'bs',
        iso_639_2: 'bos',
      },
    });
  }

  await prisma.entryTranslation.deleteMany();
  console.log(`asd ${(await prisma.entryTranslation.findMany()).length}`);

  const entries = await prisma.entry.findMany({
    include: {
      collection: true,
    },
  });

  for (const entry of entries) {
    if (entry.category === 'Book') {
      continue;
    }
    console.log('\n------');
    console.log(entry.id);

    let url = '';
    if (entry.category === 'Series') {
      url = `https://api.themoviedb.org/3/tv/${entry.collection?.foreignId}/season/${entry.foreignId}/translations?language=en-US`;
    } else {
      url = `https://api.themoviedb.org/3/movie/${entry.foreignId}/translations?language=en-US`;
    }

    console.log(url);
    let translations;
    try {
      translations = (await axios.get(url, options)).data['translations'];
    } catch {
      console.log('request failed');
      continue;
    }

    for (const translation of translations) {
      console.log(translation['iso_639_1']);
      if (translation['iso_639_1'] === 'sh') {
        continue;
      }
      const language = await prisma.language.findFirst({
        where: {
          iso_639_1: translation['iso_639_1'],
        },
      });

      const country = await prisma.country.findFirst({
        where: {
          iso_3166_1: translation['iso_3166_1'],
        },
      });

      let collectionTranslation = undefined;
      if (entry.category === 'Series') {
        collectionTranslation = (
          (
            await axios.get(
              `https://api.themoviedb.org/3/tv/${entry.collection?.foreignId}/translations?language=en-US`,
              options
            )
          ).data['translations'] as any[]
        ).find(e => e.iso_639_1 === translation.iso_639_1);
      }

      const translationExists = await prisma.entryTranslation.findFirst({
        where: {
          entryId: entry.id,
          name: translation.name,
          languageId: language!.id,
        },
      });

      if (translationExists) {
        continue;
      }

      let title = '';
      if (entry.category === 'Series') {
        if (!collectionTranslation.data.name) {
          console.log(`No name for collection ${entry.id} ${translation.name}`);
          continue;
        }

        let season = translation.data.name
          ? translation.data.name
          : parseInt(entry.foreignId) > 0
            ? 'Season ' + entry.foreignId
            : 'Specials';

        title =
          collectionTranslation.data.name +
          (season === collectionTranslation.data.name ? '' : `: ${season}`);
      } else if (translation.data.title) {
        title = translation.data.title;
      } else {
        console.log(`No name for ${entry.id} ${translation.name}`);
        continue;
      }

      await prisma.entryTranslation.create({
        data: {
          entryId: entry.id,
          languageId: language!.id,
          countryId: country ? country.id : undefined,
          name: title,
          overview:
            entry.category === 'Series'
              ? (collectionTranslation.overview ?? '')
              : (translation.overview ?? ''),
          tagline:
            entry.category === 'Series'
              ? (collectionTranslation.tagline ?? '')
              : (translation.tagline ?? ''),
          homepage:
            entry.category === 'Series'
              ? (collectionTranslation.overview ?? '')
              : (translation.overview ?? ''),
        },
      });

      console.log(`Finished ${entry.id} ${title} in ${language?.iso_639_1}`);
    }
  }
};
