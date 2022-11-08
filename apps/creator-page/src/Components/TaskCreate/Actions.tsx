import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ChainType, checkTweetIdValid, checkTwitterNameValid } from '../../api';
import { CREATE_TASK_DEFAULT_INVITE_NUM } from '../../utils/constants';
import {
  connectionSocialMedia,
  DiscordBotCallback,
} from '../../utils/socialMedia';
import IconCheckbox from '../Icons/IconCheckbox';
import IconCheckboxChecked from '../Icons/IconCheckboxChecked';
import IconDiscord from '../Icons/IconDiscord';
import IconPlus from '../Icons/IconPlus';
import IconWL from '../Icons/IconWL';
import IconTwitter from '../Icons/IconTwitter';
import PngIconDelete from '../Icons/PngIconDelete';
import PngIconDone from '../Icons/PngIconDone';
import { Action, ActionType, ActionTypeMore } from './type';
import { useAppConfig } from '../../AppProvider';
import { numberInput } from '../../utils';
import IconTwitterWhite from '../Icons/IconTwitterWhite';
import IconTip from '../Icons/IconTip';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { CoinType, TokenType } from '../../utils/token';
import IconNFT from '../Icons/IconNft';
import IconWallet from '../Icons/IconWallet';
import IconCustom from '../Icons/IconCustom';
import IconDiscordWhite from '../Icons/IconDiscordWhite';
import RightIcon from '../Icons/IconRight';
import IconQuestion from '../Icons/IconQuestion';
import IconImage from '../Icons/IconImage';

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
  // const { account } = useAppConfig();
  const twitter = true;
  // 'account.info?.accounts.find((item) => item.accountType === ChainType.TWITTER)';
  const [followTwitter, setFollowTwitter] = useState({
    valid: false,
    luckyDrawWeight: '1',
  });
  const [followTwitterLinkResult, setFollowTwitterLinkResult] = useState<
    Array<string>
  >(
    followTwitters.length > 0
      ? [...followTwitters]
      : projectTwitter
      ? [projectTwitter]
      : []
  );

  const [discordRole, setDiscordRole] = useState({
    valid: false,
    role: '',
    desc: '',
    luckyDrawWeight: '1',
  });

  const [joinDiscord, setJoinDiscord] = useState({
    valid: false,
    luckyDrawWeight: '1',
  });
  const [inviteDiscord, setInviteDiscord] = useState({
    valid: false,
    num: CREATE_TASK_DEFAULT_INVITE_NUM,
    luckyDrawWeight: '1',
  });

  const [inviteFriends, setInvalidFriends] = useState({
    valid: false,
    num: CREATE_TASK_DEFAULT_INVITE_NUM,
    luckyDrawWeight: '1',
  });

  const [likeTwitter, setLikeTwitter] = useState({
    valid: false,
    link: '',
    luckyDrawWeight: '1',
  });
  const [retweetTwitter, setRetweetTwitter] = useState({
    valid: false,
    id: '',
    luckyDrawWeight: '1',
  });
  const [quoteTwitter, setQuoteTwitter] = useState({
    valid: false,
    id: '',
    tag_friends_num: 3,
    luckyDrawWeight: '1',
  });
  const [joinCommunityContribution, setJoinCommunityContribution] = useState({
    valid: false,
    num: 20,
    luckyDrawWeight: '1',
  });

  const [custom, setCustom] = useState([
    {
      type: ActionType.CUSTOM,
      name: '',
      typeMore: ActionTypeMore.CUSTOM,
      select: false,
      description: '',
      url: '',
      prompt: '',
      err: false,
      luckyDrawWeight: '1',
    },
  ]);
  const [walletBalance, setWalletBalance] = useState({
    type: ActionType.COIN,
    valid: false,
    num: '',
    coinType: CoinType.ETH,
    luckyDrawWeight: '1',
  });

  const [nftHolder, setNftHolder] = useState({
    type: ActionType.COIN,
    valid: false,
    items: [
      {
        nftCollectionName: '',
        nftContractAddr: '',
        url: '',
      },
    ],
    luckyDrawWeight: '1',
  });
  const [questionnaire, setQuestionnaire] = useState({
    type: ActionType.QUESTIONNAIRE,
    valid: false,
    manualCheck: false,
    data: [
      {
        question: '',
        answer: '',
        luckyDrawWeight: '1',
      },
    ],
  });
  const [question, setQuestion] = useState({
    type: ActionType.QUESTION,
    valid: false,
    data: [
      {
        question: '',
        luckyDrawWeight: '1',
      },
    ],
  });
  const [uploadImage, setUploadImage] = useState({
    type: ActionType.UPLOADIMAGE,
    valid: false,
    desc: '',
    luckyDrawWeight: '1',
  });

  useEffect(() => {
    const actions: Action[] = [];
    if (followTwitter.valid && followTwitterLinkResult.length > 0) {
      actions.push({
        name: `Follow @${followTwitterLinkResult.join('@')} on Twitter`,
        type: ActionType.TWITTER,
        typeMore: ActionTypeMore.FOLLOW_TWITTER,
        description: '',
        accounts: followTwitterLinkResult,
        lucky_draw_weight: Number(followTwitter.luckyDrawWeight) || 1,
      });
      updateStateFollowTwitters(followTwitterLinkResult);
    }
    if (joinDiscord.valid) {
      const msg = document.getElementById('join-discord-msg')?.textContent;
      msg &&
        actions.push({
          name: msg,
          type: ActionType.DISCORD,
          typeMore: ActionTypeMore.JOIN_DISCORD,
          description: '',
          lucky_draw_weight: Number(joinDiscord.luckyDrawWeight) || 1,
        });
    }
    if (inviteFriends.valid && inviteFriends.num) {
      const msg = document.getElementById('invite-friends-msg')?.textContent;
      msg &&
        actions.push({
          name: msg,
          type: ActionType.WL,
          typeMore: ActionTypeMore.INVITE_PEOPLE,
          description: '',
          num: inviteFriends.num,
          lucky_draw_weight: Number(inviteFriends.luckyDrawWeight) || 1,
        });
    }

    if (inviteDiscord.valid && inviteDiscord.num) {
      const msg = document.getElementById('invite-discord-msg')?.textContent;
      msg &&
        actions.push({
          name: msg,
          type: ActionType.DISCORD,
          typeMore: ActionTypeMore.DISCORD_INVITES_PEOPLE,
          description: '',
          num: inviteDiscord.num,
          lucky_draw_weight: Number(inviteDiscord.luckyDrawWeight) || 1,
        });
    }

    if (likeTwitter.valid && likeTwitter.link) {
      const msg = document.getElementById('like-twitter-msg')?.textContent;
      msg &&
        actions.push({
          name: msg,
          type: ActionType.TWITTER,
          typeMore: ActionTypeMore.LIKE_TWEET,
          description: '',
          url: `https://twitter.com/intent/like?tweet_id=${likeTwitter.link}`,
          tweet_id: likeTwitter.link,
          lucky_draw_weight: Number(likeTwitter.luckyDrawWeight) || 1,
        });
    }
    if (retweetTwitter.valid && retweetTwitter.id) {
      const msg = document.getElementById('retweet-twitter-msg')?.textContent;
      msg &&
        actions.push({
          name: msg,
          type: ActionType.TWITTER,
          typeMore: ActionTypeMore.RETWEET,
          description: '',
          url: `https://twitter.com/intent/retweet?tweet_id=${retweetTwitter.id}`,
          tweet_id: retweetTwitter.id,
          lucky_draw_weight: Number(retweetTwitter.luckyDrawWeight) || 1,
        });
    }
    if (quoteTwitter.valid && quoteTwitter.id) {
      const msg = document.getElementById('quote-twitter-msg')?.textContent;
      msg &&
        actions.push({
          name: msg,
          type: ActionType.TWITTER,
          typeMore: ActionTypeMore.QUOTE_TWEET,
          description: '',
          url: `https://twitter.com/intent/retweet?tweet_id=${quoteTwitter.id}`,
          tweet_id: quoteTwitter.id,
          tag_friends_num: Number(quoteTwitter.tag_friends_num) || 0,
          lucky_draw_weight: Number(quoteTwitter.luckyDrawWeight) || 1,
        });
    }
    if (joinCommunityContribution.valid && joinCommunityContribution.num) {
      const msg = document.getElementById(
        'join-community-contribution-msg'
      )?.textContent;
      msg &&
        actions.push({
          name: msg,
          type: ActionType.WL,
          typeMore: ActionTypeMore.MEET_CONTRIBUTION_SCORE,
          description: '',
          require_score: joinCommunityContribution.num,
          lucky_draw_weight:
            Number(joinCommunityContribution.luckyDrawWeight) || 1,
        });
    }

    if (discordRole.valid && discordRole.role.trim()) {
      actions.push({
        name: `Get【${discordRole.role.trim()}】Role on Discord`,
        type: ActionType.DISCORD,
        typeMore: ActionTypeMore.DISCORD_OBTAIN_ROLE,
        description: discordRole.desc.trim(),
        role: discordRole.role.trim(),
        lucky_draw_weight: Number(discordRole.luckyDrawWeight) || 1,
      });
    }

    const resultCustom = custom.filter(
      (item) => item.select && item.name && item.url
    );
    actions.push(
      ...resultCustom.map((item) => {
        return {
          ...item,
          lucky_draw_weight: Number(item.luckyDrawWeight) || 1,
        };
      })
    );

    if (walletBalance.valid) {
      actions.push({
        name: `Minimum balance ${walletBalance.num} ${walletBalance.coinType}`,
        type: ActionType.COIN,
        typeMore: ActionTypeMore.NATIVE_BALANCE,
        description: ``,
        min_native_balance: Number(walletBalance.num) || 0,
        lucky_draw_weight: Number(walletBalance.luckyDrawWeight) || 1,
        coin_type: walletBalance.coinType,
      });
    }

    if (nftHolder.valid) {
      const data = [...nftHolder.items];
      let word = data.pop()?.nftCollectionName || '';
      if (data.length > 0) {
        word = 'and ' + word;
      }
      const words = data.map((item) => item.nftCollectionName).join('、');
      const validItems = nftHolder.items.filter(
        (item) => item.nftContractAddr.trim() !== ''
      );
      if (validItems.length > 0) {
        actions.push({
          name: `Holding ${words} ${word} NFT`,
          type: ActionType.NFT,
          typeMore: ActionTypeMore.NFT_BALANCE,
          description: ``,
          nft_accounts: nftHolder.items
            .map((item) => {
              return {
                name: item.nftCollectionName.trim(),
                address: item.nftContractAddr.trim(),
                url: item.url.trim(),
              };
            })
            .filter((item) => item.name && item.address),
          nft_accounts_or_add: false,
          lucky_draw_weight: Number(nftHolder.luckyDrawWeight) || 1,
        });
      }
    }

    if (questionnaire.valid) {
      questionnaire.data.forEach((item) => {
        const { question, answer, luckyDrawWeight } = item;
        if (question.trim() && answer.trim()) {
          actions.push({
            name: question,
            type: ActionType.QUESTIONNAIRE,
            typeMore: ActionTypeMore.QUESTIONNAIRE,
            description: ``,
            question,
            answer,
            lucky_draw_weight: Number(luckyDrawWeight) || 1,
          });
        }
      });
    }

    if (question.valid) {
      question.data.forEach((item) => {
        const { question, luckyDrawWeight } = item;
        if (question.trim()) {
          // TODO
          // actions.push({
          //   name: question,
          //   type: ActionType.QUESTION,
          //   typeMore: ActionTypeMore.QUESTIONNAIRE,
          //   description: ``,
          //   question,
          //   lucky_draw_weight: Number(luckyDrawWeight) || 1,
          // });
        }
      });
    }

    if (uploadImage.valid && uploadImage.desc.trim()) {
      // TODO
      // actions.push({
      //   name: uploadImage.desc,
      //   type: ActionType.UPLOADIMAGE,
      //   typeMore: ActionTypeMore.QUESTIONNAIRE,
      //   description: uploadImage.desc,
      //   lucky_draw_weight: Number(uploadImage.luckyDrawWeight) || 1,
      // });
    }

    updateStateActions(actions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    followTwitterLinkResult,
    followTwitter,
    joinDiscord,
    inviteDiscord,
    inviteFriends,
    likeTwitter,
    retweetTwitter,
    quoteTwitter,
    joinCommunityContribution,
    discordRole,
    custom,
    walletBalance,
    nftHolder,
    questionnaire,
    question,
    uploadImage,
  ]);

  return (
    <SelectActionsBox>
      {/* <div className="subtitle">
        <span>Select actions</span>
      </div> */}
      <div className="invite">
        <div className="content-item">
          <h4>Invite WL Bot</h4>
          <div className="invite-bot-container">
            <button
              className="invite-bot"
              onClick={() => {
                window.open(
                  DiscordBotCallback,
                  '__blank',
                  `width=480,
                        height=800,
                        top=0,
                        menubar=no,
                        toolbar=no,
                        status=no,
                        scrollbars=no,
                        resizable=yes,
                        directories=no,
                        status=no,
                        location=no`
                );
              }}
            >
              <IconDiscordWhite size="28px" /> Invite WL Bot
            </button>
            {hasInviteBot && <RightIcon />}
          </div>
        </div>
      </div>
      <div className="content">
        <div>
          {/** Follow twitter */}
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={followTwitter.valid}
                onChange={() => {
                  setFollowTwitter({
                    ...followTwitter,
                    valid: !followTwitter.valid,
                  });
                }}
              />
              <span id="follow-twitter-msg" className="msg">
                Follow this account on Twitter
              </span>
              <IconTwitter />
            </div>
            {twitter ? (
              <>
                {followTwitter.valid && (
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
            {twitter && followTwitter.valid && (
              <LuckyDraw
                weight={followTwitter.luckyDrawWeight}
                setWeight={(w) => {
                  setFollowTwitter({
                    ...followTwitter,
                    luckyDrawWeight: w,
                  });
                }}
              />
            )}
          </div>
          {/** Like twitter */}
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={likeTwitter.valid}
                onChange={() => {
                  if (!twitter) return;
                  setLikeTwitter({
                    ...likeTwitter,
                    valid: !likeTwitter.valid,
                  });
                }}
              />
              <span id="like-twitter-msg" className="msg">
                Like the Tweet on Twitter
              </span>
              <IconTwitter />
            </div>

            {twitter ? (
              likeTwitter.valid && (
                <div className="help">
                  <TweetIdInput
                    tweetId={likeTwitter.link}
                    setTweetId={(id) => {
                      setLikeTwitter({
                        ...likeTwitter,
                        link: id,
                      });
                    }}
                  />
                </div>
              )
            ) : (
              <div className="help">
                <ConnectTwitter />
              </div>
            )}

            {twitter && likeTwitter.valid && (
              <LuckyDraw
                weight={likeTwitter.luckyDrawWeight}
                setWeight={(w) => {
                  setLikeTwitter({
                    ...likeTwitter,
                    luckyDrawWeight: w,
                  });
                }}
              />
            )}
          </div>
          {/** Retweet twitter */}
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={retweetTwitter.valid}
                onChange={() => {
                  if (!twitter) return;
                  setRetweetTwitter({
                    ...retweetTwitter,
                    valid: !retweetTwitter.valid,
                  });
                }}
              />
              <span id="retweet-twitter-msg" className="msg">
                Retweet the Tweet
              </span>
              <IconTwitter />
            </div>

            {twitter ? (
              retweetTwitter.valid && (
                <>
                  <div className="help">
                    <TweetIdInput
                      tweetId={retweetTwitter.id}
                      setTweetId={(id) => {
                        setRetweetTwitter({
                          ...retweetTwitter,
                          id,
                        });
                      }}
                    />
                  </div>
                </>
              )
            ) : (
              <div className="help">
                <ConnectTwitter />
              </div>
            )}
            {twitter && retweetTwitter.valid && (
              <LuckyDraw
                weight={retweetTwitter.luckyDrawWeight}
                setWeight={(w) => {
                  setRetweetTwitter({
                    ...retweetTwitter,
                    luckyDrawWeight: w,
                  });
                }}
              />
            )}
          </div>
          
          {/** quote twitter */}
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={quoteTwitter.valid}
                onChange={() => {
                  if (!twitter) return;
                  setQuoteTwitter({
                    ...quoteTwitter,
                    valid: !quoteTwitter.valid,
                  });
                }}
              />
              <span id="quote-twitter-msg" className="msg">
                Quote the Tweet {quoteTwitter.tag_friends_num>0 && <b>& @ {quoteTwitter.tag_friends_num} friends</b>}
              </span>
              <IconTwitter />
            </div>

            {twitter ? (
              quoteTwitter.valid && (
                <>
                  <div className="help">
                    <TweetIdInput
                      tweetId={quoteTwitter.id}
                      setTweetId={(id) => {
                        setQuoteTwitter({
                          ...quoteTwitter,
                          id,
                        });
                      }}
                    />
                  </div>
                  <div className="help">
                    <span>@</span>
                    <div className="input-box retweet">
                      <input
                        title="quote-num"
                        type="number"
                        min={0}
                        step={1}
                        value={quoteTwitter.tag_friends_num}
                        onChange={(e) => {
                          setQuoteTwitter({
                            ...quoteTwitter,
                            tag_friends_num: Number(e.target.value),
                          });
                        }}
                      />
                    </div>
                    <span className="username">
                      friends (Please fill in 0 if don't need tag)
                    </span>
                  </div>
                </>
              )
            ) : (
              <div className="help">
                <ConnectTwitter />
              </div>
            )}
            {twitter && quoteTwitter.valid && (
              <LuckyDraw
                weight={quoteTwitter.luckyDrawWeight}
                setWeight={(w) => {
                  setQuoteTwitter({
                    ...quoteTwitter,
                    luckyDrawWeight: w,
                  });
                }}
              />
            )}
          </div>
          {/** Invite friends */}
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={inviteFriends.valid}
                onChange={() => {
                  const nextValue = !inviteFriends.valid;
                  setInvalidFriends({
                    ...inviteFriends,
                    valid: nextValue,
                  });
                }}
              />
              <span id="invite-friends-msg" className="msg">
                Invite
                <input
                  title="task-invite"
                  min={'1'}
                  type="number"
                  value={
                    inviteFriends.num === 0 ? '' : inviteFriends.num.toString()
                  }
                  placeholder="X"
                  onKeyPress={numberInput}
                  onChange={(e) => {
                    if (inviteFriends.valid) {
                      setInvalidFriends({
                        ...inviteFriends,
                        num: Number(e.target.value),
                      });
                    }
                  }}
                />
                <span>{` ${inviteFriends.num} `}</span>
                friends to take the Task
              </span>
              <IconWL />
            </div>
            {inviteFriends.valid && (
              <LuckyDraw
                weight={inviteFriends.luckyDrawWeight}
                setWeight={(w) => {
                  setInvalidFriends({
                    ...inviteFriends,
                    luckyDrawWeight: w,
                  });
                }}
              />
            )}
          </div>
          {/** Community contribution */}
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={joinCommunityContribution.valid}
                onChange={() => {
                  const nextValue = !joinCommunityContribution.valid;
                  setJoinCommunityContribution({
                    ...joinCommunityContribution,
                    valid: nextValue,
                  });
                }}
              />
              <span id="join-community-contribution-msg" className="msg">
                {projectName || 'XXX'} community contribution token {'>'}
                <input
                  title="task-join-community"
                  min={'1'}
                  type="number"
                  value={
                    joinCommunityContribution.num === 0
                      ? ''
                      : joinCommunityContribution.num.toString()
                  }
                  placeholder="X"
                  onKeyPress={numberInput}
                  onChange={(e) => {
                    if (!joinCommunityContribution) return;
                    const value = Number(e.target.value);
                    setJoinCommunityContribution({
                      ...joinCommunityContribution,
                      num: value,
                    });
                  }}
                />
                <span>{` ${joinCommunityContribution.num} `}</span>
              </span>
              <IconWL />
            </div>
            {joinCommunityContribution.valid && (
              <LuckyDraw
                weight={joinCommunityContribution.luckyDrawWeight}
                setWeight={(w) => {
                  setJoinCommunityContribution({
                    ...joinCommunityContribution,
                    luckyDrawWeight: w,
                  });
                }}
              />
            )}
          </div>

          {/** Question */}
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={questionnaire.valid}
                onChange={() => {
                  setQuestionnaire({
                    ...questionnaire,
                    valid: !questionnaire.valid,
                  });
                }}
              />
              <span id="questionnaire" className="msg">
                Verify the answer
              </span>
              <IconQuestion />
            </div>
            {questionnaire.valid && (
              <>
                {questionnaire.data.map((item, idx) => {
                  return (
                    <Fragment key={idx}>
                      {idx > 0 && <div className="and"></div>}
                      <div className="help">
                        <span className="username question">Question:</span>
                        <div className={'input-box'}>
                          <input
                            title="question"
                            type="text"
                            value={item.question}
                            onChange={(e) => {
                              setQuestionnaire({
                                ...questionnaire,
                                data: [
                                  ...questionnaire.data.slice(0, idx),
                                  {
                                    ...item,
                                    question: e.target.value,
                                  },
                                  ...questionnaire.data.slice(idx + 1),
                                ],
                              });
                            }}
                          />
                        </div>
                      </div>
                      <div className="help">
                        <span className="username question">Answer:</span>
                        <div className={'input-box'}>
                          <input
                            title="answer"
                            type="text"
                            placeholder="Case insensitive"
                            value={item.answer}
                            onChange={(e) => {
                              setQuestionnaire({
                                ...questionnaire,
                                data: [
                                  ...questionnaire.data.slice(0, idx),
                                  {
                                    ...item,
                                    answer: e.target.value,
                                  },
                                  ...questionnaire.data.slice(idx + 1),
                                ],
                              });
                            }}
                          />
                        </div>
                      </div>

                      {questionnaire.valid && (
                        <LuckyDraw
                          borderNoTop
                          weight={item.luckyDrawWeight}
                          setWeight={(w) => {
                            setQuestionnaire({
                              ...questionnaire,
                              data: [
                                ...questionnaire.data.slice(0, idx),
                                {
                                  ...item,
                                  luckyDrawWeight: w,
                                },
                                ...questionnaire.data.slice(idx + 1),
                              ],
                            });
                          }}
                        />
                      )}

                      {idx !== questionnaire.data.length - 1 && (
                        <div
                          className={'help add-btn custom'}
                          onClick={() => {
                            setQuestionnaire({
                              ...questionnaire,
                              data: [
                                ...questionnaire.data.slice(0, idx),
                                ...questionnaire.data.slice(idx + 1),
                              ],
                            });
                          }}
                        >
                          <PngIconDelete />
                        </div>
                      )}
                    </Fragment>
                  );
                })}
                <div className="and"></div>
                <div
                  className={'help add-btn custom question-add'}
                  onClick={() =>
                    setQuestionnaire({
                      ...questionnaire,
                      data: [
                        ...questionnaire.data,
                        {
                          question: '',
                          answer: '',
                          luckyDrawWeight: '1',
                        },
                      ],
                    })
                  }
                >
                  <IconPlus size="16px" /> Add
                </div>
              </>
            )}
          </div>

          {/** Question2 
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={question.valid}
                onChange={() => {
                  setQuestion({
                    ...question,
                    valid: !question.valid,
                  });
                }}
              />
              <span id="questionnaire" className="msg">
                Questionnaire
              </span>
              <IconQuestion />
            </div>
            {question.valid && (
              <>
                {question.data.map((item, idx) => {
                  return (
                    <Fragment key={idx}>
                      {idx > 0 && <div className="and"></div>}
                      <div className="help">
                        <span className="username question">Question:</span>
                        <div className={'input-box'}>
                          <input
                            title="question"
                            type="text"
                            value={item.question}
                            onChange={(e) => {
                              setQuestion({
                                ...question,
                                data: [
                                  ...question.data.slice(0, idx),
                                  {
                                    ...item,
                                    question: e.target.value,
                                  },
                                  ...question.data.slice(idx + 1),
                                ],
                              });
                            }}
                          />
                        </div>
                      </div>

                      {question.valid && (
                        <LuckyDraw
                          borderNoTop
                          weight={item.luckyDrawWeight}
                          setWeight={(w) => {
                            setQuestion({
                              ...question,
                              data: [
                                ...question.data.slice(0, idx),
                                {
                                  ...item,
                                  luckyDrawWeight: w,
                                },
                                ...question.data.slice(idx + 1),
                              ],
                            });
                          }}
                        />
                      )}

                      {idx !== question.data.length - 1 && (
                        <div
                          className={'help add-btn custom'}
                          onClick={() => {
                            setQuestion({
                              ...question,
                              data: [
                                ...question.data.slice(0, idx),
                                ...question.data.slice(idx + 1),
                              ],
                            });
                          }}
                        >
                          <PngIconDelete />
                        </div>
                      )}
                    </Fragment>
                  );
                })}
                <div className="and"></div>
                <div
                  className={'help add-btn custom question-add'}
                  onClick={() =>
                    setQuestion({
                      ...question,
                      data: [
                        ...question.data,
                        {
                          question: '',
                          luckyDrawWeight: '1',
                        },
                      ],
                    })
                  }
                >
                  <IconPlus size="16px" /> Add
                </div>
              </>
            )}
          </div>
          */}
        </div>
        <div>
          {/** Join Discord */}
          {hasInviteBot && (
            <div className="content-item">
              <div className="desc">
                <CustomCheckBox
                  checked={joinDiscord.valid}
                  onChange={() => {
                    setJoinDiscord({
                      ...joinDiscord,
                      valid: !joinDiscord.valid,
                    });
                  }}
                />{' '}
                <span id="join-discord-msg" className="msg">
                  Join Discord Server
                </span>
                <IconDiscord />
              </div>
              {joinDiscord.valid && (
                <LuckyDraw
                  weight={joinDiscord.luckyDrawWeight}
                  setWeight={(w) => {
                    setJoinDiscord({
                      ...joinDiscord,
                      luckyDrawWeight: w,
                    });
                  }}
                />
              )}
            </div>
          )}
          {/** Invite Discord */}
          {hasInviteBot && (
            <div className="content-item">
              <div className="desc">
                <CustomCheckBox
                  checked={inviteDiscord.valid}
                  onChange={() => {
                    setInviteDiscord({
                      ...inviteDiscord,
                      valid: !inviteDiscord.valid,
                    });
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
                      inviteDiscord.num === 0
                        ? ''
                        : inviteDiscord.num.toString()
                    }
                    onKeyPress={numberInput}
                    onChange={(e) => {
                      if (inviteDiscord) {
                        setInviteDiscord({
                          ...inviteDiscord,
                          num: Number(e.target.value),
                        });
                      }
                    }}
                  />
                  <span>{` ${inviteDiscord.num} `}</span>
                  Friends to Discord Server
                </span>
                <IconDiscord />
              </div>
              {inviteDiscord.valid && (
                <LuckyDraw
                  weight={inviteDiscord.luckyDrawWeight}
                  setWeight={(w) => {
                    setInviteDiscord({
                      ...inviteDiscord,
                      luckyDrawWeight: w,
                    });
                  }}
                />
              )}
              {/* <div className="help">{discord ? null : <ConnectDiscord />}</div> */}
            </div>
          )}
          {/** Discord bot */}
          {hasInviteBot && (
            <div className="content-item">
              <div className="desc">
                <CustomCheckBox
                  checked={discordRole.valid}
                  onChange={() => {
                    setDiscordRole({
                      ...discordRole,
                      valid: !discordRole.valid,
                    });
                  }}
                />
                <span id="discord-role-msg" className="msg">
                  Get the role on Discord
                </span>
                <IconDiscord />
              </div>
              {discordRole.valid && (
                <>
                  <div className="help">
                    <span className="username tint">Role name:</span>
                    &nbsp;
                    <div className={'input-box'}>
                      <input
                        type="text"
                        title="discord-role"
                        value={discordRole.role}
                        onChange={(e) => {
                          setDiscordRole({
                            ...discordRole,
                            role: e.target.value,
                          });
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
                        value={discordRole.desc}
                        onChange={(e) => {
                          setDiscordRole({
                            ...discordRole,
                            desc: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <LuckyDraw
                    borderNoTop
                    weight={discordRole.luckyDrawWeight}
                    setWeight={(w) => {
                      setDiscordRole({
                        ...discordRole,
                        luckyDrawWeight: w,
                      });
                    }}
                  />
                </>
              )}
            </div>
          )}

          {/** Custom action */}
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
                  <IconCustom />
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
                          placeholder="Optional"
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
                    <LuckyDraw
                      borderNoTop
                      weight={item.luckyDrawWeight}
                      setWeight={(w) => {
                        const curr = {
                          ...item,
                          luckyDrawWeight: w,
                        };
                        setCustom([
                          ...custom.slice(0, idx),
                          curr,
                          ...custom.slice(idx + 1),
                        ]);
                      }}
                    />
                    {(idx === custom.length - 1 && (
                      <div
                        className={'help add-btn custom custom-add'}
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
                              luckyDrawWeight: '1',
                            },
                          ]);
                        }}
                      >
                        <IconPlus size="16px" /> Add
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

          {/** wallet balance */}
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={walletBalance.valid}
                onChange={() => {
                  setWalletBalance({
                    ...walletBalance,
                    valid: !walletBalance.valid,
                  });
                }}
              />
              <span id="wallet-balance" className="msg">
                Wallet balance
              </span>
              <IconWallet />
            </div>
            {walletBalance.valid && (
              <WalletBalanceInput
                num={walletBalance.num}
                type={walletBalance.coinType}
                setNum={(v) => {
                  setWalletBalance({
                    ...walletBalance,
                    num: v,
                  });
                }}
                setType={(t) => {
                  setWalletBalance({
                    ...walletBalance,
                    coinType: t,
                  });
                }}
              />
            )}
            {walletBalance.valid && (
              <LuckyDraw
                weight={walletBalance.luckyDrawWeight}
                setWeight={(w) => {
                  setWalletBalance({
                    ...walletBalance,
                    luckyDrawWeight: w,
                  });
                }}
              />
            )}
          </div>
          {/** NFT Holder */}
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={nftHolder.valid}
                onChange={() => {
                  setNftHolder({
                    ...nftHolder,
                    valid: !nftHolder.valid,
                  });
                }}
              />
              <span id="nft-holder" className="msg">
                NFT Holder
              </span>
              <IconNFT />
            </div>
            <div>
              {nftHolder.valid &&
                nftHolder.items.map((item, idx) => {
                  return (
                    <Fragment key={idx}>
                      {idx > 0 && <div className="and"></div>}
                      <NftHolderInput
                        name={item.nftCollectionName}
                        addr={item.nftContractAddr}
                        url={item.url}
                        updateItem={(v) => {
                          setNftHolder({
                            ...nftHolder,
                            items: [
                              ...nftHolder.items.slice(0, idx),
                              {
                                nftCollectionName: v.name,
                                nftContractAddr: v.addr,
                                url: v.url,
                              },
                              ...nftHolder.items.slice(idx + 1),
                            ],
                          });
                        }}
                      />
                      {idx !== nftHolder.items.length - 1 && (
                        <div
                          className={'help add-btn custom nft-add'}
                          onClick={() => {
                            console.log({ nftHolder, idx });
                            setNftHolder({
                              ...nftHolder,
                              items: [
                                ...nftHolder.items.slice(0, idx),
                                ...nftHolder.items.slice(idx + 1),
                              ],
                            });
                          }}
                        >
                          <PngIconDelete />
                        </div>
                      )}
                    </Fragment>
                  );
                })}
              {nftHolder.valid && (
                <div
                  className={'help add-btn custom nft-add'}
                  onClick={() => {
                    setNftHolder({
                      ...nftHolder,
                      items: [
                        ...nftHolder.items,
                        {
                          nftCollectionName: '',
                          nftContractAddr: '',
                          url: '',
                        },
                      ],
                    });
                  }}
                >
                  <IconPlus size="16px" /> Add
                </div>
              )}
              {nftHolder.valid && (
                <LuckyDraw
                  weight={nftHolder.luckyDrawWeight}
                  setWeight={(w) => {
                    setNftHolder({
                      ...nftHolder,
                      luckyDrawWeight: w,
                    });
                  }}
                />
              )}
            </div>
          </div>
          {/** upload Image 
          <div className="content-item">
            <div className="desc">
              <CustomCheckBox
                checked={uploadImage.valid}
                onChange={() => {
                  setUploadImage({
                    ...uploadImage,
                    valid: !uploadImage.valid,
                  });
                }}
              />
              <span className="msg">Upload Image</span>
              <IconImage />
            </div>
            {uploadImage.valid && (
              <div className="help">
                <span className="username custom">Description: </span>
                <div className="input-box">
                  <input
                    type="text"
                    title="task-like"
                    value={uploadImage.desc}
                    onChange={(e) => {
                      setUploadImage({ ...uploadImage, desc: e.target.value });
                    }}
                  />
                </div>
              </div>
            )}
            {uploadImage.valid && (
              <LuckyDraw
                weight={uploadImage.luckyDrawWeight}
                setWeight={(w) => {
                  setUploadImage({
                    ...uploadImage,
                    luckyDrawWeight: w,
                  });
                }}
              />
            )}
          </div>
          */}
        </div>
      </div>
    </SelectActionsBox>
  );
}

function LuckyDraw({
  weight,
  setWeight,
  borderNoTop,
}: {
  weight: string;
  setWeight: (arg0: string) => void;
  borderNoTop?: boolean;
}) {
  return (
    <div className={borderNoTop ? 'lucky-draw-no-top' : 'lucky-draw'}>
      <span>LuckyDraw:</span>{' '}
      <input
        title="lucky-draw"
        type="number"
        min={'1'}
        max={'99'}
        step={'1'}
        value={weight}
        onChange={(e) => {
          setWeight(e.target.value);
        }}
      />
    </div>
  );
}

function TweetIdInput({
  tweetId,
  setTweetId,
}: {
  tweetId: string;
  setTweetId: (id: string) => void;
}) {
  const [value, setValue] = useState(tweetId);
  const timerRef = useRef<NodeJS.Timeout>();
  const [checked, setChecked] = useState(false);
  const [dataValid, setDataValid] = useState(true);
  const { account, updateAccount } = useAppConfig();

  const checkValid = useCallback(
    async (data: string) => {
      const checkData = data.trim();
      if (!checkData || !account.info) return;
      try {
        await checkTweetIdValid(checkData, account.info.token);
        setTweetId(data);
      } catch (error) {
        const err: AxiosError = error as any;
        if (err.response?.status === 401) {
          toast.error('Login has expired,please log in again!');
          updateAccount({ ...account, info: null });
        }
        setDataValid(false);
      } finally {
        setChecked(true);
      }
    },
    [account, setTweetId, updateAccount]
  );

  return (
    <>
      <span className="username tint">
        Tweet Id
        <span className="tint-box">
          <IconTip />
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
        <div className="tint-box">{<PngIconDone />}</div>
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
              <PngIconDelete />
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
  const { account, updateAccount } = useAppConfig();

  const checkValid = useCallback(
    async (data: string) => {
      const checkData = data.trim();
      if (!checkData || !account.info) return;
      try {
        await checkTwitterNameValid(checkData, account.info.token);
        if (addTwitterToFollowedAlive) {
          addValid(checkData);
          setAddNew(false);
        }
      } catch (error) {
        if (addTwitterToFollowedAlive) setDataValid(false);
        const err: AxiosError = error as any;
        if (err.response?.status === 401) {
          toast.error('Login has expired,please log in again!');
          updateAccount({ ...account, info: null });
        }
      } finally {
        if (addTwitterToFollowedAlive) setChecked(true);
      }
    },
    [account, addValid, updateAccount]
  );

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
        Add Account
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
      <IconTwitterWhite />
      <p>{'Connect Twitter First'}</p>
    </div>
  );
}

function WalletBalanceInput({
  num,
  type,
  setNum,
  setType,
}: {
  num: string;
  type: CoinType;
  setType: (arg0: CoinType) => void;
  setNum: (arg0: string) => void;
}) {
  return (
    <div className="help">
      <span className="username tint">Minimum balance:</span>
      <div className={'input-box'}>
        <input
          type="number"
          title="wallet-balance"
          min={'0.001'}
          value={num}
          onChange={(e) => {
            const dataValue = e.target.value;
            setNum(dataValue);
          }}
        />
        <select
          title="coins"
          name=""
          id=""
          value={type}
          onChange={(e) => {
            const value = e.target.value as CoinType;
            setType(value);
          }}
        >
          <option value={CoinType.ETH}>ETH</option>
          <option value={CoinType.SOL}>SOL</option>
          <option value={CoinType.APT}>APT</option>
        </select>
      </div>
    </div>
  );
}

function NftHolderInput({
  name,
  addr,
  url,
  updateItem,
}: {
  name: string;
  addr: string;
  url: string;
  updateItem: (arg0: { name: string; addr: string; url: string }) => void;
}) {
  return (
    <>
      <div className="help">
        <span className="username nft">NFT Collection name:</span>
        <div className={'input-box'}>
          <input
            title="nft-collection-name"
            type="text"
            value={name}
            onChange={(e) => {
              updateItem({
                name: e.target.value,
                addr,
                url,
              });
            }}
          />
        </div>
      </div>
      <div className="help">
        <span className="username nft">NFT Contract address:</span>
        <div className={'input-box'}>
          <input
            title="nft-contract-name"
            type="text"
            value={addr}
            onChange={(e) => {
              updateItem({
                name,
                url,
                addr: e.target.value,
              });
            }}
          />
        </div>
      </div>
      <div className="help">
        <span className="username nft">URL:</span>
        <div className={'input-box'}>
          <input
            title="nft-contract-name"
            type="text"
            placeholder="Optional"
            value={url}
            onChange={(e) => {
              updateItem({
                name,
                addr,
                url: e.target.value,
              });
            }}
          />
        </div>
      </div>
      {/* <LuckyDraw borderNoTop weight="1" setWeight={() => {}} /> */}
    </>
  );
}

const SelectActionsBox = styled.div`
  & .content {
    display: flex;
    justify-content: space-between;
    & input {
      font-family: inherit;
      border: none;
      outline: none;
      border-radius: 10px;
    }
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
              background-color: #fff;
              height: 40px;
              width: 60px;
              text-align: center;
              font-size: 14px;
              line-height: 20px;
              box-sizing: border-box;
            }

            > span {
              display: none;
            }
          }
        }

        & .switch-btn-box {
          display: flex;
          justify-content: end;
          align-items: center;
          gap: 10px;
          margin-top: 10px;
          & span {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;
            color: #333333;
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

            &.nft {
              text-align: end;
              width: 165px;
            }

            &.question {
              text-align: end;
              width: 80px;
              margin-right: 10px;
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

            &.retweet {
              margin: 0 10px;
              font-weight: 400;
              font-size: 14px;
              line-height: 20px;
              color: #333333;
              flex-grow: initial;
              & input {
                width: 102px;
              }
            }

            & select {
              border: none;
              outline: none;
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
            /* justify-content: end; */
          }

          &.custom-add {
            margin-left: 40px;
          }
          &.nft-add {
            margin-left: 120px;
          }

          &.question-add {
            margin-left: 30px;
          }

          & > svg {
            margin-right: 5px;
            & path {
              fill: #3dd606;
            }
          }
        }

        & .lucky-draw,
        & .lucky-draw-no-top {
          display: flex;
          gap: 10px;
          justify-content: end;
          align-items: center;
          border-top: 1px solid #d9d9d9;
          margin: 20px 0 10px 0;
          padding-top: 20px;
          > span {
            font-weight: 400;
            font-size: 14px;
            line-height: 20px;

            color: #333333;
          }
          > input {
            width: 200px;
            height: 40px;
            padding: 10px;
            box-sizing: border-box;
          }
        }
        & .lucky-draw-no-top {
          border-top: none;
          padding-top: 0px;
          margin: 0px 0 10px 0;
        }
      }
    }
  }

  & .invite {
    width: 540px;
    margin-bottom: 20px;
    & h4 {
      margin: 20px 0 10px 0;
    }
    & .invite-bot-container {
      display: flex;
      gap: 10px;
      align-items: center;
      & button {
        flex-grow: 1;
      }
    }

    & button.invite-bot {
      height: 50px;
      background: #5368ed;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: #ffffff;
      & svg {
        vertical-align: bottom;
        margin-right: 10px;
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

  & .and {
    text-align: center;
    margin: 15px 0;
    border-top: 1px solid #d9d9d9;
  }
`;
