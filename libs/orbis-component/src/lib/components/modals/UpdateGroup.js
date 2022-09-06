import React, { useState, useEffect, useRef, useContext } from 'react';
import { useRouter } from 'next/router'
import { sleep } from "../../utils"
import { resizeFile, base64ToFile } from "../../utils"
import { arweavePush } from "../../utils/arweave"

/** Internal components */
import { Modal } from "../../components/Modal";
import { User } from "../../components/User";
import { SaveButton } from "../../components/SaveButton";

/** Import Context */
import { GlobalContext } from "../../contexts/GlobalContext";

/** Modal to send a message */
export function UpdateGroupModal({visible, setVisible, group, callback}) {
  const { user, setUser, orbis } = useContext(GlobalContext);
  const router = useRouter()
  const [name, setName] = useState(group?.content?.name);
  const [description, setDescription] = useState(group?.content?.description);
  const [pfp, setPfp] = useState(group?.content?.pfp);
  const [pfpIsUploading, setPfpIsUploading] = useState(false);
  const [status, setStatus] = useState(0);
  const hiddenPfpInput = useRef(null);

  /** Will trigger an upload of a pic on computer */
  function uploadPfp() {
      hiddenPfpInput.current.click();
  };

  async function _setPfp(value) {
    console.log("Should upload pfp: ", value);
    setPfp(value);
    setPfpIsUploading(true);

    /** Resize the image */
    let image;
    try {
      image = await resizeFile(value);
    } catch(e) {
      console.log("Error resizing image: " + e);
      return;
    }


    /** Upload using Bundlr */
    let data;
    try {
      data = await base64ToFile(image, "pfp");
    } catch(e) {
      console.log("Error converting base64 to a file: " + e);
      return;
    }

    let pfp_arweave_hash;
    try {
      pfp_arweave_hash = await arweavePush(data, 'image/jpg');
      console.log("https://arweave.net/" + pfp_arweave_hash);
    } catch(e) {
      console.log("Error pushing the file to arweave: " + e);
      return;
    }

    /** Save in state */
    setPfp("https://arweave.net/" + pfp_arweave_hash);
    setPfpIsUploading(false);
  }

  /** Update group using the Orbis SDK */
  async function updateGroup() {
    console.log("Enter createGroup()");
    if(!name) {
      alert("Group name is required.")
      return;
    }

    /** Show loading state */
    setStatus(1);

    let content = {name: name, description: description, pfp: pfp};

    /** Share post on Ceramic */
    let res = await orbis.updateGroup(group.stream_id, content)
    console.log("Updated group: ", res);

    /** Display final status according to answer from SDK */
    switch (res.status) {
      case 200:
        setStatus(2);

        /** If a valid callback is passed as a parameter we use it to update the state  */
        if(callback) {
          console.log("Enter callback in group");
          let _group = {...group};
          _group.content = content;
          console.log("Set group to:", _group);
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
    <Modal title="Update your group" visible={visible} setVisible={setVisible}>
      {user ?
        <>
          <div className="modal-body group-settings">

            {/** Profile picture */}
            <div className="flex-row v-align-items-center">
                <div className="profile-pic flex">
                {pfpIsUploading ?
                    <img src="/img/icons/loading-white.svg"  className="pfp" />
                :
                  <>
                    {/** Show PfP if user has already used one */}
                    {pfp ?
                      <img src={pfp} className="pfp pointer" onClick={() => uploadPfp()} />
                    :
                      <img src="/img/empty-pfp.png" className="pfp pointer" onClick={() => uploadPfp()} />
                    }
                  </>
                }

                </div>
                <div className="flex-row mleft-15">
                    <button className="btn white" onClick={() => uploadPfp()}>Upload</button>
                </div>
            </div>
            <input
              ref={hiddenPfpInput}
              type="file"
              className="hidden"
              accept="image/png, image/jpeg, image/gif"
              onChange={(e) => _setPfp(e.target.files[0])}/>

            {/** Group name */}
            <div className="input-container mtop-15">
               <label className={name && 'filled'}>Group name</label>
               <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {/** Description */}
            <div className="input-container mtop-15">
              <label className={description && 'filled'}>Bio</label>
              <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} />
            </div>

          </div>

          {/** Show modal footer */}
          <div className="modal-footer flex-row h-justify-content-end">
            <SaveButton title="Update group" status={status} onClick={updateGroup} />
          </div>
        </>
      :
        <>
          <div className="modal-body">
            <p>You must be connected to create a group.</p>
          </div>
        </>
      }

    </Modal>
  );
}
