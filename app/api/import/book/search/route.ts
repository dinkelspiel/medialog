import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  const search = request.nextUrl.searchParams.get('q');

  if (search === null) {
    return Response.json({ error: 'No q search provided' }, { status: 400 });
  }

  const openLibrary = (
    await (
      await fetch(
        `https://openlibrary.org/search.json?title=${search.replace(' ', '+')}`
      )
    ).json()
  ).docs.map((ol: any) => {
    let lowestReleaseDate = new Date();
    let releaseDateFallback: string | undefined = undefined;

    if (ol.publish_date) {
      for (const d of ol.publish_date) {
        const date = new Date(d);
        if (date.getTime() < lowestReleaseDate.getTime()) {
          lowestReleaseDate = date;
        }
      }
    } else {
      releaseDateFallback = 'No release date';
    }

    return {
      title: ol.title,
      type: 'book',
      releaseDate: releaseDateFallback ?? lowestReleaseDate.toDateString(),
      author: ol.author_name ? ol.author_name[0] : '',
      foreignId: ol.key.split('/')[ol.key.split('/').length - 1],
    };
  });

  return Response.json(openLibrary);
};
