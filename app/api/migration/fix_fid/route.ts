import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import axios from 'axios';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
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

  let ignore: number[] = [];
  const entries = await prisma.entry.findMany({
    include: {
      collection: true,
    },
  });
  for (const entry of entries) {
    console.log('\n----------');
    if (entry.category !== 'Series') {
      console.log('Skipped non series');
      continue;
    }

    console.log('Processing series');

    const seasons = (
      await axios.get(
        `https://api.themoviedb.org/3/tv/${entry.collection?.foreignId}?language=en-US`,
        options
      )
    ).data['seasons'];

    for (const season of seasons) {
      const seasonEntry = await prisma.entry.findFirst({
        where: {
          foreignId: season['id'].toString(),
        },
      });

      if (!seasonEntry) {
        continue;
        return new Response('issue ' + JSON.stringify(season), {
          status: 200,
        });
      }

      if (ignore.includes(seasonEntry['id'])) {
        continue;
      }

      console.log(season);

      await prisma.entry.updateMany({
        where: {
          foreignId: season['id'].toString(),
        },
        data: {
          foreignId: season['season_number'].toString(),
        },
      });

      ignore.push(seasonEntry['id']);
    }
  }

  return new Response('Finish', {
    status: 200,
  });
};
