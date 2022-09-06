import React, { useState, useEffect, useRef, useContext } from 'react';

import { sleep } from "../utils/";
import { useHover } from "../hooks/useHover";

/** Import Context */
import { GlobalContext } from "../contexts/GlobalContext";
import { SaveButton } from "./SaveButton";

/** Simple join group button */
export function JoinGroupButton({group_id}) {
  const { user, getUserGroups, orbis } = useContext(GlobalContext);
  const [joinStatus, setJoinStatus] = useState(0);
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if(user && group_id) {
      isMember();
    } else {
      setHasJoined(false);
    }
  }, [group_id, user])

  /** Load group details */
  async function isMember() {
    setJoinStatus(1);
    let { data, error, status } = await orbis.getIsGroupMember(group_id, user.did)

    if(error) {
      console.log("Error loading the group membership details: ", error);
    }

    if(data) {
      setHasJoined(data);
    } else {
      setHasJoined(false);
    }

    setJoinStatus(0);
  }

  /** Join group function */
  async function setGroupMember(active) {
    setJoinStatus(1);
    let res = await orbis.setGroupMember(group_id, active);

    /** Update status according to result from Orbis SDK */
    switch(res.status) {
      case 200:
        setJoinStatus(2);

        /** Reset style after 2 seconds */
        await sleep(2000);
        setHasJoined(active);
        setJoinStatus(0);
        getUserGroups();
        break;
      default:
        setJoinStatus(3);
        console.log("Error joining group: ", res);

        /** Reset style after 2 seconds */
        await sleep(2000);
        setJoinStatus(0);
        break;
    }
  }

  if(!user) {
    return <SaveButton title="+ Join" status={0} onClick={() => alert("You must be connected to join groups.")} />;
  }

  /** Show joined status if user already joined this group. */
  if(hasJoined) {
    return <HasJoinedButton setGroupMember={setGroupMember} joinStatus={joinStatus} />;
  }

  return <SaveButton title="+ Join" status={joinStatus} onClick={() => setGroupMember(true)} />;
}

/** Simple component to show the has joined group status and to allow users to leave group on hover */
function HasJoinedButton ({setGroupMember, joinStatus}) {
  const [hoverRef, isHovered] = useHover();

  if(isHovered) {
    return <div ref={hoverRef}><SaveButton className="red-border flex pointer" title="Leave" status={joinStatus} onClick={() => setGroupMember(false)} /></div>;
  }

  /** Show default `hasJoined` button state */
  return <div className="btn green-border flex pointer" ref={hoverRef}><img src="/img/icons/check-green.png" className="mright-5" height="15" /><span>Joined</span></div>
}
