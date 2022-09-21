import React, { useState, useEffect, useRef, useContext } from 'react';
/** Import Orbis SDK */
import { Orbis } from "@orbisclub/orbis-sdk";

import { Feed } from "../components/Feed";
import { RightSide } from "../components/RightSide";

/** Import Context */
import { GlobalContext } from "../contexts/GlobalContext";

/** Global component for group details */
export default function GroupHome() {
  const { user, setUser, group_id, orbis } = useContext(GlobalContext);
  const [group, setGroup] = useState();

  useEffect(() => {
    loadGroupDetails();
  }, []);

  async function loadGroupDetails() {
    let { data, error } = await orbis.getGroup(group_id);

    if(data) {
      setGroup(data);
    }
  }

  return(
    <>
      <div className="main-container">
        {/** Feed container */}
        <div className="main dashed-card">
          <div className="flex-column flex-1">
            {/** Show channel details */}
            <div className="channel-details flex-column v-justify-content-center mbottom-15">
              <div className="flex-row">
                <img src="/img/icons/group-home-white.png" height="15" className="mright-5" />
                <p className="m-0 fw-400">home</p>
              </div>
                <p className="secondary m-0 mtop-5 fs-14">Home channel for this group.</p>
            </div>

            {/** Show posts feed */}
            {group_id &&
              <Feed type="feed" context={group_id} autoRefresh={true} />
            }
          </div>
        </div>

        {/** Right side */}
        <RightSide type="group-members" details={group_id} />
      </div>
    </>
  )
}
