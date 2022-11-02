import { id } from 'ethers/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppConfig } from '../../AppProvider';
import { ProjectDetail } from '../../redux/projectSlice';
import { connectionSocialMedia } from '../../utils/socialMedia';
import { getTwitterHomeLink } from '../../utils/twitter';
import IconClose from '../Icons/IconClose';
import IconCloseRed from '../Icons/IconCloseRed';
import IconDiscordBlack from '../Icons/IconDiscordBlack';
import IconDiscordWhite from '../Icons/IconDiscordWhite';
import IconEdit from '../Icons/IconEdit';
import IconEditGray from '../Icons/IconEditGray';
import IconRight from '../Icons/IconRight';
import IconRightTwitter from '../Icons/IconRightTwitter';
import IconRightWebsite from '../Icons/IconRightWebsite';
import IconTwitterBlack from '../Icons/IconTwitterBlack';
import IconTwitterWhite from '../Icons/IconTwitterWhite';
import IconWebsite from '../Icons/IconWebsite';
import IconWebsiteWhite from '../Icons/IconWebsiteWhite';
import PngIconDone from '../Icons/PngIconDone';
import { InviteBotBtn } from './InviteBot';
import { TwitterLinkBtn } from './TwitterLink';

export default function ProjectInfo({
  isAdmin,
  isVIP,
  hasInviteBot,
  hasTwitter,
  linkAction,
  project,
  setProject,
  saveAction,
}: {
  isAdmin: boolean;
  isVIP: boolean;
  hasTwitter: boolean;
  hasInviteBot: boolean;
  project: ProjectDetail;
  setProject: (arg0: any) => void;
  saveAction: () => void;
  linkAction: () => void;
}) {
  const navigate = useNavigate();

  return (
    <InfoBox>
      <div className="title">
        <h3>Project Information</h3>
        <button
          onClick={() => {
            navigate(`/project/${project.slug}/info/edit`);
          }}
        >
          Edit
        </button>
      </div>
      <div className="basic">
        <img src={project.image} alt="" />
        <div className="info">
          <h3>{project.name}</h3>
          <div className="links">
            {(() => {
              if (isAdmin) {
                return (
                  <TwitterEdit
                    twitterName={project?.community?.twitterName || ''}
                    updateTwitterName={(v) => {
                      setProject({
                        ...project,
                        community: {
                          ...project.community,
                          twitterName: v,
                        },
                      });
                    }}
                    saveAction={saveAction}
                  />
                );
              }
              if (isVIP) {
                return (
                  <div className="twitter">
                    <TwitterLinkBtn
                      msg="Authorize Twitter"
                      hasTwitter={
                        !!(
                          project?.community?.twitterId &&
                          project?.community?.twitterName
                        )
                      }
                      twitterName={project?.community?.twitterName || ''}
                      linkAction={linkAction}
                    />
                  </div>
                );
              }
              return (
                <div className="twitter">
                  <TwitterLinkBtn
                    hasTwitter={
                      hasTwitter ||
                      !!(
                        project?.community?.twitterId &&
                        project?.community?.twitterName
                      )
                    }
                    twitterName={project?.community?.twitterName || ''}
                    linkAction={async () => {
                      connectionSocialMedia('twitter');
                    }}
                  />
                </div>
              );
            })()}

            {(() => {
              if (isAdmin) {
                return (
                  <DiscordEdit
                    discordInviteUrl={
                      project?.community?.discordInviteUrl || ''
                    }
                    updateDiscordInviteUrl={(v) => {
                      setProject({
                        ...project,
                        community: {
                          ...project.community,
                          discordInviteUrl: v,
                        },
                      });
                    }}
                    saveAction={saveAction}
                  />
                );
              }

              return (
                <div className="discord">
                  <InviteBotBtn hasInviteBot={hasInviteBot} />
                </div>
              );
            })()}

            <WebsiteEdit
              website={project?.community?.website || ''}
              updateWebsite={(v) => {
                setProject({
                  ...project,
                  community: {
                    ...project.community,
                    website: v,
                  },
                });
              }}
              saveAction={saveAction}
            />
          </div>

          <div className="effect">
            <span>
              Items <span>{project.itemTotalNum}</span>
            </span>
            <span>
              EnchanNFT <span>{project.injectedCoins}</span>
            </span>
          </div>
        </div>
      </div>
      <div className="desc">{project.description}</div>
    </InfoBox>
  );
}

function TwitterEdit({
  twitterName,
  updateTwitterName,
  saveAction,
}: {
  twitterName: string;
  updateTwitterName: (arg0: string) => void;
  saveAction: () => void;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="twitter">
      <span>
        <IconTwitterWhite />
      </span>
      {(editing && (
        <>
          <span>@</span>
          <div className="edit-box">
            <input
              title="admin-twitter"
              type="text"
              value={twitterName}
              onChange={(e) => {
                updateTwitterName(e.target.value);
              }}
            />
            <span
              onClick={() => {
                saveAction();
                setEditing(false);
              }}
            >
              <IconRightTwitter size="20px" />
            </span>
            <span
              onClick={() => {
                setEditing(false);
              }}
            >
              <IconCloseRed size="16px" />
            </span>
          </div>
        </>
      )) || (
        <>
          <span>@{twitterName}</span>
          <span
            onClick={() => {
              setEditing(true);
            }}
          >
            <IconEditGray size="18px" />
          </span>
        </>
      )}
    </div>
  );
}

function DiscordEdit({
  discordInviteUrl,
  updateDiscordInviteUrl,
  saveAction,
}: {
  discordInviteUrl: string;
  updateDiscordInviteUrl: (arg0: string) => void;
  saveAction: () => void;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="discord">
      <span>
        <IconDiscordWhite />
      </span>
      {(editing && (
        <>
          <span>https://</span>
          <div className="edit-box">
            <input
              title="admin-discord"
              type="text"
              value={discordInviteUrl}
              onChange={(e) => {
                updateDiscordInviteUrl(e.target.value);
              }}
            />
            <span
              onClick={() => {
                saveAction();
                setEditing(false);
              }}
            >
              <IconRight size="20px" />
            </span>
            <span
              onClick={() => {
                setEditing(false);
              }}
            >
              <IconCloseRed size="16px" />
            </span>
          </div>
        </>
      )) || (
        <>
          <span>https://{discordInviteUrl}</span>
          <span
            onClick={() => {
              setEditing(true);
            }}
          >
            <IconEditGray size="18px" />
          </span>
        </>
      )}
    </div>
  );
}

function WebsiteEdit({
  website,
  updateWebsite,
  saveAction,
}: {
  website: string;
  updateWebsite: (arg0: string) => void;
  saveAction: () => void;
}) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="website">
      <span>
        <IconWebsiteWhite />
      </span>

      {(editing && (
        <>
          <span>https://</span>
          <div className="edit-box">
            <input
              title="admin-website"
              type="text"
              value={website}
              onChange={(e) => {
                updateWebsite(e.target.value);
              }}
            />
            <span
              onClick={() => {
                saveAction();
                setEditing(false);
              }}
            >
              <IconRightWebsite size="20px" />
            </span>
            <span
              onClick={() => {
                setEditing(false);
              }}
            >
              <IconCloseRed size="16px" />
            </span>
          </div>
        </>
      )) || (
        <>
          <span>https://{website}</span>
          <span
            onClick={() => {
              setEditing(true);
            }}
          >
            <IconEditGray size="18px" />
          </span>
        </>
      )}
    </div>
  );
}

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  & .basic {
    display: flex;
    gap: 20px;

    & img {
      width: 140px;
      height: 140px;
      border-radius: 10px;
    }

    & .info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      & h3 {
        margin: 0;
        font-weight: 700;
        font-size: 24px;
        line-height: 36px;
        color: #333333;
      }

      & .links {
        display: flex;
        gap: 20px;
      }

      & .links {
        > div {
          display: inline-flex;
          align-items: center;
          border-radius: 10px;
          overflow: hidden;
          font-size: 16px;
          & span {
            height: 100%;
            line-height: 30px;
            color: #fff;
            padding-left: 5px;
            &:nth-child(2) {
              padding-right: 3px;
            }
            &:last-child {
              padding-right: 5px;
              cursor: pointer;
            }
          }
          & svg {
            vertical-align: middle;
          }
          & .edit-box {
            background: #fff;
            height: 32px;
            border-radius: 5px;
            padding-right: 5px;
            & input {
              font-family: inherit;
              font-size: inherit;
              line-height: 30px;
              border-radius: 5px;
              font-weight: 700;
              font-size: 14px;
              border: none;
              outline: none;
              padding-left: 5px;
            }
            & span {
              cursor: pointer;
              margin: 0 5px;
            }
          }

          padding: 4px;
          box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
          &.twitter {
            background-color: #4d93f1;
            & span {
            }
            border-color: #4d93f1;
            & .wl-bot {
              background-color: #4d93f1;
            }
          }
          &.discord {
            background-color: #5368ed;
            & span {
            }
            border-color: #5368ed;
            & .wl-bot {
              background-color: #5368ed;
            }
          }
          &.website {
            background-color: #3dd606;
            & span {
            }
            border-color: #3dd606;
          }
        }

        & button {
          padding-left: 10px;
          padding-right: 10px;
          height: 32px;

          border-radius: 10px;
          font-weight: 700;
          /* font-size: 18px; */
          line-height: 30px;
          color: #ffffff;
          &.save {
            background: #3dd606;
          }
        }
      }

      & .effect {
        display: flex;
        gap: 20px;
        > span {
          display: inline-flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
          width: 185px;
          height: 40px;
          background: #ebeee4;
          border-radius: 10px;
          font-weight: 400;
          font-size: 16px;
          line-height: 24px;
          color: rgba(51, 51, 51, 0.6);
          > span {
            font-weight: 700;
            font-size: 16px;
            line-height: 24px;
            color: #333333;
          }
        }
      }
    }
  }
  & .desc {
    height: auto;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;

    color: rgba(51, 51, 51, 0.6);

    white-space: pre-wrap;
  }
`;
