import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { formatFilterShowName } from '../../../utils/filter';
import {
  ProjectExploreListItemResponse,
  UniprojectStatus,
} from '../../../services/types/project';
import {
  ButtonPrimary,
  ButtonPrimaryLine,
} from '../../common/button/ButtonBase';
import Tag from '../../common/tag/Tag';
import ProjectImgDefault from '../../project/ProjectImgDefault';
import Card from './Card';
import TwitterSvg from '../../common/icons/svgs/twitter.svg';
import DiscordSvg from '../../common/icons/svgs/discord.svg';
import FacebookSvg from '../../common/icons/svgs/facebook.svg';
import TelegramSvg from '../../common/icons/svgs/telegram.svg';
import useConfigsTopics from '../../../hooks/useConfigsTopics';
import { ReactComponent as CheckVerifiedSvg } from '../../common/icons/svgs/check-verified.svg';
import EllipsisTextExpandMore from '../../common/text/EllipsisTextExpandMore';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: ProjectExploreListItemResponse;
  disabledInstall?: boolean;
  loadingInstall?: boolean;
  isInstalled?: boolean;
  onInstall?: () => void;
  onOpen?: () => void;
};
export default function Header({
  data,
  disabledInstall,
  loadingInstall,
  isInstalled,
  onInstall,
  onOpen,
  ...otherProps
}: Props) {
  const { topics } = useConfigsTopics();
  const { chains } = topics;
  const showChains = chains.filter((item) =>
    data?.chains.includes(item.chainEnum)
  );

  return (
    <HeaderWrapper {...otherProps}>
      <HeaderImg src={data.image} />
      <HeaderCenter>
        <Title>
          {data.name}{' '}
          {data.status === UniprojectStatus.VERIFIED && <CheckVerifiedSvg />}
        </Title>
        <TagsRow>
          {data?.types.map((item) => (
            <Tag>{formatFilterShowName(item)}</Tag>
          ))}
          {showChains.map((item) => (
            <ChainIcon src={item.image} alt={item.name} title={item.name} />
          ))}
        </TagsRow>

        <Description row={2}>{data.description}</Description>
      </HeaderCenter>
      <HeaderRight>
        <RightButtons>
          {data?.mediaLinks?.twitter && (
            <LinkButton
              onClick={() => window.open(data?.mediaLinks?.twitter, '__blank')}
            >
              <LinkIcon src={TwitterSvg} />
            </LinkButton>
          )}
          {data?.mediaLinks?.discord && (
            <LinkButton
              onClick={() => window.open(data?.mediaLinks?.discord, '__blank')}
            >
              <LinkIcon src={DiscordSvg} />
            </LinkButton>
          )}
          {data?.mediaLinks?.facebook && (
            <LinkButton
              onClick={() => window.open(data?.mediaLinks?.facebook, '__blank')}
            >
              <LinkIcon src={FacebookSvg} />
            </LinkButton>
          )}
          {data?.mediaLinks?.telegram && (
            <LinkButton
              onClick={() => window.open(data?.mediaLinks?.telegram, '__blank')}
            >
              <LinkIcon src={TelegramSvg} />
            </LinkButton>
          )}
          {data?.dappUrl &&
            (isInstalled ? (
              <OpenButton
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpen) onOpen();
                }}
              >
                Open Dapp
              </OpenButton>
            ) : (
              <InstallButton
                disabled={disabledInstall}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onInstall) onInstall();
                }}
              >
                {loadingInstall ? 'Installing' : 'Install'}
              </InstallButton>
            ))}
        </RightButtons>
      </HeaderRight>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled(Card)`
  width: 100%;
  min-height: 160px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const HeaderImg = styled(ProjectImgDefault)`
  width: 120px;
  height: 120px;
  border-radius: 10px;
  flex-shrink: 0;
  margin-right: 20px;
`;
const HeaderCenter = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-evenly;
`;
const Title = styled.span`
  font-style: italic;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
`;
const TagsRow = styled.div`
  display: flex;
  gap: 10px;
`;
const Description = styled(EllipsisTextExpandMore)`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #718096;
  opacity: 0.8;
`;
const HeaderRight = styled.div`
  margin-left: 80px;
  margin-top: auto;
  flex-shrink: 0;
`;
const RightButtons = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const LinkButton = styled(ButtonPrimaryLine)`
  width: 40px;
  height: 40px;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 50%;
  background-color: #14171a;
  border: none;
`;
const LinkIcon = styled.img`
  width: 100%;
  height: 100%;
`;
const OpenButton = styled(ButtonPrimaryLine)``;
const InstallButton = styled(ButtonPrimary)``;
const ChainIcon = styled.img`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #14171a;
`;
