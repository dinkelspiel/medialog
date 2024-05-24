import prisma from '@/server/db';
import { Category } from '@prisma/client';
import { NextRequest } from 'next/server';
import { fetch, setGlobalDispatcher, Agent } from 'undici';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  setGlobalDispatcher(new Agent({ connect: { timeout: 50_000 } }));

  const search = request.nextUrl.searchParams.get('q');
  const excludeExisting = !!request.nextUrl.searchParams.get('excludeExisting'); // Exclude media already in the local database
  const take = request.nextUrl.searchParams.get('take')
    ? Number(request.nextUrl.searchParams.get('take'))
    : 10;
  const categories = request.nextUrl.searchParams.get('categories')
    ? (request.nextUrl.searchParams.get('categories')!.split(',') as Category[])
    : ['Book', 'Series', 'Movie'];

  if (!search) {
    return Response.json([]);
  }

  const openLibrary = (
    (await (
      await fetch(
        `https://openlibrary.org/search.json?title=${search.replace(' ', '+')}&limit=${take}`
      )
    ).json()) as any
  ).docs
    .map((ol: any) => {
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
        category: 'Book',
        releaseDate: releaseDateFallback ?? lowestReleaseDate.toDateString(),
        author: ol.author_name ? ol.author_name[0] : '',
        foreignId: ol.key.split('/')[ol.key.split('/').length - 1],
        posterPath: ol.edition_key
          ? `https://covers.openlibrary.org/b/olid/${ol.edition_key[0]}-L.jpg`
          : ol.isbn
            ? `https://covers.openlibrary.org/b/isbn/${ol.isbn[0]}-L.jpg`
            : ``,
      };
    })
    .filter((e: any) => !!new Date(e.releaseDate))
    .filter(() => categories.includes('Book'));

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };

  const tmdb = (
    (await (
      await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${search}&include_adult=false&language=en-US&page=1`,
        options
      )
    ).json()) as any
  ).results
    .map((tmdb: any) => ({
      title: tmdb.original_title ?? tmdb.name,
      category: tmdb.media_type === 'tv' ? 'Series' : 'Movie',
      releaseDate:
        tmdb.media_type === 'tv'
          ? new Date(tmdb.first_air_date).toDateString()
          : new Date(tmdb.release_date).toDateString(),
      author: '',
      foreignId: tmdb.id,
      posterPath: 'https://image.tmdb.org/t/p/original/' + tmdb.poster_path,
    }))
    .filter((tmdb: any) => categories?.includes(tmdb.category))
    // .map((e: any) =>
    //   e.releaseDate === 'Invalid Date' ? { ...e, releaseDate: new Date() } : e
    // );
    .filter((e: any) => e.releaseDate !== 'Invalid Date');

  if (excludeExisting) {
    let finalMedia = [];
    for (const media of [...openLibrary, ...tmdb]) {
      const existing = await prisma.entry.findFirst({
        where: {
          OR: [
            {
              foreignId: media.foreignId.toString(),
              category: media.category,
            },
            {
              collection: {
                foreignId: media.foreignId.toString(),
                category: media.category,
              },
            },
          ],
        },
      });

      if (!existing) {
        finalMedia.push(media);
      }
    }

    return Response.json(finalMedia.slice(0, take));
  }

  return Response.json([...openLibrary, ...tmdb].slice(0, take));
};
