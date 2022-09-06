import React, { useState, useEffect, useRef, useContext } from 'react';
import { sleep, randomId, shortAddress, contractToCleanName } from "../utils";

/** Import UI components */
import { User, PfP } from "./User"
import { ConnectButton } from "./ConnectButton"
import { MentionsBox } from "./MentionsBox"

/** Import Context */
import { GlobalContext } from "../contexts/GlobalContext";

/** Usernames to did relationship */
let _mentions = [];

/** Export postbox component */
export function PostBox({ type = "feed", action = "share-post", callback, placeholder = "Share your post here...", context = null, master = null, reply_to = null, encryptionRules = null }) {
  const { user, setUser, orbis } = useContext(GlobalContext);
  const [content, setContent] = useState();
  const [status, setStatus] = useState(0);
  const [enterTrigger, setEnterTrigger] = useState(false);
  const [mentionBoxVis, setMentionsBoxVis] = useState(false);
  const [focusOffset, setFocusOffset] = useState(null);
  const [focusNode, setFocusNode] = useState(null);
  const postBoxArea = useRef(null);

  useEffect(() => {
    if(reply_to) {
      if(postBoxArea.current) {
        postBoxArea.current.focus();
      }
    }
  }, [reply_to])

  useEffect(() => {
    if(type == "chat" || type == "reply") {
      setEnterTrigger(true);
    }
  }, [type])

  /** Function triggering the call to the Orbis SDK to share a post */
  async function share() {
    let _body = content;
    _body = _body.replaceAll("\n\n\n", "\n\n");

    /** Generate the content object based on if we are sharing a post or sending a DM (it's using the same component) */
    let _content;
    switch (action) {
      case "share-post":
        _content = {
          type: type,
          body: _body,
          context: context,
          master: master ? master : null,
          reply_to: reply_to ? reply_to.stream_id : null,
          mentions: _mentions
        }
        break;
      case "send-message":
        _content = {
          body: _body,
          conversation_id: context,
        }
        break;
    }


    /** Trigger share function to push the content to Ceramic */
    let _randomId = randomId();

    /** Show success state for 100ms and have optimisitic callback shared from parent before the post is actually stored */
    let _callbackContent = {
      creator: user.did,
      creator_details: {
        did: user.did,
        profile: user.profile
      },
      temporary_id: _randomId,
      stream_id: "none",
      content: _content,
      master: master,
      reply_to: reply_to ? reply_to.stream_id : null,
      reply_to_details: reply_to ? reply_to.reply_to_details : null,
      reply_to_creator_details: reply_to ? reply_to.creator : null
    }
    if(callback) {
      callback(_callbackContent);
    }

    /** Trigger post sharing and final callback */
    sharePost(_randomId, _content, _callbackContent);

    /** Reset postbox content */
    _mentions = [];
    setContent(null);
    if(postBoxArea.current) {
      postBoxArea.current.textContent = "";
      postBoxArea.current.focus();
    }

    /** If post is being shared in a feed we show the success state */
    if(type == "feed") {
      setStatus(2);
      await sleep(150);

      /** Revert to normal state */
      setStatus(0);
    }
  }

  /** Calls the Orbis SDK to share a post or a new direct message */
  async function sharePost(randomId, _content, callbackContent) {
    /** Actually share post on Ceramic */
    let res;
    if(action == "share-post") {
      if(encryptionRules) {
        res = await orbis.createPost(_content, encryptionRules)
      } else {
        res = await orbis.createPost(_content)
      }

    } else if(action == "send-message") {
      res = await orbis.sendMessage(_content);
    }

    /** Display final status according to response from SDK */
    switch (res.status) {
      case 200:
        if(callback) {
          callbackContent.stream_id = res.doc;
          callback(callbackContent);
        }
        break;
      case 300:
        console.log("Error sharing post: ", res);
        break;
    }
  }

  /** Handle input on postbox content */
  function handleInput(e) {
    let _inputValue = e.currentTarget.innerText;
    let _keyCode = e.nativeEvent.data;

    /** Manage custom actions for some keycodes */
    switch(_keyCode) {
      /** Pressing @ will trigger the opening of the mentions box */
      case "@":
        if(user.nonces && user.nonces?.global <= 0 && user.a_r <= 1) {
          return;
        } else {
          setMentionsBoxVis(true);
        }

        break;

      /** Hide mentions box when pressed enter */
      case " ":
        setMentionsBoxVis(false);
        postBoxArea.current.focus();
        break;

      default:
        setMentionsBoxVis(false);
        break;
    }

    /** Share post if enter is pressed */
    if(e.nativeEvent.inputType == "insertParagraph" || (e.nativeEvent.inputType == "insertText" &&  e.nativeEvent.data == null)) {
      if(enterTrigger == true) {
        e.preventDefault();
        e.stopPropagation();
        share();
        return;
      }
    } else {
      setContent(_inputValue);

      /** Save current position of the caret to make sure we paste at the correct location. */
      saveCaretPos(document.getSelection());
    }
  }

  /** Called when user clicks on a mention tag after typing '@' */
  function addMention(mention) {
    /** Position caret at the correct position */
    restoreCaretPos("postbox-area");

    /** Save username to did  */
    let _mentionName = mention.profile?.username?.replaceAll(" ", "");
    _mentions.push({
        username: "@" + _mentionName,
        did: mention.did
    });

    /** Add mention tag */
    var _mentionTag = "<span href='/profile/" + mention.did + "' class='primary mention' contentEditable='false' data-did='" + mention.did + "'>@" + _mentionName + "</span>&nbsp;";

    /** Remove last character from content to avoid having two '@' */
    document.execCommand("delete", null, false);

    /** Use paste to add mention tag */
    document.execCommand("insertHTML", false, _mentionTag);

    /** Hide mentions box */
    setMentionsBoxVis(false);

    /** Focus on textarea */
    postBoxArea.current.focus();
};

  /** Hide mentions box and re-focus on postbox textarea */
  function hideMentionsBoxVis() {
    /** Hide mentions box */
    setMentionsBoxVis(false);

    /** Focus on textarea */
    postBoxArea.current.focus();

    /** Position caret at the correct position */
    restoreCaretPos("postbox-area");
  }

  /** Save the position of the caret */
  function saveCaretPos(_sel) {
    setFocusOffset(_sel.focusOffset);
    setFocusNode(_sel.focusNode);
  };

  /** Restore the caret position after mention is added */
  function restoreCaretPos(_id) {
    document.getElementById(_id).focus();
    var sel = document.getSelection();
    sel.collapse(focusNode, focusOffset);
  };

  if(!user) {
    return (
      <div className="postbox connect p-15">
        <p className="center mtop-0">You need to be connected to share content.</p>
        <div className="center">
          <ConnectButton />
        </div>
      </div>
    )
  }

  if(user && user.a_r < 0) {
    return(
      <div className="postbox connect p-15">
        <p className="center mtop-0 mbottom-0">You can't post on Orbis right now.</p>
      </div>
    )
  }

  return(
    <div className="flex-column w-100">
      {/** User doesn't have any activity on a blockchain */}
      {user.nonces && user.nonces?.global <= 0 && user.a_r <= 1 &&
        <div className="no-blockchain-activity">
          <img src="/img/icons/eye-crossed-yellow.png" height="18" />
          <p>It looks like you are joining from an inactive wallet so your posts might not be visible for other users for now. We recommend joining with an active wallet.</p>
        </div>
      }


      {/** If user is replying to another post, we show the parent details here */}
      {(reply_to && reply_to.stream_id != master ) &&
        <div className="postbox-reply-to">
          <p className="mright-5 tertiary">Replying to:</p>
          <User details={reply_to.creator} showBadge={false} />
        </div>
      }
      <div className={"postbox flex-column " + type}>
        {/** If sharing an encrypted post */}
        {encryptionRules &&
          <EncryptedPostDetails encryptionRules={encryptionRules} />
        }


        {/** Allow send by pressing enter only if type is chat */}
        {(type == "chat" || type == "reply") &&
          <div className="flex-row v-align-items-center" style={{marginBottom: 8}}>
            <input type="checkbox" checked={enterTrigger} value={enterTrigger} onChange={(e) => setEnterTrigger(e.target.checked)}/>
            <label className="tertiary fs-12">Send by pressing enter</label>
          </div>
        }
        <div className={type == "chat" ? "flex flex-row" : "flex flex-column" }>
          <div className="editable-container">
            <div
              id="postbox-area"
              ref={postBoxArea}
              autoFocus={true}
              className="editable"
              contentEditable={true}
              data-placeholder={placeholder}
              onInput={(e) => handleInput(e)}>
            </div>
          </div>

          {(enterTrigger == false || ( enterTrigger == true && status != 0)) &&
            <div className="share-btn-container">
              <ShareButtonContent type={type} status={status} share={share} />
            </div>
          }
        </div>
        <div className="flex flex-1">
          {/** Show mentions box if state is true */}
          {mentionBoxVis &&
            <MentionsBox
              add={addMention}
              hideMentionsBoxVis={hideMentionsBoxVis}
              visible={mentionBoxVis}/>
          }
        </div>
      </div>
    </div>
  )
}

/** If the user is sharing an encrypted post we show this message */
function EncryptedPostDetails({encryptionRules}) {
  const [contract, setContract] = useState();
  const [explorerLink, setExplorerLink] = useState();

  useEffect(() => {
    getContract();
  }, [encryptionRules])

  /** Function to generate a clean name for the contract */
  function getContract() {
    let contract;
    contract = encryptionRules.contractAddress;
    let _contractName = contractToCleanName[contract];
    setContract(_contractName ? _contractName : shortAddress(contract));
    setExplorerLink("https://etherscan.io/address/" + contract);
  }

  return(
    <div className="no-blockchain-activity">
      <img src="/img/icons/locked-tertiary.png" height="18" />
      <p>Your post will be encrypted for <a className="blue-bold-link mleft-5 mright-5" href={explorerLink} target="_blank" rel="noreferrer">{contract}</a> holders.</p>
    </div>
  )
}

/** Show the content of the share button according to the feed's type and share status */
function ShareButtonContent({type, status, share}) {
  switch (type) {
    /** Classic postbox for social feeds */
    case "feed":
      switch (status) {
        /** User hasn't started sharing */
        case 0:
          return <div className="btn purple md share pointer" onClick={() => share()}>Share</div>;

        /** Waiting for response from Orbis SDK */
        case 1:
          return <div className="btn transparent-dashed md share pointer"><img src="/img/icons/loading-white.svg" height="15" /></div>;

        /** Sharing was successful */
        case 2:
          return <div className="btn green md share pointer">Success</div>;

        /** Error sharing post */
        case 3:
          return <div className="btn red md share pointer">Error!</div>;

        /** Default */
        default:
          return <div className="btn md purple pointer">Share</div>;
      }
      break;

    /** Share button for chat feeds and replies in comments threads */
    default:
      switch (status) {
        /** User hasn't started sharing */
        case 0:
          return <div className="btn purple rounded md share pointer" onClick={() => share()}><img src="/img/icons/send-white.png" height="15" /></div>;

        /** Waiting for response from Orbis SDK */
        case 1:
          return <div className="btn rounded transparent-dashed md share pointer"><img src="/img/icons/loading-white.svg" height="15" /></div>;

        /** Sharing was successful */
        case 2:
          return <div className="btn rounded green md share pointer"><img src="/img/icons/checkmark-black.png" height="15" /></div>;

        /** Error sharing post */
        case 3:
          return <div className="btn rounded red md share pointer"><img src="/img/icons/error-white.png" height="15" /></div>;

        /** Default */
        default:
          return <div className="btn md purple pointer">Ok</div>;
      }
      break;
  }
}
