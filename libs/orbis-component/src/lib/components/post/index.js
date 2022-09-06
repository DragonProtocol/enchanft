import React, { useState, useEffect, useRef, useContext } from 'react';

/** Import internal components */
import { Reaction }  from "./Reaction"
import { User, PfP } from "../User"
import { Group }  from "../Group"
import { Channel } from "../Channel"
import { FollowButton } from "../FollowButton"
import { shortAddress, sleep, contractToCleanName, getChannelIcon } from "../../utils";
import Link from 'next/link'

/** Import custom hooks */
import useCleanPostBody from "../../hooks/useCleanPostBody";
import useDidToAddress from "../../hooks/useDidToAddress";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useHover } from "../../hooks/useHover";

/** Import Context */
import { GlobalContext, ModalsContext } from "../../contexts/GlobalContext";

/** Clean time ago for post */
import ReactTimeAgo from 'react-time-ago'

/** Global componeent for a Post */
export function Post({post, type, showContext = true, replyTo, setReplyTo = false, showReplyTo = true, isNew, characterLimit = 280}) {
  const { user, orbis, following } = useContext(GlobalContext);
  const { setModalVis } = useContext(ModalsContext);
  const [userReaction, setUserReaction] = useState(null)
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [hoverRef, isHovered] = useHover();

  useEffect(() => {
    if(user) {
      getUserReaction();
    }
  }, [user]);

  /** If user is connected we check if it has reacted to this post */
  async function getUserReaction() {
    let { data, error, status } = await orbis.api.from("orbis_reactions").select('type').eq('post_id', post.stream_id).eq('creator', user.did);

    if(error) {
      console.log("Error getting reactions: ", error);
    }

    if(data) {
      if(data.length > 0) {
        setUserReaction(data[0].type);
      }
    }
  }

  /** Loop though all users who reacted on this post */
  function LoopFollowingReaction({reactions}) {

    /** Display username of user who reacted */
    const ReactionUser = ({reaction}) => {
      const { address } = useDidToAddress(reaction.did);

      if(reaction.profile?.username) {
        return <Link href={"/profile/" + reaction.did}>{reaction.profile.username}</Link>;
      } else {
        return <Link href={"/profile/" + reaction.did}>{shortAddress(address)}</Link>;
      }
    }

    /** Display suffix after list of reactions */
    const ReactionSuffix = ({value, length}) => {
      if(value < length - 2) {
        return   <span>, </span>
      } else if(value < length - 1) {
        return   <span> and </span>
      } else {
        return null;
      }
    }

    /** Loop through all reactions */
    const LoopReactions = () => {
      return reactions.map((reaction, key) => {
        if(key < 3) {
          return(
            <>
              <span className="fw-500"><ReactionUser reaction={reaction} key={key} /></span>
              <ReactionSuffix value={key} length={reactions.length} />
            </>
          )
        } else {
          return null;
        }
      });
    }

    return(
      <>
        <LoopReactions />
        {reactions.length > 3 &&
          <span className="fw-500">+ {reactions.length - 3} user(s)</span>
        }
      </>
    )
  }

  return(
    <div className={isNew ? "post new" : "post"} ref={hoverRef}>
      {/** Show if this post was liked by following user */}
      {post.reactions_from_following && post.reactions_from_following.length > 0 &&
        <p className="secondary fs-13 m-0 mbottom-10 reaction-following">Reaction(s) from <LoopFollowingReaction reactions={post.reactions_from_following} />.</p>
      }

      {/** If post is a reply to another one, we display the parent details here */}
      {post.reply_to && post.reply_to_details && showReplyTo &&
        <ReplyTo
          creatorDetails={post.reply_to_creator_details}
          details={post.reply_to_details}
          onClick={() => setModalVis("post-details", true, post.master ? post.master : post.stream_id)} />
      }

      {/** User who shared the post */}
      <div className="flex-row">
        <div className={type == "feed" ? "flex-1 flex-row v-align-items-start" : "flex-row v-align-items-start"}>
          <User details={post.creator_details} />
          {/** If post was shared in a specific context display those contexts */}
          {(post.context != null && type == "feed" && showContext) &&
            <Context context={post.context} contextDetails={post.context_details} />
          }
        </div>

        {type == "feed" ?
          <div className="flex suffix h-flex-end">
            {post.timestamp &&
              <span className="secondary fs-14"><ReactTimeAgo date={post.timestamp * 1000} locale="en-US" /></span>
            }
          </div>
        :
          <div className="flex suffix h-flex-start ptop-2">
            {post.timestamp &&
              <span className="secondary fs-13 mleft-5"> · <ReactTimeAgo date={post.timestamp * 1000} locale="en-US" /></span>
            }
          </div>
        }
      </div>
      {type == "chat" && isHovered && post.stream_id != "none" &&
        <div className="post-action-hover-container">
          <div className="item" onClick={() => setReplyTo({stream_id: post.stream_id, creator: post.creator_details, reply_to_details: post.content})}>
            {replyTo && (replyTo.stream_id == post.stream_id) ?
              <img src={"/img/icons/reaction-replyto-active.png"} height="15" />
            :
              <img src={"/img/icons/reaction-replyto.png"} height="15" />
            }
          </div>
          <div className="item">
            <a href={"https://cerscan.com/mainnet/stream/" + post.stream_id} target="_blank" rel="noreferrer" className="flex">
                <img src="/img/icons/cerscan-proof.png" height="15" />
            </a>
          </div>
        </div>
      }

      {/** Show post content */}
      <PostContent post={post} characterLimit={characterLimit} />

      {/** Show follow bar */}
      {user && following && following.length > 0 && user.did != post.creator && following.includes(post.creator) == false && type == "feed" &&
        <div className="no-blockchain-activity follow flex-row center mtop-10" style={{justifyContent: "center", padding: 10}}>
          <p className="mright-10">You aren't following this user</p>
          <FollowButton did={post.creator} />
        </div>
      }

      {/** Show reactions only if post is in a feed */}

      {type == "feed" &&
        <div className="flex-row">
          <div className="reactions flex-row flex-1">
            {/** Show reply to CTA only if `setReplyTo` function is passed as a parameter */}
            {setReplyTo ?
              <>
                {user &&
                  <>
                    {(replyTo == post.stream_id) ?
                      <div className="one-reaction active">
                        <img src={"/img/icons/reaction-replyto-active.png"} height="18" />
                        <span>Reply</span>
                      </div>
                    :
                      <div className="one-reaction" onClick={() => setReplyTo({stream_id: post.stream_id, creator: post.creator_details})}>
                        <img src={"/img/icons/reaction-replyto.png"} height="18" />
                        <span>Reply</span>
                      </div>
                    }
                  </>
                }

              </>
            :
              <>
                {/** Show reactions count */}
                <div className="one-reaction" onClick={() => setModalVis("post-details", true, post.master ? post.master : post.stream_id)}>
                  <img src={"/img/icons/reaction-comment.png"} height="18" />
                  <span>{post.count_replies}</span>
                </div>
              </>
            }

            {/** Show post reactions CTA (like, haha and downvote) */}
            <Reaction active={userReaction == "like" ? true : false} post_id={post.stream_id} type="like" count={post.count_likes ? post.count_likes : 0} />
            <Reaction active={userReaction == "haha" ? true : false} post_id={post.stream_id} type="haha" count={post.count_haha ? post.count_haha : 0} />
            <Reaction active={userReaction == "downvote" ? true : false} post_id={post.stream_id} type="downvote" />
          </div>

          <div className="reactions flex-row h-flex-end v-align-items-center">
            {/** Share button */}
            <div className="one-reaction" onClick={() => setShowShareMenu(true)}>
              <img src="/img/icons/share.png" height="18" />
            </div>
            {showShareMenu &&
                <ShowShareMenu setShowShareMenu={setShowShareMenu} post_id={post.stream_id} />
            }

            {/** Link to Cerscan proof */}
            {post.stream_id != "none" ?
                <div className="one-reaction mright-5">
                    <a href={"https://cerscan.com/mainnet/stream/" + post.stream_id} target="_blank" rel="noreferrer" className="flex">
                        <img src="/img/icons/cerscan-proof.png" height="18" />
                    </a>
                </div>
            :
                <div className="one-reaction mright-5">
                    <img src="/img/icons/loading-white.svg" height="15" />
                </div>
            }
          </div>
        </div>
      }
    </div>
  )
}

/** Show share link menu */
function ShowShareMenu({ setShowShareMenu, post_id }) {
  const [copyBtnState, setCopyBtnState] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef, () => setShowShareMenu(false));

  async function copyLink() {
    navigator.clipboard.writeText("https://orbis.club/post/" + post_id);
    setCopyBtnState(1);
    await sleep(1000);
    setCopyBtnState(0);
    setShowShareMenu(false);
  }
  return(
    <div className="floating-menu" style={{top: "initial", bottom: 35, right: 35}} ref={wrapperRef}>
      {copyBtnState == 0 ?
        <p onClick={() => copyLink()}>Copy post link</p>
      :
        <p style={{color: "#5ef8a1"}}><img src="/img/icons/check-green.png" className="mright-5" height="14" /> <span>Copied!</span></p>
      }
    </div>
  );
}

/** Show reply to component */
function ReplyTo({creatorDetails, creatorDid, details, onClick}) {
  return(
    <p className="flex-row reply-to-container" onClick={onClick}>
        <div className="link-reply"></div>
        <div className="reply-to-content">
          <User showBadge={false} details={creatorDetails} isLink={false} />
          <span className="primary reply-to-content-post">{details.body?.substring(0, 60)}...</span>
        </div>
    </p>
  );
}

/** Show body or hiddent post */
function PostContent({post, characterLimit: _characterLimit}) {
  const [characterLimit, setCharacterLimit] = useState(_characterLimit);

  const [showContent, setShowContent] = useState(false);

  if(showContent == false && (post.creator_details.nonces && post.creator_details.nonces?.global <= 0 && post.creator_details.a_r <= 1)) {
    return(
      <div className="no-blockchain-activity">
        <img src="/img/icons/eye-crossed-tertiary.png" height="18" />
        <p>This post was shared from a user with an inactive wallet. <span className="mleft-5 blue-bold-link" onClick={() => setShowContent(true)}>Show content</span></p>
      </div>
    )
  } else {
    return (
      <>
        {post.content.encryptedBody ?
          <EncryptedPostBody post={post} characterLimit={characterLimit}  />
        :
          <PostBody post={post} characterLimit={characterLimit} />
        }

        {post.content?.body && characterLimit && post.content.body.length > characterLimit &&
          <div className="no-blockchain-activity flex-row center mtop-10" style={{justifyContent: "center", padding: 10}}>
            <span className="blue-bold-link fs-14" onClick={() => setCharacterLimit(null)}>View more</span>
          </div>
        }
      </>
    );
  }
}

/** Returns the body of the post */
function PostBody({post, characterLimit}) {
  const body = useCleanPostBody(post, characterLimit);

  return <p className="content">{body}</p>
}

/** Try to decrypt and display an encrypted post */
function EncryptedPostBody({post, characterLimit}) {
  const { orbis } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [body, setBody] = useState(false);
  const [status, setStatus] = useState();
  const [decryptedPost, setDecryptedPost] = useState(post);
  const [contract, setContract] = useState();
  const [explorerLink, setExplorerLink] = useState();

  useEffect(() => {
    let active = true
    decrypt()
    getContract()
    return () => { active = false }

    /** Function to decrypt post */
    async function decrypt() {
      setLoading(true);
      /**
       * If body passed as a parameter use it immediately without decrypting the content
       * (that's the case when the post was just shared and added as a callback)
       */
      if(post.content?.body) {
        /** Save in state */
        setBody(post.content.body);
        let _decryptedPost = {...post};
        _decryptedPost.content.body = post.content.body;
        setDecryptedPost(_decryptedPost);
      }

      /** Otherwise we decrypt the content using Lit Protocol and return the result. */
      else if(post.content?.encrypteBody?.encryptedString != {}) {
        let res = await orbis.decryptPost(post.content);
        if (!active) { return }
        /** Save in state */
        if(res.status == 300) {
          setStatus(300)
        } else {
          let _decryptedPost = {...post};
          _decryptedPost.content.body = res.result;
          setDecryptedPost(_decryptedPost);
          setBody(res.result);
        }
      } else {
        return null;
      }

      setLoading(false);
    }

    /** Function to generate a clean name for the contract */
    function getContract() {
      let contract;
      let _access = JSON.parse(post.content.encryptedBody.accessControlConditions);
      if(_access && _access.length > 0) {
        contract = _access[0].contractAddress;
        let _contractName = contractToCleanName[contract];
        setContract(_contractName ? _contractName : shortAddress(contract));
        setExplorerLink("https://etherscan.io/address/" + contract);
      }
    }
  }, []);

  /** Show loading state */
  if(loading) {
    return <div className="no-blockchain-activity">
      <img src="/img/icons/eye-crossed-tertiary.png" height="18" />
      <p>Decrypting the post...</p>
    </div>
  }

  if(status == 300) {
    return (
      <div className="no-blockchain-activity">
        <img src="/img/icons/locked-tertiary.png" height="18" />
        <p>This post is token-gated for <a className="blue-bold-link" href={explorerLink} target="_blank" rel="noreferrer">{contract}</a> holders and you don't have access to it.</p>
      </div>
    )
  }

  /** Show body or encrypted content info */
  if(body) {
    return (
      <>
        <PostBody post={decryptedPost} characterLimit={characterLimit} />
        <div className="no-blockchain-activity unlocked mtop-10">
          <img src="/img/icons/unlocked-tertiary.png" height="18" />
          <p>You unlocked this token-gated post for  <a className="blue-bold-link" href={explorerLink} target="_blank" rel="noreferrer" >{contract}</a> holders.</p>
        </div>
      </>
    );
  } else {
    return (
      <div className="no-blockchain-activity">
        <img src="/img/icons/locked-tertiary.png" height="18" />
        <p>This post is token-gated.</p>
      </div>
    )
  }
}

/** Show the context on which this post has been shared */
function Context({context, contextDetails}) {
  if (typeof context === 'string' || context instanceof String) {
    if(contextDetails && contextDetails?.group_details) {
      return(
        <p className="context-details">
          <div className={contextDetails?.channel_details ?  "hide-mobile flex-row" : "flex-row"}>
            <span className="secondary mright-5">in </span>
            <Group id={contextDetails?.group_id} details={contextDetails?.group_details} isLink={true} showPfp={false} />
          </div>
          {contextDetails?.channel_details &&
            <>
              <span className="tertiary mleft-5 mright-5"> / </span>
              <Channel id={contextDetails?.channel_id} group_id={contextDetails?.group_id} details={contextDetails?.channel_details} isLink={true} />
            </>
          }
        </p>
      );
    } else {
      return(
        <p className="context-details">
          <span className="secondary mright-5">in: </span><span className="primary word-break-all">{context}</span>
        </p>
      );
    }

  } else {
    return null;
  }
}
