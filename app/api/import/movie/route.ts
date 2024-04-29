import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (request: NextRequest) => {
  const id = request.nextUrl.searchParams.get('id');

  if (id === null) {
    return Response.json({ error: 'No id provided' }, { status: 400 });
  }

  if (process.env.TMDB_ACCESS_TOKEN === undefined) {
    return Response.json(
      { error: 'No TMDB Access Token provided' },
      { status: 400 }
    );
  }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };

  const details = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
    options
  );
  const altTitles = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/alternative_titles?language=en-US`,
    options
  );
  const credits = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?language=en-US`,
    options
  );
  const watchProviders = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/watch/providers`,
    options
  );

  const creditsData = await credits.json();

  const data = await details.json();
  data['alternative_titles'] = (await altTitles.json())['titles'];
  data['cast'] = creditsData['cast'];
  data['crew'] = creditsData['crew'];
  data['watch_providers'] = (await watchProviders.json())['results'];

  return Response.json(data);
};
