import React, { useState, useEffect, useRef, useContext } from 'react';

import { sleep } from "../utils/";
import { useHover } from "../hooks/useHover";

/** Import Context */
import { GlobalContext } from "../contexts/GlobalContext";
import { SaveButton } from "./SaveButton";

/** Simple join group button */
export function FollowButton({did}) {
  const { user, orbis, following, addFollowing } = useContext(GlobalContext);
  const [followStatus, setFollowStatus] = useState(0);
  const [hasFollowed, setHasFollowed] = useState(false);

  useEffect(() => {
    if(user && did && following.includes(did)) {
      setHasFollowed(true);
    } else {
      setHasFollowed(false);
    }
  }, [user, did, following])

  /** Join group function */
  async function follow(active) {
    setFollowStatus(1);
    let res = await orbis.setFollow(did, active);

    /** Update status according to result from Orbis SDK */
    switch(res.status) {
      case 200:
        setFollowStatus(2);

        /** Reset style after 2 seconds */
        await sleep(2000);
        setHasFollowed(active);
        setFollowStatus(0);
        addFollowing(did);
        break;
      default:
        setFollowStatus(3);
        console.log("Error following user: ", res);

        /** Reset style after 2 seconds */
        await sleep(2000);
        setFollowStatus(0);
        break;
    }
  }

  /** Don't show follow button for user if same as connected */
  if(user && user.did == did) {
    return null;
  }

  /** Show joined status if user already joined this group. */
  if(hasFollowed) {
    return <HasFollowedButton follow={follow} followStatus={followStatus} />;
  }

  return <SaveButton title="+ Follow" status={followStatus} onClick={user ? () => follow(true) : () => alert("You must be connectd to follow other users.")} />;
}

/** Simple component to show the has joined group status and to allow users to leave group on hover */
function HasFollowedButton ({follow, followStatus}) {
  const [hoverRef, isHovered] = useHover();

  if(isHovered) {
    return <div ref={hoverRef}><SaveButton className="red-border flex pointer" title="Unfollow" status={followStatus} onClick={() => follow(false)} /></div>;
  }

  /** Show default `hasJoined` button state */
  return <div className="btn green-border flex pointer" ref={hoverRef}><img src="/img/icons/check-green.png" className="mright-5" height="15" /><span>Following</span></div>
}
