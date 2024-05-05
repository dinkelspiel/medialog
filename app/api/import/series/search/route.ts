import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  const search = request.nextUrl.searchParams.get('q');

  if (search === null) {
    return Response.json({ error: 'No q search provided' }, { status: 400 });
  }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };

  const tmdb = (
    await (
      await fetch(
        `https://api.themoviedb.org/3/search/multi?query=${search}&include_adult=false&language=en-US&page=1`,
        options
      )
    ).json()
  ).results
    .map((tmdb: any) => ({
      title: tmdb.original_title ?? tmdb.name,
      type: tmdb.media_type,
      releaseDate: new Date(tmdb.first_air_date).toDateString(),
      author: '',
      foreignId: tmdb.id,
    }))
    .filter((tmdb: any) => tmdb.type === 'tv');

  return Response.json(tmdb);
};
