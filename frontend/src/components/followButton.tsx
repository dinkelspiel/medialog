import React, { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";

const FollowButton = ({
  isViewerFollowing,
  username,
  followUsername,
  followSuccess,
  unfollowSuccess,
}: {
  isViewerFollowing: boolean;
  username: string;
  followUsername: string;
  followSuccess: () => void;
  unfollowSuccess: () => void;
}) => {
  const [hoverFollow, setHoverFollow] = useState(false);

  const toggleFollow = async (success: () => void) => {
    let response = await fetch(
      process.env.NEXT_PUBLIC_API_URL +
        `/users/@${username}/follows/@${followUsername}?sessionToken=${localStorage.getItem("sessionToken")}`,
      {
        method: isViewerFollowing ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status !== 200) {
      toast.error(
        `Failed ${isViewerFollowing ? "unfollowing" : "following"} user with error "${(await response.json()).error}"`,
      );
    } else {
      toast.success(
        `Successfully ${isViewerFollowing ? "unfollowed" : "followed"} user`,
      );
      success();
    }
  };

  return !isViewerFollowing ? (
    <Button
      variant="outline"
      onClick={() => toggleFollow(() => followSuccess())}
    >
      Follow
    </Button>
  ) : (
    <Button
      variant={hoverFollow ? "destructive" : "outline"}
      onMouseEnter={() => setHoverFollow(true)}
      onMouseLeave={() => setHoverFollow(false)}
      className="w-[96px]"
      onClick={() => toggleFollow(() => unfollowSuccess())}
    >
      {!hoverFollow ? "Following" : "Unfollow"}
    </Button>
  );
};

export default FollowButton;
