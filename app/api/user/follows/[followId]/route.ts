import { validateSessionToken } from '@/server/auth/validateSession';
import prisma from '@/server/db';
import { NextRequest } from 'next/server';

export const POST = async (
  request: NextRequest,
  { params: _params }: { params: Promise<{ followId: string }> }
) => {
  const params = await _params;
  const user = await validateSessionToken();
  const follow = await prisma.user.findFirst({
    where: {
      id: Number(params.followId),
    },
  });

  if (!user) {
    return Response.json({ error: 'You are not logged in' }, { status: 400 });
  }

  if (!follow) {
    return Response.json(
      { error: "User under follow id doesn't exist" },
      { status: 400 }
    );
  }

  if (user.id === follow.id) {
    return Response.json(
      { error: 'You cannot follow youself' },
      { status: 400 }
    );
  }

  const userFollow = await prisma.userFollow.findFirst({
    where: {
      userId: user.id,
      followId: follow.id,
      isFollowing: false,
    },
  });

  if (userFollow) {
    await prisma.userFollow.update({
      where: {
        id: userFollow.id,
      },
      data: {
        isFollowing: true,
      },
    });
  } else {
    await prisma.userFollow.create({
      data: {
        userId: user.id,
        followId: follow.id,
        isFollowing: true,
      },
    });
  }

  return Response.json({ error: 'Successfully followed ' + follow.username });
};

export const DELETE = async (
  request: NextRequest,
  { params: _params }: { params: Promise<{ followId: string }> }
) => {
  const params = await _params;
  const user = await validateSessionToken();
  const follow = await prisma.user.findFirst({
    where: {
      id: Number(params.followId),
    },
  });

  if (!user) {
    return Response.json({ error: 'You are not logged in' }, { status: 400 });
  }

  if (!follow) {
    return Response.json(
      { error: "User under follow id doesn't exist" },
      { status: 400 }
    );
  }

  if (user.id === follow.id) {
    return Response.json(
      { error: 'You cannot unfollow youself' },
      { status: 400 }
    );
  }

  const userFollow = await prisma.userFollow.findFirst({
    where: {
      userId: user.id,
      followId: follow.id,
      isFollowing: true,
    },
  });

  if (userFollow) {
    await prisma.userFollow.update({
      where: {
        id: userFollow.id,
      },
      data: {
        isFollowing: false,
      },
    });
  }

  return Response.json({ error: 'Successfully unfollowed ' + follow.username });
};
