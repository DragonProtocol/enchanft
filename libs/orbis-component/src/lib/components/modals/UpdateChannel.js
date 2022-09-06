import React, { useState, useEffect, useRef, useContext } from 'react';
import { useRouter } from 'next/router'
import { sleep } from "../../utils"

/** Internal components */
import { Modal } from "../../components/Modal";
import { User } from "../../components/User";
import { SaveButton } from "../../components/SaveButton";
import { RadioButton } from "../../components/UI"

/** Import Context */
import { GlobalContext } from "../../contexts/GlobalContext";

/** Modal to send a message */
export function UpdateChannelModal({ visible, setVisible, channel, callback }) {
  const { user, setUser, getUserGroups, orbis } = useContext(GlobalContext);
  const router = useRouter()
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("chat");
  const [status, setStatus] = useState(0);

  /** Token gating */
  const [isTokenGated, setIsTokenGated] = useState(false);
  const [ecr_chain, setEcr_chain] = useState("ethereum");
  const [ecr_contractType, setEcr_contractType] = useState();
  const [ecr_contractAddress, setEcr_contractAddress] = useState();
  const [ecr_contractMinTokenBalance, setEcr_contractMinTokenBalance] = useState();
  const [ecr_tokenId, setEcr_tokenId] = useState();

  /** Tabs */
  const [tabSelected, setTabSelected] = useState(0)

  useEffect(() => {
    console.log("type:", type);
  }, [type])

  /** Set default state */
  useEffect(() => {
    if(channel && visible) {
      /** Details */
      setName(channel.content.name);
      setDescription(channel.content.description);
      setType(channel.content.type);

      /** Token gated */
      if(channel.content.encryptionRules) {
        let _encRules = channel.content.encryptionRules;
        setIsTokenGated(true);
        setEcr_chain(_encRules.chain);
        setEcr_contractType(_encRules.contractType);
        setEcr_contractAddress(_encRules.contractAddress);
        setEcr_contractMinTokenBalance(_encRules.minTokenBalance);
      } else {
        setIsTokenGated(false);
      }
    }
  }, [channel]);

  /** Get one of the state variable */
  function getInput(type, value) {
    switch(type) {
      case "name":
        return name;
      case "description":
        return description;
      case "type":
        return type;
      case "isTokenGated":
        return isTokenGated;
      case "ecr_chain":
        return ecr_chain;
      case "ecr_contractType":
        return ecr_contractType;
      case "ecr_contractAddress":
        return ecr_contractAddress;
      case "ecr_contractMinTokenBalance":
        return ecr_contractMinTokenBalance;
      case "ecr_tokenId":
        return ecr_tokenId;
    }
  }

  /** Set one of the state variable */
  function setInput(type, value) {
    switch(type) {
      case "name":
        setName(value);
        break;
      case "description":
        setDescription(value);
        break;
      case "type":
        setType(value);
        break;
      case "isTokenGated":
        setIsTokenGated(value);
        break;
      case "ecr_chain":
        setEcr_chain(value);
        break;
      case "ecr_contractType":
        setEcr_contractType(value);
        break;
      case "ecr_contractAddress":
        setEcr_contractAddress(value);
        break;
      case "ecr_contractMinTokenBalance":
        setEcr_contractMinTokenBalance(value);
        break;
      case "ecr_tokenId":
        setEcr_tokenId(value);
        break;
    }
  }

  /** Create group using the Orbis SDK */
  async function updateChannel() {
    if(!name) {
      alert("Channel name is required.")
      return;
    }

    /** Show loading state */
    setStatus(1);

    let content = {
      group_id: channel.group_id,
      name: name,
      description: description,
      type: type
    };

    /** Add encryption rules if selected by the user */
    if(isTokenGated) {
      content.encryptionRules = {
        type: "token-gated",
        chain: ecr_chain,
        contractType: ecr_contractType,
        contractAddress: ecr_contractAddress,
        minTokenBalance: ecr_contractMinTokenBalance,
        tokenId: ecr_tokenId
      }
    } else {
      content.encryptionRules = null;
    }

    /** Share post on Ceramic */
    let res = await orbis.updateChannel(channel.stream_id, content)

    /** Display final status according to answer from SDK */
    switch (res.status) {
      case 200:
        setStatus(2);
        if(callback) {
          let _channel = {...channel};
          _channel.content = content;
          callback(_channel);
        }

        break;
      case 300:
        setStatus(3);
        break;
      default:
        setStatus(3);
        break;
    }

    /** Wait for 2 seconds before resetting the state */
    await sleep(1000);

    /** Hide group creation modal */
    setVisible(false);
  }

  return(
    <Modal
      title="Update channel"
      visible={visible}
      setVisible={setVisible}
      tabSelected={tabSelected}
      setTabSelected={setTabSelected}
      tabs={["Details", "Token gated"]}>
      {user ?
        <>
        <Content
          getInput={getInput}
          setInput={setInput}
          type={type}
          setType={setType}
          status={status}
          updateChannel={updateChannel}
          tabSelected={tabSelected}
          setTabSelected={setTabSelected} />
        </>
      :
        <>
          <div className="modal-body">
            <p>You must be connected to update this channel.</p>
          </div>
        </>
      }

    </Modal>
  )
}

/** Showing the content of the tab selected */
function Content({getInput, setInput, type, setType, status, updateChannel, tabSelected, setTabSelected}) {
  switch (tabSelected) {
    /** Details tab */
    case 0:
      return(
        <>
          <div className="modal-body">
            {/** Channel type */}
            <div className="input-container">
              <label className="filled">Channel type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="chat">Chat (Similar to a Discord experience)</option>
                <option value="feed">Feed (Posts with likes and thread)</option>
              </select>
            </div>

            {/** Channel name */}
            <div className="input-container mtop-10">
               <label className={getInput("name") && 'filled'}>Channel name</label>
               <input type="text" value={getInput("name")} onChange={(e) => setInput("name", e.target.value)} />
            </div>

            {/** Channel description */}
            <div className="input-container mtop-10">
              <label className={getInput("description") && 'filled'}>Channel description</label>
              <textarea
                  value={getInput("description")}
                  onChange={(e) => setInput("description", e.target.value)} />
            </div>
          </div>

          {/** Show modal footer */}
          <div className="modal-footer flex-row h-justify-content-end">
            <SaveButton title="Update" status={status} onClick={updateChannel} />
          </div>
        </>
      );
    case 1:
      return(
        <>
          <div className="modal-body">
            <p className="center tertiary mtop-0">You can token gate this channel to make every posts viewable only by some specific token holders.</p>
            <p className="center"><RadioButton action={() => setInput("isTokenGated", !getInput("isTokenGated"))} selected={getInput("isTokenGated")} labelRight="Token gated channel" /></p>
            {getInput("isTokenGated") &&
              <>
                {/** Chain */}
                <div className="input-container">
                  <label className="filled">Chain</label>
                  <select value={getInput("ecr_chain")} onChange={(e) => setInput("ecr_chain", e.target.value)}>
                    <option value="ethereum">Ethereum Mainnet</option>
                    <option value="arbitrum">Arbitrum</option>
                    <option value="avalanche">Avalanche</option>
                    <option value="bsc">Binance Chain</option>
                    <option value="fantom">Fantom</option>
                    <option value="xdai">Gnosis Chain (xDAI)</option>
                    <option value="optimism">Optimism</option>
                    <option value="polygon">Polygon</option>
                  </select>
                </div>

                {/** Type */}
                <div className="input-container mtop-10">
                  <label className="filled">Contract type</label>
                  <select value={getInput("ecr_contractType")} onChange={(e) => setInput("ecr_contractType", e.target.value)}>
                    <option value="ERC20">ERC20</option>
                    <option value="ERC721">ERC721</option>
                    <option value="ERC1155">ERC1155</option>
                  </select>
                </div>

                {/** Contract */}
                <div className="input-container mtop-10">
                   <label className={getInput("ecr_contractAddress") && 'filled'}>Contract address</label>
                   <input type="text" value={getInput("ecr_contractAddress")} onChange={(e) => setInput("ecr_contractAddress", e.target.value)} />
                </div>

                {/** Minimum token balance */}
                <div className="input-container mtop-10">
                   <label className={getInput("ecr_contractMinTokenBalance") && 'filled'}>Min. Balance to access the post (for ERC20 use the WEI amount)</label>
                   <input type="text" value={getInput("ecr_contractMinTokenBalance")} onChange={(e) => setInput("ecr_contractMinTokenBalance", e.target.value)} />
                </div>

                {/** Token ID shown only if ERC 1155 */}
                {getInput("ecr_contractType") == "ERC1155" &&
                  <div className="input-container mtop-10">
                     <label className={getInput("ecr_tokenId") && 'filled'}>Token ID (for ERC1155)</label>
                     <input type="text" value={getInput("ecr_tokenId")} onChange={(e) => setInput("ecr_tokenId", e.target.value)} />
                  </div>
                }
              </>
            }
          </div>

          {/** Show modal footer */}
          <div className="modal-footer flex-row h-justify-content-end">
            <SaveButton title="Update" status={status} onClick={updateChannel} />
          </div>
        </>
      );

  }
}
