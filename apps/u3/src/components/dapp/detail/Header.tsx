import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { formatFilterShowName } from '../../../utils/filter';
import { ProjectExploreListItemResponse } from '../../../services/types/project';
import { ButtonPrimaryLine } from '../../common/button/ButtonBase';
import Tag from '../../common/tag/Tag';
import EllipsisText from '../../common/text/EllipsisText';
import ProjectImgDefault from '../../project/ProjectImgDefault';
import Card from './Card';
import TwitterSvg from '../../common/icons/svgs/twitter.svg';
import DiscordSvg from '../../common/icons/svgs/discord.svg';
import FacebookSvg from '../../common/icons/svgs/facebook.svg';
import TelegramSvg from '../../common/icons/svgs/telegram.svg';
import useDappWebsite from '../../../hooks/useDappWebsite';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: ProjectExploreListItemResponse;
};
export default function Header({ data, ...otherProps }: Props) {
  const { openDappModal } = useDappWebsite();
  return (
    <HeaderWrapper {...otherProps}>
      <HeaderImg src={data.image} />
      <HeaderCenter>
        <Title>{data.name}</Title>
        {data?.types && (
          <TagsRow>
            {data.types.map((item) => (
              <Tag>{formatFilterShowName(item)}</Tag>
            ))}
          </TagsRow>
        )}

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
          <OpenButton onClick={() => openDappModal(data.id)}>
            Open Dapp
          </OpenButton>
        </RightButtons>
      </HeaderRight>
    </HeaderWrapper>
  );
}

const HeaderWrapper = styled(Card)`
  width: 100%;
  height: 160px;
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
`;
const TagsRow = styled.div`
  display: flex;
  gap: 10px;
`;
const Description = styled(EllipsisText)`
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
  background-color: #14171a;
`;
const LinkIcon = styled.img`
  width: 100%;
  height: 100%;
`;
const OpenButton = styled(ButtonPrimaryLine)``;
