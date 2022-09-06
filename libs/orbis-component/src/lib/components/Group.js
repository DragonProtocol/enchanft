import Link from 'next/link'

/** Global group component displaying the pfp and group name */
export function Group({id, details, isLink, showPfp = true}) {
  if(isLink) {
    return(
        <div className="group-container pointer">
          {showPfp &&
            <div className="group-pfp-container">
              {details?.pfp ?
                <img src={details.pfp} className="pfp" />
              :
                <img src="/img/empty-state.png" className="pfp" />
              }
            </div>
          }
          <div className="group-name">
            <Link href={"/group/" + id}>{details?.name ? details.name : "no-name"}</Link>
          </div>
        </div>
    )
  } else {
    return(
      <div className="group-container">
        {showPfp &&
          <div className="group-pfp-container">
            {details?.pfp ?
              <img src={details.pfp} className="pfp" />
            :
              <img src="/img/empty-state.png" className="pfp" />
            }
          </div>
        }
        <div className="group-name">{details?.name}</div>
      </div>
    )
  }

}
