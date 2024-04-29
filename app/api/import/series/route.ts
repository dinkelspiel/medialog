import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

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
    'https://api.themoviedb.org/3/tv/1396?language=en-US',
    options
  );
  const altTitles = await fetch(
    'https://api.themoviedb.org/3/tv/1396/alternative_titles',
    options
  );
  const watchProviders = await fetch(
    'https://api.themoviedb.org/3/tv/1396/watch/providers',
    options
  );

  const data = await details.json();
  data['alternative_titles'] = (await altTitles.json())['titles'];
  data['watch_providers'] = (await watchProviders.json())['results'];

  for (var i = 0; i < data.seasons.length; i++) {
    const credits = await fetch(
      `https://api.themoviedb.org/3/tv/1396/season/${data.seasons[i].season_number}/credits?language=en-US`,
      options
    );
    const creditsData = await credits.json();

    data.seasons[i].cast = creditsData.cast;
    data.seasons[i].crew = creditsData.crew;
    data.seasons[i].episodes = undefined;
  }

  return Response.json(data);
};
