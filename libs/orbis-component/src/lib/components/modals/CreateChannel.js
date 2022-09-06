import React, { useState, useEffect, useRef, useContext } from 'react';
import { useRouter } from 'next/router'
import { sleep } from "../../utils"

/** Internal components */
import { Modal } from "../../components/Modal";
import { User } from "../../components/User";
import { SaveButton } from "../../components/SaveButton";

/** Import Context */
import { GlobalContext } from "../../contexts/GlobalContext";

/** Modal to send a message */
export function CreateChannelModal({ visible, setVisible, group, callback }) {
  const { user, setUser, getUserGroups, orbis } = useContext(GlobalContext);
  const router = useRouter()
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("chat");
  const [status, setStatus] = useState(0);

  /** Create group using the Orbis SDK */
  async function createChannel() {
    console.log("Enter createChannel()");
    if(!name) {
      alert("Channel name is required.")
      return;
    }

    /** Show loading state */
    setStatus(1);

    let content = {
      group_id: group.stream_id,
      name: name,
      description: description, type: type
    };

    /** Share post on Ceramic */
    console.log("Creating channel with - group_id: ", group.stream_id);
    let res = await orbis.createChannel(group.stream_id, content)
    console.log("Created channel: ", res);

    /** Display final status according to answer from SDK */
    switch (res.status) {
      case 200:
        setStatus(2);

        if(callback) {
          let _group = {...group};
          let _channels = [...group.channels];
          _channels.push({
            stream_id: res.doc,
            content: content
          });
          _group.channels = _channels;
          callback(_group);
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
    <Modal title="Create a new channel" visible={visible} setVisible={setVisible}>
      {user ?
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
               <label className={name && 'filled'}>Channel name</label>
               <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {/** Channel description */}
            <div className="input-container mtop-10">
              <label className={description && 'filled'}>Channel description</label>
              <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
            </div>

          </div>

          {/** Show modal footer */}
          <div className="modal-footer flex-row h-justify-content-end">
            <SaveButton title="Create" status={status} onClick={createChannel} />
          </div>
        </>
      :
        <>
          <div className="modal-body">
            <p>You must be connected to create a channel.</p>
          </div>
        </>
      }

    </Modal>
  )
}
