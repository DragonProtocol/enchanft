import React, { useState, useEffect } from "react";
import Link from 'next/link'
import { shortAddress } from "../utils";
import makeBlockie from 'ethereum-blockies-base64';
import useGetUsername from "../hooks/useGetUsername";
import useDidToAddress from "../hooks/useDidToAddress";

export function User({details, accounts, isLink = true, size = "md", showBadge = true}) {
  const { address } = useDidToAddress(details?.did);
  const username = useGetUsername(details?.profile, address, details?.did);

  if(!details) {
    return null;
  }

  return(
    <div className={"user-container " + size}>
      <PfP details={details} />
      <div className="user-details-container">
        <div className="name">
          {isLink ?
            <a href={"https://orbis.club/profile/" + details.did} target="_blank" rel="noreferrer">{username}</a>
          :
            <>{username}</>
          }

        </div>
        {/** Show badge if needed */}
        {showBadge &&
          <div className="badge black">{details.metadata?.ensName ? details.metadata.ensName : shortAddress(address)}</div>
        }
        </div>
    </div>
  )
}

export function PfP({details}) {
  const { address } = useDidToAddress(details?.did);

  if(!details) {
    return null;
  }

  /** Show profile badges */
  const ProfileBadges = () => {
    return(
      <div className="badges-container">
        {details.profile?.isHuman &&
          <div>
            <img src="/img/icons/human-verified.png" />
          </div>
        }
        {details.profile?.pfpIsNft &&
          <div>
            <img src={"/img/icons/nft-verified-"+details.profile?.pfpIsNft.chain+".png"} />
          </div>
        }
      </div>
    );
  }

  const PfpImg = () => {
    if(details.profile?.pfp) {
      return <img src={details.profile?.pfp} className="pfp" />
    } else if(address) {
      return <img src={makeBlockie(address)} className="pfp" />
    } else {
      return <img src="/img/empty-state.png" className="pfp" />;
    }
  }

  return(
    <div className="pfp-container">
      {/** Show profile picture image */}
      <PfpImg />

      {/** Show profile badges such as PoH and verified NFTs */}
      <ProfileBadges />
    </div>
  )
}
