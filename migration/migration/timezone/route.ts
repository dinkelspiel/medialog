import prisma from '@/server/db';

export const GET = async () => {
  const timezones = Intl.supportedValuesOf('timeZone');
  for (const timezone of timezones) {
    console.log('timezone', timezone);
    await prisma.timezone.create({
      data: {
        iana: timezone,
      },
    });
  }

  const stockholmTimezone = await prisma.timezone.findFirst({
    where: {
      iana: 'Europe/Stockholm',
    },
  });
  if (!stockholmTimezone) {
    console.log('No sthlm');
    return;
  }

  const users = await prisma.user.findMany();
  for (const user of users) {
    console.log('user', user.id);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        timezoneId: stockholmTimezone.id,
      },
    });
  }
};
