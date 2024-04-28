import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const url = '';
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
    },
  };

  const details = await fetch(
    'https://api.themoviedb.org/3/movie/889?language=en-US',
    options
  );
  const altTitles = await fetch(
    'https://api.themoviedb.org/3/movie/889/alternative_titles?language=en-US',
    options
  );
  const credits = await fetch(
    'https://api.themoviedb.org/3/movie/889/credits?language=en-US',
    options
  );
  const watchProviders = await fetch(
    'https://api.themoviedb.org/3/movie/889/watch/providers',
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
