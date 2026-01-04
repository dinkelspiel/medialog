'use client';

import { useAuthUser } from '@/app/(app)/_components/AuthUserContext';
import { Button } from '@/components/ui/button';
import { User, UserFollow } from '@/prisma/generated/browser';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

const FollowButton = ({
  user,
}: {
  user: User & { followers: UserFollow[] };
}) => {
  const [following, setFollowing] = useState(false);
  const authUser = useAuthUser();

  const toggleFollow = async () => {
    if (!authUser) {
      return;
    }

    const oldFollowingState = Boolean(following);

    setFollowing(!following);

    let response = await fetch(`/api/user/follows/${user.id}`, {
      method: following ? 'DELETE' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      toast.error(
        `Failed ${following ? 'unfollowing' : 'following'} user with error "${(await response.json()).error}"`
      );
      setFollowing(oldFollowingState);
    } else {
      toast.success(
        `Successfully ${following ? 'unfollowed' : 'followed'} user`
      );
    }
  };

  useEffect(() => {
    setFollowing(
      authUser
        ? user.followers.find(
            e => e.userId === authUser.id && e.isFollowing
          ) !== undefined
        : false
    );
  }, [authUser, user]);

  return (
    <Button
      variant={following ? 'destructive' : 'outline'}
      onClick={() => toggleFollow()}
      className="w-[92px]"
    >
      {following ? 'Unfollow' : 'Follow'}
    </Button>
  );
};

export default FollowButton;
