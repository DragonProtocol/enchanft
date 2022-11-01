import { id } from 'ethers/lib/utils';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppConfig } from '../../AppProvider';
import { ProjectDetail } from '../../redux/projectSlice';
import { connectionSocialMedia } from '../../utils/socialMedia';
import { getTwitterHomeLink } from '../../utils/twitter';
import IconDiscordBlack from '../Icons/IconDiscordBlack';
import IconDiscordWhite from '../Icons/IconDiscordWhite';
import IconTwitterBlack from '../Icons/IconTwitterBlack';
import IconTwitterWhite from '../Icons/IconTwitterWhite';
import IconWebsite from '../Icons/IconWebsite';
import IconWebsiteWhite from '../Icons/IconWebsiteWhite';
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
          <div className="links admin">
            {(() => {
              if (isAdmin) {
                return (
                  <div className="twitter">
                    <span>
                      <IconTwitterWhite />
                    </span>
                    <span>@</span>
                    <input
                      title="admin-twitter"
                      type="text"
                      value={project?.community?.twitterName || ''}
                      onChange={(e) => {
                        setProject({
                          ...project,
                          community: {
                            ...project.community,
                            twitterName: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
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
                  <div className="discord">
                    <span>
                      <IconDiscordWhite />
                    </span>
                    <span>https://</span>
                    <input
                      title="admin-discord"
                      type="text"
                      value={project?.community?.discordInviteUrl || ''}
                      onChange={(e) => {
                        setProject({
                          ...project,
                          community: {
                            ...project.community,
                            discordInviteUrl: e.target.value,
                          },
                        });
                      }}
                    />
                  </div>
                );
              }

              return (
                <div className="discord">
                  <InviteBotBtn hasInviteBot={hasInviteBot} />
                </div>
              );
            })()}

            <div className="website">
              <span>
                <IconWebsiteWhite />
              </span>
              <span>https://</span>
              <input
                title="admin-website"
                type="text"
                value={project?.community?.website || ''}
                onChange={(e) => {
                  setProject({
                    ...project,
                    community: {
                      ...project.community,
                      website: e.target.value,
                    },
                  });
                }}
              />
            </div>
            <div>
              <button className="save" onClick={saveAction}>
                Save
              </button>
            </div>
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

      & .links.admin {
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
          }
          & svg {
            vertical-align: middle;
          }
          & input {
            font-family: inherit;
            font-size: inherit;
            line-height: 30px;
            border: none;
            outline: none;
          }
          &.twitter {
            & span {
              background-color: #4d93f1;
            }
            border: 1px solid #4d93f1;
            & .wl-bot {
              background-color: #4d93f1;
            }
          }
          &.discord {
            & span {
              background-color: #5368ed;
            }
            border: 1px solid #5368ed;
            & .wl-bot {
              background-color: #5368ed;
            }
          }
          &.website {
            & span {
              background-color: rgb(56, 210, 10);
            }
            border: 1px solid rgb(56, 210, 10);
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
