import React, { useState, useEffect, useRef, useContext } from 'react';

/** Import Context */
import { GlobalContext } from "../../contexts/GlobalContext";

/** Reaction component */
export function Reaction({post_id, type, count, active}) {
  const { user, orbis } = useContext(GlobalContext);
  const [rCount, setRCount] = useState(count);
  const [hasReacted, setHasReacted] = useState(active)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    setHasReacted(active);
  }, [active])

  async function react() {
    /** Anticipate success and update UI */
    setRCount(rCount + 1);
    setHasReacted(true);
    setShake(true);

    /** React to the post using the SDK */
    let res = await orbis.react(post_id, type);

    /** Check results */
    switch(res.status) {
      case 300:
      console.log("Error reacting to the post.");
      break;
    }
  }

  return(
    <div className={hasReacted ? "one-reaction active" : "one-reaction"} onClick={user ? () => react() : () => alert("You must be connected to react to a post.")}>
      <img className={shake ? "shake-anim" : ""} src={hasReacted ? "/img/icons/reaction-"+type+"-active.png" : "/img/icons/reaction-"+type+".png"} height="18" />
      {rCount !== null && type != "downvote" &&
        <span>{rCount}</span>
      }
    </div>
  )
}
