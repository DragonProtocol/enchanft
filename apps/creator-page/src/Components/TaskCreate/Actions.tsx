import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { checkTweetIdValid, checkTwitterNameValid } from '../../api';
import { CREATE_TASK_DEFAULT_INVITE_NUM } from '../../utils/constants';
import { connectionSocialMedia } from '../../utils/socialMedia';
import IconCheckbox from '../Icons/IconCheckbox';
import IconCheckboxChecked from '../Icons/IconCheckboxChecked';
import IconDiscord from '../Icons/IconDiscord';
import IconPlus from '../Icons/IconPlus';
import IconWL from '../Icons/PngIconWL';
import IconTwitter from '../Icons/IconTwitter';
import PngIconDelete from '../Icons/PngIconDelete';
import PngIconDone from '../Icons/PngIconDone';
import { Action, ActionType, ActionTypeMore } from './type';

export default function Actions({
  hasInviteBot,
  projectName,
  projectTwitter,
  followTwitters,
  updateStateActions,
  updateStateFollowTwitters,
}: {
  hasInviteBot: boolean;
  projectName: string;
  projectTwitter: string;
  followTwitters: string[];
  updateStateActions: (arg0: Action[]) => void;
  updateStateFollowTwitters: (arg0: string[]) => void;
}) {
  // TODO
  const discord =
    'account.accounts.find((item) => item.accountType === ChainType.DISCORD)';
  const twitter =
    'account.accounts.find((item) => item.accountType === ChainType.TWITTER)';
  const [followTwitter, setFollowTwitter] = useState(false);
  const [followTwitterLinkResult, setFollowTwitterLinkResult] = useState<
    Array<string>
  >([]);
  const [hasDiscordRole, setHasDiscordRole] = useState(false);
  const [discordRole, setDiscordRole] = useState('');
  const [discordRoleDesc, setDiscordRoleDesc] = useState('');
  const [joinDiscord, setJoinDiscord] = useState(false);
  const [inviteDiscord, setInviteDiscord] = useState(false);
  const [inviteDiscordNum, setInviteDiscordNum] = useState(
    CREATE_TASK_DEFAULT_INVITE_NUM
  );
  const [inviteFriends, setInvalidFriends] = useState(false);
  const [inviteNum, setInviteNum] = useState(CREATE_TASK_DEFAULT_INVITE_NUM);
  const [likeTwitter, setLikeTwitter] = useState(false);
  const [likeTwitterLink, setLikeTwitterLink] = useState('');
  const [retweetTwitter, setRetweetTwitter] = useState(false);
  const [retweetId, setRetweetId] = useState('');
  const [joinCommunity, setJoinCommunity] = useState(false);
  const [joinCommunityContribution, setJoinCommunityContribution] =
    useState(false);
  const [joinCommunityContributionNum, setJoinCommunityContributionNum] =
    useState(20);
  const [custom, setCustom] = useState([
    {
      type: ActionType.UNKNOWN,
      name: '',
      typeMore: ActionTypeMore.CUSTOM,
      select: false,
      description: '',
      url: '',
      prompt: '',
      err: false,
    },
  ]);
  useEffect(() => {
    const actions: Action[] = [];
    if (followTwitter && followTwitterLinkResult.length > 0) {
      actions.push({
        name: `Follow @${followTwitterLinkResult.join('@')} on Twitter`,
        type: ActionType.TWITTER,
        typeMore: ActionTypeMore.FOLLOW_TWITTER,
        description: '',
        accounts: followTwitterLinkResult,
      });
      updateStateFollowTwitters(followTwitterLinkResult);
      // } else if (communityTwitterName) {
      //   updateStateFollowTwitters([communityTwitterName])
    }
    if (joinDiscord) {
      const msg = document.getElementById('join-discord-msg')?.textContent;
      msg &&
        actions.push({
          name: msg,
          type: ActionType.DISCORD,
          typeMore: ActionTypeMore.JOIN_DISCORD,
          description: '',
        });
    }
    if (inviteFriends && inviteNum) {
      const msg = document.getElementById('invite-friends-msg')?.textContent;
      msg &&
        actions.push({
          name: msg,
          type: ActionType.UNKNOWN,
          typeMore: ActionTypeMore.INVITE_PEOPLE,
          description: '',
          num: inviteNum,
        });
    }

    if (inviteDiscord && inviteDiscordNum) {
      const msg = document.getElementById('invite-discord-msg')?.textContent;
      msg &&
        actions.push({
          name: msg,
          type: ActionType.UNKNOWN,
          typeMore: ActionTypeMore.DISCORD_INVITES_PEOPLE,
          description: '',
          num: inviteDiscordNum,
        });
    }

    if (likeTwitter && likeTwitterLink) {
      const msg = document.getElementById('like-twitter-msg')?.textContent;
      msg &&
        actions.push({
          name: msg,
          type: ActionType.TWITTER,
          typeMore: ActionTypeMore.LIKE_TWEET,
          description: '',
          url: `https://twitter.com/intent/like?tweet_id=${likeTwitterLink}`,
          tweet_id: likeTwitterLink,
        });
    }
    if (retweetId && retweetTwitter) {
      const msg = document.getElementById('retweet-twitter-msg')?.textContent;
      msg &&
        actions.push({
          name: msg,
          type: ActionType.TWITTER,
          typeMore: ActionTypeMore.RETWEET,
          description: '',
          url: `https://twitter.com/intent/retweet?tweet_id=${retweetId}`,
          tweet_id: retweetId,
        });
    }
    if (joinCommunity) {
      const msg = document.getElementById('join-community-msg')?.textContent;
      msg &&
        actions.push({
          name: msg,
          type: ActionType.NOTIFY,
          typeMore: ActionTypeMore.TURN_ON_NOTIFICATION,
          description: '',
        });
    }
    if (joinCommunityContribution && joinCommunityContributionNum) {
      const msg = document.getElementById(
        'join-community-contribution-msg'
      )?.textContent;
      msg &&
        actions.push({
          name: msg,
          type: ActionType.UNKNOWN,
          typeMore: ActionTypeMore.MEET_CONTRIBUTION_SCORE,
          description: '',
          require_score: joinCommunityContributionNum,
        });
    }

    if (hasDiscordRole && discordRole.trim()) {
      actions.push({
        name: `Get【${discordRole.trim()}】Role on Discord`,
        type: ActionType.DISCORD,
        typeMore: ActionTypeMore.DISCORD_OBTAIN_ROLE,
        description: discordRoleDesc.trim(),
        role: discordRole.trim(),
      });
    }

    const resultCustom = custom.filter(
      (item) => item.select && item.name && item.url
    );
    actions.push(...resultCustom);
    updateStateActions(actions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    followTwitterLinkResult,
    followTwitter,
    joinDiscord,
    inviteDiscord,
    inviteDiscordNum,
    inviteFriends,
    inviteNum,
    likeTwitter,
    likeTwitterLink,
    retweetTwitter,
    retweetId,
    joinCommunity,
    joinCommunityContribution,
    joinCommunityContributionNum,
    hasDiscordRole,
    discordRole,
    discordRoleDesc,
    custom,
  ]);

  return (
    <SelectActionsBox>
      <div className="subtitle">
        <span>Select actions</span>
      </div>
      <div className="content">
        <div>
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={followTwitter}
                onChange={() => {
                  setFollowTwitter(!followTwitter);
                }}
              />
              <span id="follow-twitter-msg" className="msg">
                Follow this account on Twitter
              </span>
              <IconTwitter />
            </div>
            {twitter ? (
              <>
                {followTwitter && (
                  <>
                    <TwitterFollowed
                      followTwitterLinkResult={followTwitterLinkResult}
                      updateTwitterLinkResult={(data) => {
                        setFollowTwitterLinkResult(data);
                      }}
                    />
                    {followTwitterLinkResult.length < 5 && (
                      <AddTwitterToFollowed
                        followTwitterLinkResult={followTwitterLinkResult}
                        addValid={(data) => {
                          setFollowTwitterLinkResult([
                            ...followTwitterLinkResult,
                            data,
                          ]);
                        }}
                      />
                    )}
                  </>
                )}
              </>
            ) : (
              <div className="help">
                <ConnectTwitter />
              </div>
            )}
          </div>
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={likeTwitter}
                onChange={() => {
                  if (!twitter) return;
                  setLikeTwitter(!likeTwitter);
                }}
              />
              <span id="like-twitter-msg" className="msg">
                Like the tweet
              </span>
              <IconTwitter />
            </div>
            <div className="help">
              {twitter ? (
                likeTwitter && (
                  <TweetIdInput
                    retweetId={likeTwitterLink}
                    setRetweetId={(id) => {
                      setLikeTwitterLink(id);
                    }}
                  />
                )
              ) : (
                <ConnectTwitter />
              )}
            </div>
          </div>
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={retweetTwitter}
                onChange={() => {
                  if (!twitter) return;
                  setRetweetTwitter(!retweetTwitter);
                }}
              />
              <span id="retweet-twitter-msg" className="msg">
                Retweet the tweet
              </span>
              <IconTwitter />
            </div>
            <div className="help">
              {twitter ? (
                retweetTwitter && (
                  <TweetIdInput
                    retweetId={retweetId}
                    setRetweetId={(id) => {
                      setRetweetId(id);
                    }}
                  />
                )
              ) : (
                <ConnectTwitter />
              )}
            </div>
          </div>

          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={inviteFriends}
                onChange={() => {
                  const nextValue = !inviteFriends;
                  setInvalidFriends(nextValue);
                }}
              />
              <span id="invite-friends-msg" className="msg">
                invite
                <input
                  title="task-invite"
                  min={'1'}
                  type="number"
                  value={inviteNum === 0 ? '' : inviteNum.toString()}
                  placeholder="X"
                  onKeyPress={numberInput}
                  onChange={(e) => {
                    if (inviteFriends) setInviteNum(Number(e.target.value));
                  }}
                />
                <span>{` ${inviteNum} `}</span>
                friends to take the Task
              </span>
              <IconWL />
            </div>
          </div>
        </div>
        <div>
          {hasInviteBot && (
            <div className="content-item">
              <div className="desc">
                <CustomCheckBox
                  checked={joinDiscord}
                  onChange={() => {
                    setJoinDiscord(!joinDiscord);
                  }}
                />{' '}
                <span id="join-discord-msg" className="msg">
                  Join Discord Server
                </span>
                <IconDiscord />
              </div>
            </div>
          )}
          {hasInviteBot && (
            <div className="content-item">
              <div className="desc">
                <CustomCheckBox
                  checked={inviteDiscord}
                  onChange={() => {
                    setInviteDiscord(!inviteDiscord);
                  }}
                />
                <span id="invite-discord-msg" className="msg">
                  Invite
                  <input
                    placeholder="X"
                    min={'1'}
                    type="number"
                    title="invite-discord"
                    value={
                      inviteDiscordNum === 0 ? '' : inviteDiscordNum.toString()
                    }
                    onKeyPress={numberInput}
                    onChange={(e) => {
                      if (inviteDiscord)
                        setInviteDiscordNum(Number(e.target.value));
                    }}
                  />
                  <span>{` ${inviteDiscordNum} `}</span>
                  Friends to Discord Server
                </span>
                <IconDiscord />
              </div>
              {/* <div className="help">{discord ? null : <ConnectDiscord />}</div> */}
            </div>
          )}
          {hasInviteBot && (
            <div className="content-item">
              <div className="desc">
                <CustomCheckBox
                  checked={hasDiscordRole}
                  onChange={() => {
                    setHasDiscordRole(!hasDiscordRole);
                  }}
                />
                <span id="discord-role-msg" className="msg">
                  Get the role on Discord
                </span>
                <IconDiscord />
              </div>
              {hasDiscordRole && (
                <>
                  <div className="help">
                    <span className="username tint">Role name:</span>
                    &nbsp;
                    <div className={'input-box'}>
                      <input
                        type="text"
                        title="discord-role"
                        value={discordRole}
                        onChange={(e) => {
                          setDiscordRole(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="help">
                    <span className="username tint">Description:</span>
                    <div className={'input-box'}>
                      <input
                        type="text"
                        title="discord-role"
                        value={discordRoleDesc}
                        onChange={(e) => {
                          setDiscordRoleDesc(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {/* <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={joinCommunity}
                onChange={() => {
                  setJoinCommunity(!joinCommunity)
                }}
              />
              <span id="join-community-msg" className="msg">
                Join the community
              </span>
              <IconNotify />
            </div>
          </div> */}
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={joinCommunityContribution}
                onChange={() => {
                  const nextValue = !joinCommunityContribution;
                  setJoinCommunityContribution(nextValue);
                }}
              />
              <span id="join-community-contribution-msg" className="msg">
                {projectName || 'XXX'} community contribution {'>'}
                <input
                  title="task-join-community"
                  min={'1'}
                  type="number"
                  value={
                    joinCommunityContributionNum === 0
                      ? ''
                      : joinCommunityContributionNum.toString()
                  }
                  placeholder="X"
                  onKeyPress={numberInput}
                  onChange={(e) => {
                    if (!joinCommunityContribution) return;
                    const value = Number(e.target.value);
                    setJoinCommunityContributionNum(value);
                  }}
                />
                <span>{` ${joinCommunityContributionNum} `}</span>
              </span>
              <IconWL />
            </div>
          </div>

          {custom.map((item, idx) => {
            return (
              <div className="content-item" key={idx}>
                <div className="desc">
                  <CustomCheckBox
                    checked={item.select}
                    onChange={() => {
                      const curr = { ...item, select: !item.select };
                      setCustom([
                        ...custom.slice(0, idx),
                        curr,
                        ...custom.slice(idx + 1),
                      ]);
                    }}
                  />
                  <span id="follow-twitter-msg" className="msg">
                    Custom action
                  </span>
                </div>
                {item.select && (
                  <>
                    <div className="help">
                      <span className="username custom">Name: </span>
                      <div className="input-box">
                        <input
                          type="text"
                          title="task-like"
                          value={item.name}
                          onChange={(e) => {
                            const curr = { ...item, name: e.target.value };
                            setCustom([
                              ...custom.slice(0, idx),
                              curr,
                              ...custom.slice(idx + 1),
                            ]);
                          }}
                        />
                      </div>
                    </div>
                    <div className="help">
                      <span className="username custom">URL: </span>
                      <div className="input-box">
                        <input
                          type="text"
                          title="task-like"
                          value={item.url}
                          onChange={(e) => {
                            const curr = { ...item, url: e.target.value };
                            setCustom([
                              ...custom.slice(0, idx),
                              curr,
                              ...custom.slice(idx + 1),
                            ]);
                          }}
                        />
                      </div>
                    </div>
                    <div className="help">
                      <span className="username custom">Description: </span>
                      <div className="input-box">
                        <input
                          placeholder="optional"
                          type="text"
                          title="task-like"
                          value={item.description}
                          onChange={(e) => {
                            const curr = {
                              ...item,
                              description: e.target.value,
                            };
                            setCustom([
                              ...custom.slice(0, idx),
                              curr,
                              ...custom.slice(idx + 1),
                            ]);
                          }}
                        />
                      </div>
                    </div>
                    {(idx === custom.length - 1 && (
                      <div
                        className={'help add-btn custom'}
                        onClick={() => {
                          setCustom([
                            ...custom,
                            {
                              name: '',
                              type: ActionType.UNKNOWN,
                              typeMore: ActionTypeMore.CUSTOM,
                              select: false,
                              description: '',
                              url: '',
                              prompt: '',
                              err: false,
                            },
                          ]);
                        }}
                      >
                        <IconPlus size="16px" />
                      </div>
                    )) || (
                      <div
                        className={'help add-btn custom'}
                        onClick={() => {
                          setCustom([
                            ...custom.slice(0, idx),
                            ...custom.slice(idx + 1),
                          ]);
                        }}
                      >
                        <PngIconDelete />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </SelectActionsBox>
  );
}

function TweetIdInput({
  retweetId,
  setRetweetId,
}: {
  retweetId: string;
  setRetweetId: (id: string) => void;
}) {
  const [value, setValue] = useState(retweetId);
  const timerRef = useRef<NodeJS.Timeout>();
  const [checked, setChecked] = useState(false);
  const [dataValid, setDataValid] = useState(true);

  const checkValid = async (data: string) => {
    const checkData = data.trim();
    if (!checkData) return;
    try {
      await checkTweetIdValid(checkData, ''); // TODO
      setRetweetId(data);
    } catch (error) {
      setDataValid(false);
    } finally {
      setChecked(true);
    }
  };

  return (
    <>
      <span className="username tint">
        Tweet Id
        <span className="tint-box">
          {/* <IconTip /> */}
          <span className="tint-msg">
            https://twitter.com/username/status/<b>tweetID</b>
          </span>
        </span>
        :
      </span>
      <div className={!dataValid ? 'input-box invalid' : 'input-box'}>
        <input
          type="number"
          title="retweet"
          min={'1'}
          onKeyPress={numberInput}
          value={value}
          onChange={(e) => {
            const dataValue = e.target.value;
            setDataValid(true);
            setChecked(false);
            setValue(e.target.value);
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
            timerRef.current = setTimeout(() => {
              checkValid(dataValue);
            }, 800);
          }}
        />
      </div>
      {checked && dataValid && (
        <div className="tint-box">{/* <PngIconDone /> */}</div>
      )}
    </>
  );
}

function TwitterFollowed({
  followTwitterLinkResult,
  updateTwitterLinkResult,
}: {
  followTwitterLinkResult: string[];
  updateTwitterLinkResult: (arg0: string[]) => void;
}) {
  return (
    <>
      {followTwitterLinkResult.map((item, index) => {
        return (
          <div className="help" key={item + index}>
            <span className="username">Username: </span>
            <div className="input-box">
              <span>@</span>
              <input
                type="text"
                title="task-like"
                value={item}
                onChange={() => {}}
              />
            </div>

            <div
              className="tint-box"
              onClick={() => {
                const before = followTwitterLinkResult.slice(0, index);
                const after = followTwitterLinkResult.slice(index + 1);
                updateTwitterLinkResult([...before, ...after]);
              }}
            >
              {/* <PngIconDelete /> */}
            </div>
          </div>
        );
      })}
    </>
  );
}

let addTwitterToFollowedAlive = false;
function AddTwitterToFollowed({
  addValid,
  followTwitterLinkResult,
}: {
  addValid: (arg0: string) => void;
  followTwitterLinkResult: string[];
}) {
  const timerRef = useRef<NodeJS.Timeout>();
  const [data, setData] = useState('');
  const [checked, setChecked] = useState(false);
  const [dataValid, setDataValid] = useState(true);
  const [addNew, setAddNew] = useState(false);

  const checkValid = async (data: string) => {
    const checkData = data.trim();
    if (!checkData) return;
    try {
      await checkTwitterNameValid(checkData, ''); // TODO
      if (addTwitterToFollowedAlive) {
        addValid(checkData);
        setAddNew(false);
      }
    } catch (error) {
      if (addTwitterToFollowedAlive) setDataValid(false);
    } finally {
      if (addTwitterToFollowedAlive) setChecked(true);
    }
  };

  const reset = () => {
    setData('');
    setChecked(false);
    setDataValid(true);
  };

  useEffect(() => {
    addTwitterToFollowedAlive = true;
    return () => {
      addTwitterToFollowedAlive = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      {addNew && (
        <div className={'help'}>
          <span className="username">Username: </span>
          <div
            className={
              !dataValid ? 'input-box adding invalid' : 'input-box adding'
            }
          >
            <span>@</span>
            <input
              type="text"
              title="task-like"
              value={data}
              onChange={(e) => {
                const dataValue = e.target.value;
                setDataValid(true);
                setChecked(false);
                setData(dataValue);
                if (timerRef.current) {
                  clearTimeout(timerRef.current);
                }
                timerRef.current = setTimeout(() => {
                  checkValid(dataValue);
                }, 800);
              }}
            />
          </div>

          {checked && dataValid && (
            <div className="tint-box">
              {' '}
              <PngIconDone />
            </div>
          )}
        </div>
      )}
      <div
        className={'help add-btn'}
        onClick={() => {
          // const resultData = data.trim()
          if (!dataValid) return;
          if (followTwitterLinkResult.length >= 5) return;
          reset();
          setAddNew(true);
        }}
      >
        <IconPlus size="16px" />
        <span>Add Account</span>
      </div>
    </>
  );
}

function CustomCheckBox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <span
      onClick={() => {
        onChange();
      }}
    >
      {checked ? <IconCheckboxChecked /> : <IconCheckbox />}
    </span>
  );
}

function ConnectTwitter() {
  return (
    <div
      className="btn twitter"
      onClick={() => connectionSocialMedia('twitter')}
    >
      {/* <TwitterIcon /> */}
      <p>{'Connect Twitter First'}</p>
    </div>
  );
}

function numberInput(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.charCode < 48 || e.charCode > 57) {
    e.preventDefault();
  }
}

const SelectActionsBox = styled.div`
  & .content {
    display: flex;
    justify-content: space-between;
    > div {
      width: 540px;
      & .content-item {
        background: #ebeee4;
        border-radius: 10px;
        margin-bottom: 20px;
        padding: 10px 18px;
        /* display: flex;
        align-items: center; */

        & .desc {
          display: flex;
          align-items: center;

          & span:first-child {
            margin-top: 5px;
            margin-bottom: 5px;
            margin-right: 10px;
            width: 25px;
            height: 25px;
          }
          & .msg {
            flex-grow: 1;
            font-size: 14px;
            line-height: 20px;
            color: #333333;
            > input {
              margin: 0 10px;
              border: none;
              outline: none;
              background-color: #fff;
              height: 40px;
              width: 60px;
              text-align: center;
              font-size: 14px;
              line-height: 20px;
              border-radius: 10px;
            }

            > span {
              display: none;
            }
          }
        }

        & .help {
          margin: 0 0 5px 30px;
          display: flex;
          align-items: center;
          & span.username {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            color: #333333;
            margin-right: 10px;
            &.custom {
              text-align: end;
              width: 85px;
            }
          }
          & span.tint {
            display: flex;
            align-items: center;

            & > .tint-box {
              position: relative;
              > span.tint-msg {
                display: none;
                position: absolute;
                top: -40px;
                left: -60px;
                background: #000;
                color: #fff;
                padding: 8px;
                font-size: smaller;
                border-radius: 10px;
                > b {
                  color: rgb(246, 189, 10);
                }
              }
              &:hover {
                > span.tint-msg {
                  display: initial;
                }
              }
            }
          }
          & div.input-box {
            flex-grow: 1;
            background-color: #fff;
            border: 1px solid #fff;
            border-radius: 10px;
            padding: 10px;
            display: flex;
            font-size: 14px;
            line-height: 20px;
            > input {
              flex-grow: 1;
              border: none;
              outline: none;
            }
            > svg {
              height: 20px;
            }
            &.adding {
              color: rgba(51, 51, 51, 0.3);
            }
          }

          & div.tint-box {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            text-align: center;
            padding: 10px;
            box-sizing: border-box;
            background-color: #fff;
            margin-left: 10px;
            cursor: pointer;
          }
          & div.invalid {
            border: 1px solid red;
          }
          & svg {
            cursor: pointer;
          }

          & .invalid-icon {
            cursor: not-allowed;
          }
        }

        & .help.join-discord {
          display: block;
          > div {
            margin-bottom: 10px;
          }
        }

        & .help.add-btn {
          margin-top: 10px;
          color: #3dd606;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          cursor: pointer;
          padding-left: 90px;
          &.custom {
            justify-content: end;
          }

          & > svg {
            margin-right: 5px;
            & path {
              fill: #3dd606;
            }
          }
        }
      }
    }
  }

  > div:last-child {
    border: none;
  }

  & div.btn {
    position: relative;
    /* border-radius: 10px; */
    cursor: pointer;
    width: 100%;
    height: 40px;
    color: #fff;
    display: flex;
    align-items: center;
    & svg {
      margin-left: 10px;
    }
    & p {
      text-align: center;
      width: 100%;
      position: absolute;
    }
  }

  & div.twitter {
    background-color: #3293f8;
    border-radius: 10px;
  }
  & div.discord {
    background-color: #5165f6;
  }
`;