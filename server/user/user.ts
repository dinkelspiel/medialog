import { User } from '@prisma/client';
import 'server-only';
import prisma from '../db';

export const getDailyStreak = async (user: User): Promise<number> => {
  const now = new Date();
  const msInDay = 1000 * 60 * 60 * 24;

  if (
    new Date(user.dailyStreakUpdated.setHours(0, 0, 0, 0)).getTime() + msInDay <
    new Date(now.setHours(0, 0, 0, 0)).getTime()
  ) {
    if (user.dailyStreakLength > user.dailyStreakLongest) {
      await prisma.user.update({
        where: { id: user.id },
        data: { dailyStreakLongest: user.dailyStreakLength },
      });
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { dailyStreakLength: 0 },
    });
    return 0;
  }

  const streakStartDate = new Date(
    user.dailyStreakStarted.setHours(0, 0, 0, 0)
  );
  const streakEndDate = new Date(user.dailyStreakUpdated.setHours(0, 0, 0, 0));

  const diffInDays = Math.ceil(
    (streakEndDate.getTime() - streakStartDate.getTime()) / msInDay
  );
  const streakLength = diffInDays + 1;

  if (streakLength > user.dailyStreakLongest) {
    await prisma.user.update({
      where: { id: user.id },
      data: { dailyStreakLongest: streakLength },
    });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { dailyStreakLength: streakLength },
  });

  return streakLength;
};

export const pushDailyStreak = async (user: User) => {
  const streakLength = await getDailyStreak(user);

  if (streakLength === 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        dailyStreakStarted: new Date(),
        dailyStreakUpdated: new Date(),
      },
    });
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { dailyStreakUpdated: new Date() },
  });
};
