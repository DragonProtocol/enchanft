import React, { useState, useEffect, useRef, useContext } from 'react';
import styles from '../styles/Home.module.css'
import { getChannelIcon } from "../utils";
import useIsGroupAdmin from "../hooks/useIsGroupAdmin";
import { Feed } from "../components/Feed";
import { RightSide } from "../components/RightSide";

/** Import Context */
import { GlobalContext, ModalsContext } from "../contexts/GlobalContext";

export default function ChannelDetails() {
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState();

  const { user, group_id,channel_id, orbis } = useContext(GlobalContext);

  useEffect(() => {
    if(channel_id) {
      loadChannelDetails();
    }
  }, [channel_id])

  /** Load channels details */
  async function loadChannelDetails() {
    setLoading(true);
    let { data, error, status } = await orbis.getChannel(channel_id);

    if(error) {
      console.log("There was an error loading the channel details: ", error);
    }

    if(data) {
      setChannel(data);
      setLoading(false);
    }
  }

  return (
    <>
      {/* <Head>
          <title key="title">Orbis | Group details</title>
          <meta name="description" content="Orbis is a fully decentralized social layer for the internet that any developers can use to build their own social apps or features." key="description"></meta>
          <meta property="og:title" content={"Orbis | Group details"} key="og_title" />
          <meta property="og:description" content="Orbis is a fully decentralized social layer for the internet that any developers can use to build their own social apps or features." key="og_description"/>
          <meta name="twitter:site" content="@OrbisClub" />
          <meta property="og:image" content="/img/og_image.png" />
          <meta name="twitter:card" content="app" />
      </Head> */}
      <div className="main-container">
        {/** Feed container */}
        <div className="main dashed-card">
          {loading == false && channel ?
            <div className="flex-column flex-1">
              {/** Show channel details */}
              <div className="channel-details flex-row v-justify-content-center mbottom-15">
                <div className="flex-column flex-1">
                  <div className="flex-row">
                    <img src={getChannelIcon(channel, true)} height="15" className="mright-5" />
                    <p className="m-0 fw-400">{channel.content.name}</p>
                  </div>
                  {channel.content.description &&
                    <p className="secondary m-0 mtop-5 fs-14">{channel.content.description}</p>
                  }
                </div>
                <div className="flex v-align-items-start">
                  {channel &&
                    <EditChannelContainer channel={channel} setChannel={setChannel} />
                  }
                </div>
              </div>

              {/** Show posts feed */}
              <Feed type={channel.content.type ? channel.content.type : "feed"} encryptionRules={channel.content?.encryptionRules} context={channel_id} autoRefresh={true} />
            </div>
          :
            <p className="center w-100">
              <img src="/img/icons/loading-white.svg" height="35" />
            </p>
          }

        </div>

        {/** Right side */}
        {/* <RightSide type="group-members" details={group_id} /> */}
      </div>
    </>
  )
}

/** Container of the edit channel button */
function EditChannelContainer({channel, setChannel}) {
  const { user, orbis } = useContext(GlobalContext);
  const { setModalVis } = useContext(ModalsContext);
  const isAdmin = useIsGroupAdmin(user, channel);

  if(isAdmin) {
    return(
      <button className="btn white-border" onClick={() => setModalVis("update-channel", true, channel, setChannel)}><img src="/img/icons/edit-white.png" height="12" className="mright-5" /><span>Edit</span></button>
    )
  } else {
    return null;
  }
}
