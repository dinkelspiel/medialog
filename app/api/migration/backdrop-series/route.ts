import prisma from '@/server/db';

export const GET = async () => {
  const entries = await prisma.entry.findMany({
    where: {
      category: 'Series',
    },
  });

  for (const entry of entries) {
    await prisma.entry.update({
      where: {
        id: entry.id,
      },
      data: {
        backdropPath:
          'https://image.tmdb.org/t/p/original/' + entry.backdropPath,
      },
    });
  }
};
