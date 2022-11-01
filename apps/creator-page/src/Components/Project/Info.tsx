import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ProjectDetail } from '../../redux/projectSlice';
import { getTwitterHomeLink } from '../../utils/twitter';
import IconDiscordBlack from '../Icons/IconDiscordBlack';
import IconTwitterBlack from '../Icons/IconTwitterBlack';
import IconWebsite from '../Icons/IconWebsite';

export default function ProjectInfo({ project }: { project: ProjectDetail }) {
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
            {project.community.website && (
              <button
                title="website"
                onClick={() => {
                  window.open(project.community.website, '_blank');
                }}
              >
                <IconWebsite />
              </button>
            )}
            {project.community.twitterId && (
              <button
                title="twitter"
                onClick={() => {
                  window.open(
                    getTwitterHomeLink(project.community.twitterName),
                    '_blank'
                  );
                }}
              >
                <IconTwitterBlack />
              </button>
            )}
            {project.community.discordInviteUrl && (
              <button
                title="discord"
                onClick={() => {
                  window.open(project.community.discordInviteUrl, '_blank');
                }}
              >
                <IconDiscordBlack />
              </button>
            )}
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
