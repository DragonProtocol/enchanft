import React, { useState, useEffect, useRef, useContext } from 'react';

import { User } from "./User";

/** Import Context */
import { GlobalContext } from "../contexts/GlobalContext";

/** Search box to retrive users based on the searched username */
export function MentionsBox({add}) {
  const [search, setSearch] = useState();
  const searchInput = useRef(null);

  useEffect(() => {
    if(searchInput.current) {
        searchInput.current.focus();
    }
  }, []);

  return(
    <div className="mentions-box">
      <div className="search-input-container">
        <input ref={searchInput} value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Username" />
      </div>
      <div className="search-results">
        <SearchResults search={search} add={add} />
      </div>
    </div>
  )
}

/** Will query the indexer and display the search results */
function SearchResults({search, add}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, orbis } = useContext(GlobalContext);

  useEffect(() => {
    loadUsers();
  }, [search])

  /** Load users with similar username from db */
  async function loadUsers() {
    setLoading(true);
    let { data, error, status } = await orbis.getProfilesByUsername(search);
    setLoading(false);

    if(error) {
      console.log("Error querying Orbis usernames: ", error);
    }

    if(data) {
      setUsers(data);
    } else {
      setUsers([]);
    }
  }

  /** Show loading state */
  if(loading) {
    return(
      <p className="center">
        <img src="/img/icons/loading-white.svg" height="15" />
      </p>
    )
  }

  /** Display results */
  if(users && users.length > 0) {
    return users.map((_user, key) => {
      return(
        <div className="one-user-suggestion" onClick={() => add(_user.details)} key={key}>
          <User  details={_user.details} key={key} isLink={false} />
        </div>
      )
    });
  } else {
    return <p>We haven't found any users for this username.</p>
  }
}
