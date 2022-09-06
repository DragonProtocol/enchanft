import React, { useState, useEffect, useRef, useContext } from 'react';
import { useRouter } from 'next/router'
import { getChannelIcon } from "../utils";

/** Internal components */
import { MenuItemLevel2 } from "./MenuItemLevel2"
import { JoinGroupButton } from "./JoinGroupButton";
import { ConnectButton } from "./ConnectButton";
import useIsGroupAdmin from "../hooks/useIsGroupAdmin";

/** Import Context */
import { GlobalContext, ModalsContext } from "../contexts/GlobalContext";

/** Second level navigation element displaying group details */
export function GroupDetails() {
  const { user, group_id, orbis } = useContext(GlobalContext);
  const { setModalVis } = useContext(ModalsContext);
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const isAdmin = useIsGroupAdmin(user, group);

  /** Use Next router to get group_id */
  const router = useRouter();
  const { channel_id } = router.query;

  /** Load group details */
  useEffect(() => {
    if(group_id) {
      /** Load selected group details */
      loadGroup();
    }

  }, [group_id]);

  /** Load group details */
  async function loadGroup() {
    setLoading(true);
    let { data, error, status } = await orbis.getGroup(group_id);

    if(error) {
      console.log("Error loading the group details: ", error);
    }

    if(data) {
      setGroup(data);
    }

    setLoading(false);
  }

  /** Display group pfp accoring to schema's version or empty state */
  function GroupPfp({onClick}) {

    if(group.content.pfp || group.content.metadata?.pfp) {
      if(group.content.pfp) {
        return <img src={group.content.pfp} className={isAdmin ? "pfp admin" : "pfp"} onClick={onClick ? onClick : null} />;
      }

      if(group.content.metadata?.pfp) {
        return <img src={group.content.metadata?.pfp} className={isAdmin ? "pfp admin" : "pfp"} onClick={onClick ? onClick : null} />
      }
    } else if(onClick) {
      return <img src="/img/empty-pfp.png" className={isAdmin ? "pfp admin" : "pfp"} onClick={onClick} />
    } else {
      return <img src="/img/empty-state.png" className={isAdmin ? "pfp admin" : "pfp"} />
    }
  }

  return(
    <>
      {(loading) ?
        <div className="group-details">
          <p className="center">
            <img src="/img/icons/loading-white.svg" height="35" />
          </p>
        </div>

      :
        <div className="group-details">
          <div className="group-details-top">
            {group && group.content &&
              <>
                {isAdmin ?
                  <GroupPfp onClick={() => setModalVis("update-group", true, group, setGroup)} />
                :
                  <GroupPfp />
                }

                <h1>{group.content.name ? group.content.name : group.content.metadata.name}</h1>

                {/** Only display description if available */}
                {group.content.description &&
                  <p className="mbottom-0">{group.content.description}</p>
                }
                {group.content.metadata?.description &&
                  <p className="mbottom-0">{group.content.metadata?.description}</p>
                }

                {/** Show count group members */}
                <div className="flex h-justify-content-center mtop-10"><span className="badge dashed">{group.count_members > 1 ? group.count_members + " Members" : group.count_members + " Member"}</span></div>

                {/** If user us connected, show join group button */}
                {user ?
                  <div className="center mtop-10">
                    <JoinGroupButton group_id={group_id}  />
                  </div>
                :
                  <div className="center mtop-10">
                    <ConnectButton />
                  </div>
                }

                {/** If user is group admin: show Edit button */}
                {isAdmin &&
                  <div className="center mtop-10">
                    <div className="btn white" onClick={() => setModalVis("update-group", true, group, setGroup)}>Update group</div>
                  </div>
                }
              </>
            }
          </div>
          {/** Show channels */}
          {group &&
            <div className="group-channels">
              {/** Show home channel */}
              <MenuItemLevel2
                title="home"
                image="/img/icons/group-home-grey.png"
                imageActive="/img/icons/group-home-white.png"
                route={"/"}
                active={!channel_id ? true : false} />

              {/** Loop through all channels */}
              <LoopChannels channels={group?.channels} />

              {/** Create channel CTA */}
              {isAdmin &&
                <div className="">
                  <div className="btn white" onClick={() => setModalVis("create-channel", true, group, setGroup)}>+ Add a channel</div>
                </div>
              }
            </div>
          }
        </div>
      }
    </>
  )
}

/** Loop through all channels in this group */
function LoopChannels({channels}) {
  const { group_id } = useContext(GlobalContext);
  const router = useRouter();
  const { channel_id } = router.query;

  return channels.map((channel, key) => {
    if(channel.content) {
      return (
        <MenuItemLevel2
          title={channel.content.name}
          image={getChannelIcon(channel, false)}
          imageActive={getChannelIcon(channel, true)}
          route={"/" + channel.stream_id}
          active={channel_id == channel.stream_id ? true : false} />
      )
    } else {
      return null;
    }
  });
}
