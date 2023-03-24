import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { formatFilterShowName } from '../../../utils/filter';
import {
  DappExploreListItemResponse,
  DappStatus,
} from '../../../services/types/dapp';
import { ButtonPrimaryLine } from '../../common/button/ButtonBase';
import Tag from '../../common/tag/Tag';
import ImgDefault from '../../common/ImgDefault';
import Card from './Card';
import TwitterSvg from '../../common/icons/svgs/twitter.svg';
import DiscordSvg from '../../common/icons/svgs/discord.svg';
import FacebookSvg from '../../common/icons/svgs/facebook.svg';
import TelegramSvg from '../../common/icons/svgs/telegram.svg';
import useConfigsTopics from '../../../hooks/useConfigsTopics';
import { ReactComponent as CheckVerifiedSvg } from '../../common/icons/svgs/check-verified.svg';
import EllipsisTextExpandMore from '../../common/text/EllipsisTextExpandMore';
import { Edit } from '../../icons/edit';
import DappFavorButton from '../DappFavorButton';
import useUserFavorites from '../../../hooks/useUserFavorites';
import useLogin from '../../../hooks/useLogin';

type Props = StyledComponentPropsWithRef<'div'> & {
  data: DappExploreListItemResponse;
  onFavorSuccess?: () => void;
  onOpen?: () => void;
  onEdit?: () => void;
};
export default function Header({
  data,
  onFavorSuccess,
  onOpen,
  onEdit,
  ...otherProps
}: Props) {
  const { isFavoredDapp, userFavoritesLoaded } = useUserFavorites();
  const { isAdmin } = useLogin();
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
          {data.status === DappStatus.VERIFIED && <CheckVerifiedSvg />}
          {isAdmin && (
            <EditBtn onClick={onEdit}>
              <Edit />
            </EditBtn>
          )}
        </Title>
        <TagsRow>
          {data?.types.map((item) => (
            <Tag key={item}>{formatFilterShowName(item)}</Tag>
          ))}
          {showChains.map((item) => (
            <ChainIcon
              key={item.chainEnum}
              src={item.image}
              alt={item.name}
              title={item.name}
            />
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
          {data?.url &&
            data?.threadStreamId &&
            userFavoritesLoaded &&
            (isFavoredDapp(data.threadStreamId) ? (
              <OpenButton
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpen) onOpen();
                }}
              >
                Open Dapp
              </OpenButton>
            ) : (
              <DappFavorButton
                threadId={data.threadStreamId}
                onFavorSuccess={onFavorSuccess}
              />
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

const HeaderImg = styled(ImgDefault)`
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
const ChainIcon = styled.img`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #14171a;
`;
const EditBtn = styled.div`
  cursor: pointer;
`;

export function HeaderMobile({ data, ...otherProps }: Props) {
  const { topics } = useConfigsTopics();
  const { chains } = topics;
  const showChains = chains.filter((item) =>
    data?.chains.includes(item.chainEnum)
  );

  return (
    <HeaderWrapperMobile {...otherProps}>
      <HeaderImgMobile src={data.image} />
      <HeaderRightMobile>
        <TitleMobile>
          {data.name}{' '}
          {data.status === DappStatus.VERIFIED && <CheckVerifiedSvg />}
        </TitleMobile>
        <TagsRowMobile>
          {data?.types.map((item) => (
            <Tag key={item}>{formatFilterShowName(item)}</Tag>
          ))}
          {showChains.map((item) => (
            <ChainIcon
              key={item.chainEnum}
              src={item.image}
              alt={item.name}
              title={item.name}
            />
          ))}
        </TagsRowMobile>
      </HeaderRightMobile>
    </HeaderWrapperMobile>
  );
}

const HeaderWrapperMobile = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
`;
const HeaderImgMobile = styled(ImgDefault)`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  flex-shrink: 0;
`;
const HeaderRightMobile = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: space-evenly;
`;
const TitleMobile = styled.span`
  font-style: italic;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 10px;
`;
const TagsRowMobile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
