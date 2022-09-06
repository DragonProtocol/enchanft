import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { sleep } from "../utils";
import { useOutsideClick } from "../hooks/useOutsideClick";

/** Import UI components */
import { User } from "./User"
import { Post } from "./post/"
import { PostBox } from "./PostBox"
import { ConnectButton } from "./ConnectButton"

/** Import Context */
import { GlobalContext } from "../contexts/GlobalContext";

/** Returns the feed component which will be displayed differently according to its type */
export function Feed({type = "feed", showPostBox = true, context = null, did = null, autoRefresh = false, encryptionRules = null}) {
  const { user, setUser, orbis } = useContext(GlobalContext);
  const [posts, setPosts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [replyTo, setReplyTo] = useState(null);

  /** Used only for the global feed settings */
  const [algo, setAlgo] = useState("recommendations");

  useEffect(() => {
    if(!context && !did) {
      load(true, autoRefresh, false, 0);
    }
  }, [algo])

  useEffect(() => {
    setPage(0);
    load(true, autoRefresh, false, 0);
  }, [context, did, user])

  /** Refresh feed with latest post and reset pagination */
  function refresh() {
    setPage(0);
    load(false, false, true, 0);
  }

  /** Load more posts and add it to the existing array */
  function loadMore() {
    let _page = page + 1;
    load(false, false, false, _page);
    setPage(_page);
  }

  /** Load posts from Orbis */
  async function load(showLoadingState, autoRefresh = false, showRefresh = false, _page) {
    /** Show loading state if requested */
    if(showLoadingState) {
      setLoading(true);
    }

    /** Show refresh state on the RefreshButton */
    if(showRefresh) {
      setRefreshing(true);
    }

    /** Perform query against Orbis API */
    let query;
    if(did) {
      /** Query posts from a specific profile */
      query = orbis.getPosts({did: did}, _page);
    } else if(context) {
      /** Query with or without context */
      query = orbis.getPosts({context: context}, _page);
    } else {
      /** This query will return posts shared in the global feed from our simple recommendation algorithm */
      query = orbis.getPosts({algorithm: algo}, _page);
    }
    const { data, error, status } = await query;

    /** Handle API query errors */
    if(error) {
      console.log("Error querying posts: ", error);
      return;
    }

    /** Update state with posts returned */
    if(data) {
      if(_page == 0) {
        setPosts(data);
      } else {
        let _posts = [...posts];
        let __posts = _posts.concat(data);
        setPosts(__posts);
      }

    } else {
      setPosts([]);
    }

    /** Show feed as loaded */
    setLoading(false);
    setRefreshing(false);

    /** If auto refresh is enabled we refresh this query every 5 seconds. */
    if(autoRefresh) {
      await sleep(false, 10000);
      load();
    }
  }

  /** Adds a post newly shared to the already loaded list of posts */
  function callbackPostShared(nPost) {
    /** Duplicate posts */
    let _posts = [...posts];

    /** Check if callback is after success state or if it's to display the temporary post */
    if(nPost.stream_id == "none") {
      setPosts([nPost, ..._posts]);
    } else {
      setPosts([nPost, ..._posts]);
    }

    /** Reset reply to */
    if(setReplyTo) {
      setReplyTo(null);
    }
  }

  /** Simple component used to refresh the list of posts */
  function RefreshButton() {
    if(refreshing) {
      return(
          <button className="btn black rounded-border"><img src="/img/icons/loading-white.svg" height="15" /></button>
      );
    } else {
      return(
          <button className="btn black rounded-border" onClick={() => refresh()}><img src="/img/icons/refresh-white.png" height="11" className="mright-5" /><span>Refresh</span></button>
      );
    }
  }

  /** Show the currently selected algorithm and allow users to pick another one */
  function AlgoPicker() {
    const [showAlgos, setShowAlgos] = useState(false);
    const wrapperRef = useRef(null);
    useOutsideClick(wrapperRef, () => setShowAlgos(false));

    /** Update algo in state and hide menu */
    function updateAlgo(_algo) {
      setAlgo(_algo);
      setShowAlgos(false);
    }

    /** Show currently selected algorithm */
    function CurrentAlgo() {
      switch (algo) {
        case "recommendations":
          return "Recommendations";
        case "all-posts":
          return "All posts";
        case "all-posts-non-filtered":
          return "Non filtered all posts";
        default:
          return algo;
      }
    }

    return(
      <div ref={wrapperRef}>
        <button className="btn black rounded-border v-align-items-center" onClick={() => setShowAlgos(true)}><span className="mright-5"><CurrentAlgo /></span><img src="/img/icons/caret-down-white.png" height="5" /></button>
        {showAlgos &&
          <div className="floating-menu">
              <p onClick={() => updateAlgo("recommendations")}>{algo == "recommendations" && <img src="/img/icons/check-green.png" className="mright-5" height="14" />}Recommendations</p>
              <p onClick={() => updateAlgo("all-posts")}>{algo == "all-posts" && <img src="/img/icons/check-green.png" className="mright-5" height="14" />}All posts</p>
              <p onClick={() => updateAlgo("all-posts-non-filtered")}>{algo == "all-posts-non-filtered" && <img src="/img/icons/check-green.png" className="mright-5" height="14" />}Non filtered all posts</p>
          </div>
        }
      </div>
    )
  }

  /** Simple component used to load more posts */
  function LoadMoreButton() {
    if(refreshing) {
      return(
        <div className="p-15">
          <div className="btn black"><img src="/img/icons/loading-white.svg" height="15" /></div>
        </div>
      );
    } else {
      return(
        <div className="p-15">
          <div className="btn black" onClick={() => loadMore()}>Load older posts</div>
        </div>
      );
    }
  }

  switch(type) {
    /** Display component as a classic social feed */
    case "feed":
      return(
        <div className="flex-column w-100">

          {/** Show post box on top of the feed */}
          {showPostBox &&
            <div className="mbottom-15 z-index-15">
              <PostBox callback={callbackPostShared} context={context} encryptionRules={encryptionRules} />
            </div>
          }

          {loading ?
            <p className="center h-align-self-center w-100">
              <img src="/img/icons/loading-white.svg" height="35" />
            </p>
          :
            <>
              {/** Show posts or empty state */}
              {!posts || posts.length == 0 ?
                <p className="center w-100 tertiary">There isn't any post shared here.</p>
              :
                <>
                  <div className="flex-row mbottom-10 relative">
                    <RefreshButton />
                    <div className="flex-1"></div>
                    {/** We only show the algo picker on the global feed */}
                    {!context && !did &&
                      <AlgoPicker />
                    }
                  </div>
                  <Posts posts={posts} context={context} type="feed" />

                  {posts.length >= ((page + 1) * 50 - 1) &&
                    <LoadMoreButton />
                  }
                </>
              }
            </>
          }
        </div>
      );

    /** Display component as a server chat experience */
    case "chat":
      return(
        <>
          {/** Show posts or empty state */}
          {!posts || posts.length == 0 ?
            <div className="flex-1">
              <p className="center w-100 tertiary">There isn't any post shared in this channel.</p>
            </div>
          :
            <div className="flex-1 feed-posts-container chat">
              {loading ?
                <p className="center h-align-self-center w-100">
                  <img src="/img/icons/loading-white.svg" height="35" />
                </p>
              :
                <>
                  <Posts replyTo={replyTo} setReplyTo={setReplyTo} posts={posts} context={context} type="chat" />
                  {posts.length >= ((page + 1) * 50 - 1) &&
                    <LoadMoreButton />
                  }
                </>
              }

            </div>
          }

          <div className="flex mtop-15">
            {user ?
              <PostBox reply_to={replyTo} setReplyTo={setReplyTo} type="chat" callback={callbackPostShared} context={context} encryptionRules={encryptionRules} />
            :
              <div className="postbox connect p-15">
                <p className="center mtop-0">You need to be connected to share content.</p>
                <div className="center">
                  <ConnectButton />
                </div>
              </div>
            }

          </div>
        </>
      )

    /** We should never be in this situation */
    default:
      return null;
  }
}

/** Loop though all posts available and display them */
function Posts({ posts, context, type, replyTo, setReplyTo }) {
  /** Display posts */
  if(posts) {
    return posts.map((post, key) => {
      return(
        <Post post={post} replyTo={replyTo} setReplyTo={setReplyTo} type={type} showContext={context ? false : true} key={post.stream_id} isNew={post.stream_id == "none" ? true : false} />
      )
    });
  } else {
    return <p className="white">Loading...</p>
  }
}
