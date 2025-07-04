import prisma from '@/server/db';
import { Category } from '@prisma/client';
import { NextRequest } from 'next/server';
import { fetch, setGlobalDispatcher, Agent } from 'undici';
import axios from 'axios';

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
    await axios.get(
      `https://openlibrary.org/search.json?title=${search.replace(' ', '+')}&limit=${take}`,
      {
        timeout: 60_000,
      }
    )
  ).data.docs
    .map((ol: any) => {
      let releaseDate = new Date();
      let releaseDateFallback: string | undefined = undefined;

      if (ol.first_publish_year) {
        releaseDate = new Date(ol.first_publish_year.toString());
      } else {
        releaseDateFallback = 'No release date';
      }

      return {
        title: ol.title,
        category: 'Book',
        releaseDate: releaseDateFallback ?? releaseDate,
        author: ol.author_name ? ol.author_name[0] : '',
        foreignId: ol.key.split('/')[ol.key.split('/').length - 1],
        posterPath: ol.cover_edition_key
          ? `https://covers.openlibrary.org/b/olid/${ol.cover_edition_key}-L.jpg`
          : '',
      };
    })
    .filter((e: any) => !!new Date(e.releaseDate))
    .filter(() => categories.includes('Book'));

  const options = {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };

  const tmdb = (
    await axios.get(
      `https://api.themoviedb.org/3/search/multi?query=${search}&include_adult=false&language=en-US&page=1`,
      options
    )
  ).data.results
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
