import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { useRouter } from 'next/router'
import { useOutsideClick } from "../hooks/useOutsideClick";
import Link from 'next/link'

import { ConnectButton } from "./ConnectButton";
import { User } from "./User";
import { Group } from "./Group";
import { JoinGroupButton } from "./JoinGroupButton";
import { FollowButton } from "./FollowButton";
import { getTimestamp } from "../utils";

/** Import Context */
import { GlobalContext, ModalsContext } from "../contexts/GlobalContext";

export function RightSide({type, details}) {
  const { user, setUser, orbis } = useContext(GlobalContext);
  const { setModalVis } = useContext(ModalsContext);
  const [userMenuVis, setUserMenuVis] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef, () => setUserMenuVis(false));

  function logout() {
    let res = orbis.logout();
    setUser(null);
    setUserMenuVis(false);
  }

  return(
    <div className="right-side">
      <div className="top-right hide-tablet">
        {user ?
          <>
            <div className="relative flex-row v-align-items-center">
              <User details={user} />
              <img className="pointer" src="/img/icons/menu-dots.png" height="20" onClick={() => setUserMenuVis(true)} />
              {userMenuVis &&
                <div className="floating-menu" ref={wrapperRef}>
                  <p onClick={() => logout()}>Logout</p>
                </div>
              }
            </div>
          </>
        :
          <ConnectButton />
        }

      </div>
      <Content type={type} details={details} />
    </div>
  )
}

/** Switch  */
const Content = ({type, details}) => {
  switch (type) {
    case "home":
      return <Default />;
    case "conversation-details":
      return <ConversationDetails details={details} />
    case "user-details":
      return <UserDetails did={details} />;
    case "group-members":
      return <GroupMembers group_id={details} />;
    default:
      return null;
  }
}

/** Default RightSide that will show up on the home page right-side */
function Default() {
  const { user, orbis } = useContext(GlobalContext);
  const [activeUsers, setActiveUsers] = useState([]);
  const [userLoading, setUsersLoading] = useState(false);
  const [activeGroups, setActiveGroups] = useState([]);
  const [groupsLoading, setGroupsLoading] = useState(false);

  useEffect(() => {
    loadActiveUsers();
    loadActiveGroups();
  }, [user]);

  /** Retrieve active users */
  async function loadActiveUsers() {
    if(activeUsers.length == 0) {
      setUsersLoading(true);
    }

    let { data, error, status } = await orbis.api.rpc("active_users", { user_did: user ? user.did : "none" });

    if(error) {
      console.log("error loadActiveUsers: ", error);
    }

    if(data) {
      setActiveUsers(data);
      setUsersLoading(false);
    }
  }

  /** Retrieve active users */
  async function loadActiveGroups() {
    if(activeGroups.length == 0) {
      setGroupsLoading(true);
    }

    let { data, error, status } = await orbis.api.from("orbis_v_groups").select().filter('count_members', 'gte', 0).range(0,4).order('last_activity_timestamp', { ascending: false });

    if(error) {
      console.log("Error loading active groups: ", error);
    }

    if(data) {
      setActiveGroups(data);
      setGroupsLoading(false);
    }
  }

  return(
    <>
      <div className="community-banner">
        <h3>COMMUNITY NOTES</h3>
        <p className="mtop-10">We just launched Orbis on mainnet 🥳 You can learn more about it using our <a href="https://twitter.com/OrbisClub/status/1549062199213268994" rel="noreferrer" target="_blank">Twitter thread</a> or the <Link href="/post/kjzl6cwe1jw14a9l1l49tv4u2e8qrj1sql5ox84xn5a7jm3yh3yhlw5a9layd1r">introduction post</Link>.</p>
        <p className="center mtop-5 mbottom-5">
          <a className="btn white-border" href="https://twitter.com/OrbisClub/status/1549062199213268994" rel="noreferrer" target="_blank">ANNOUNCEMENT</a>
        </p>

      </div>
      <div>
        <h3>ACTIVE GROUPS</h3>
        {groupsLoading ?
          <p className="center h-align-self-center w-100">
            <img src="/img/icons/loading-white.svg" height="35" />
          </p>
        :
          <LoopActiveGroups activeGroups={activeGroups} />
        }

      </div>
      <div>
        <h3 className="mtop-30">ACTIVE USERS</h3>
        {userLoading ?
          <p className="center h-align-self-center w-100">
            <img src="/img/icons/loading-white.svg" height="35" />
          </p>
        :
          <LoopActiveUsers activeUsers={activeUsers} />
        }
      </div>
    </>
  )
}

/** Loop through all active users */
function LoopActiveUsers({activeUsers}) {
  if(activeUsers && activeUsers.length > 0) {
    return activeUsers.map((_user, key) => {
      return(
        <div className="mbottom-15 flex-row one-group-container" key={_user.did}>
          <div className="flex-1">
            <User details={_user.profile} />
          </div>
          <FollowButton did={_user.profile?.did} />
        </div>
      )
    });
  } else {
    return(<p className="w-100 secondary center">There isn't any new user to discover.</p>)
  }
}

/** Loop through all active users */
function LoopActiveGroups({activeGroups}) {
  if(activeGroups && activeGroups.length > 0) {
    return activeGroups.map((group, key) => {
      return(
        <div className="mbottom-15 flex-row one-group-container" key={key}>
          <div className="flex-1">
            <Group id={group.stream_id} details={group.content} isLink={true} />
          </div>
          <JoinGroupButton group_id={group.stream_id} />
        </div>
      )
    });
  } else {
    return(<p className="w-100 secondary center">There isn't any new group to discover.</p>)
  }
}

/** Return the conversation details such as group members and conversation name */
function ConversationDetails() {
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState(null);
  const { user, orbis } = useContext(GlobalContext);

  /** Use Next router to get group_id */
  const router = useRouter();
  const { conversation_id } = router.query;

  /** Load group details */
  useEffect(() => {
    if(conversation_id) {
      loadConversation();
    }
  }, [conversation_id]);

  /** Load group details */
  async function loadConversation() {
    setLoading(true);
    let { data, error, status } = await orbis.getConversation(conversation_id);

    if(error) {
      console.log("Error loading the conversation details: ", error);
    }

    if(data) {
      setConversation(data);
    }

    setLoading(false);
  }

  /** Loop through all recipients to display them */
  function LoopRecipients() {
    if(conversation && conversation.recipients_details) {
      return conversation.recipients_details.map((recipient, key) => {
        return(
          <div className="mbottom-15" key={key}>
            <User details={recipient}/>
          </div>
        )
      });
    }
  }

  return(
    <div className="conversation-details">
      {/** Show conversation details   */}
      {conversation && conversation.content &&
      <div className="details-container">
      {(conversation.content.name || conversation.content.context) &&
        <>
          <h3>DETAILS</h3>
          {conversation.content.name ?
            <p>{conversation.content.name}</p>
          :
            <p><button className="btn transparent link">+ Add a name</button></p>
          }

          {conversation.content.context &&
            <div className="flex-row v-align-items-center"><span className="fs-13 secondary fw-500 mright-5">In:</span><p>{conversation.content.context}</p></div>
          }
        </>
      }
          {/** <MiniModal />*/}
      </div>
      }


      {/** Show recipients */}
      {user &&
        <div>
          <h3>PARTICIPANTS</h3>
          {loading ?
            <p className="center h-align-self-center w-100">
              <img src="/img/icons/loading-white.svg" height="35" />
            </p>
          :
            <LoopRecipients />
          }
        </div>
      }
    </div>
  )
}

/** Display the user details in the right side */
function UserDetails({did}) {
  const { orbis } = useContext(GlobalContext);
  const [loading, setLoading] = useState(true);
  const [groupMemberships, setGroupMemberships] = useState([]);

  useEffect(() => {
    if(did) {
      loadGroups();
    }
  }, [did]);

  async function loadGroups() {
    setLoading(true);
    let { data, error, status } = await orbis.getProfileGroups(did);

    if(error) {
      console.log("Error loading user groups: ", error);
    }

    if(data) {
      console.log("User group memberships: ", data);
      setGroupMemberships(data);
      setLoading(false);
    }
  }

  return(
    <>
      <h3>MEMBER OF</h3>
      {loading ?
        <p className="center h-align-self-center w-100">
          <img src="/img/icons/loading-white.svg" height="35" />
        </p>
      :
        <LoopUserGroups groupMemberships={groupMemberships} />
      }

    </>
  )
}

/** Loop through all groups a user is a member of */
function LoopUserGroups({groupMemberships}) {
  if(groupMemberships && groupMemberships.length > 0) {
    return groupMemberships.map((groupMembership, key) => {
      return(
        <div className="mbottom-15 flex-row one-group-container" key={key}>
          <div className="flex-1">
            <Group id={groupMembership.group_id} details={groupMembership.group_details} isLink={true} />
          </div>
          <JoinGroupButton group_id={groupMembership.group_id} />
        </div>
      )
    });
  } else {
    return <p className="w-100 center tertiary mtop-10">This user isn't a member of any group.</p>
  }
}

/** Load all group members and display them */
function GroupMembers({group_id}) {
  const { orbis } = useContext(GlobalContext);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useMemo(() => {
    if(group_id) {
      loadMembers();
    }
  }, [group_id])

  /** Load group members */
  async function loadMembers() {
    setLoading(true);
    let { data, error, status } = await orbis.getGroupMembers(group_id);

    if(data) {
      setMembers(data);
      setLoading(false);
    }
  }

  /** Loop members */
  function LoopMembers() {
    return members.map((member, key) => {
      return(
        <div className="mbottom-15" key={key}>
          <User details={member.profile_details} />
        </div>
      )
    });
  }

  return(
    <>
      <h3>MEMBERS</h3>
      {loading ?
        <p className="center h-align-self-center w-100">
          <img src="/img/icons/loading-white.svg" height="35" />
        </p>
      :
        <LoopMembers />
      }

    </>
  )
}

/** Unfinished component that will be used to update some simple settings without opening a full modal */
function MiniModal() {
  return(
    <div className="mini-modal">
      <input type="text" placeholder="Enter group name" />
    </div>
  )
}
