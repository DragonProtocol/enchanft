import Link from 'next/link'
import { getChannelIcon } from "../utils"

/** Global component to display a channel, returns the channel icon and channel name */
export function Channel({id, group_id, details, isLink}) {
  if(isLink) {
    return(
        <div className="channel-container pointer">
          <div className="channel-icon-container">
            <img src={getChannelIcon({content: details}, true)} className="pfp" />
          </div>

          <div className="channel-name">
            <Link href={"/group/" + group_id + "/" + id}>{details.name}</Link>
          </div>
        </div>
    )
  } else {
    return(
      <div className="channel-container">
        <div className="channel-icon-container">
          <img src={getChannelIcon({content: details}, true)} className="pfp" />
        </div>
        <div className="channel-name">{details.name}</div>
      </div>
    )
  }
}
