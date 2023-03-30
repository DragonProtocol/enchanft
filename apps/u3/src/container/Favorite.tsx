/* eslint-disable react/no-unescaped-entities */
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ScrollBox from '../components/common/box/ScrollBox';
import Tab from '../components/common/tab/Tab';
import ContentList from '../components/contents/ContentList';
import EventExploreList from '../components/event/EventExploreList';
import EventLinkPreview from '../components/event/EventLinkPreview';
import { MainWrapper } from '../components/layout/Index';
import {
  ContentsEntityItem,
  EventsEntityItem,
  selectState,
} from '../features/favorite/userGroupFavorites';
import useUserFavorites from '../hooks/useUserFavorites';
import { useAppSelector } from '../store/hooks';
import { AsyncRequestStatus } from '../services/types';
import Loading from '../components/common/loading/Loading';
import useContentHandles from '../hooks/useContentHandles';
import { ContentListItem } from '../services/types/contents';
import TwoHeartSvg from '../components/imgs/two-heart.svg';
import { ButtonPrimaryLine } from '../components/common/button/ButtonBase';
import ContentPreview from '../components/contents/ContentPreview';

function EmptyFavorites() {
  const navigate = useNavigate();
  return (
    <EmptyFavoritesWrapper>
      <EmptyBox>
        <EmptyImg src={TwoHeartSvg} />
        <EmptyDesc>
          Nothing to see here！ Explore and favorite what you like！
        </EmptyDesc>
        <ButtonPrimaryLine onClick={() => navigate('/events')}>
          Explore
        </ButtonPrimaryLine>
      </EmptyBox>
    </EmptyFavoritesWrapper>
  );
}
function EmptyList() {
  return (
    <EmptyBox>
      <EmptyDesc>
        Nothing to see here！ Explore and favorite what you like！
      </EmptyDesc>
    </EmptyBox>
  );
}
function EmptyContent() {
  return (
    <EmptyBox>
      <EmptyImg src={TwoHeartSvg} />
    </EmptyBox>
  );
}

const EmptyFavoritesWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #1b1e23;
`;
const EmptyBox = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  background-color: #1b1e23;
`;
const EmptyImg = styled.img`
  width: 100px;
  height: 100px;
`;
const EmptyDesc = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #748094;
`;

enum FavoriteSwitchValue {
  event = 'event',
  content = 'content',
}
export const FavoriteSwitchOptions = [
  {
    label: 'Content',
    value: FavoriteSwitchValue.content,
  },
  {
    label: 'Event',
    value: FavoriteSwitchValue.event,
  },
];

function Favorite() {
  const { events, contents, refreshFavorites } = useUserFavorites();

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const [showContentList, setShowContentList] = useState<ContentListItem[]>([]);
  useEffect(() => {
    setShowContentList(contents);
  }, [contents]);
  const {
    onVote: onContentVote,
    onFavor: onContentFavor,
    onShare: onContentShare,
    onHiddenAction: onContentHiddenAction,
    onHiddenUndoAction: onContentHiddenUndoAction,
  } = useContentHandles(showContentList, setShowContentList);
  const { status } = useAppSelector(selectState);
  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  const isEmptyEvents = useMemo(() => !events.length, [events]);
  const isEmptyContents = useMemo(() => !contents.length, [contents]);
  const isEmpty = useMemo(
    () => isEmptyEvents && isEmptyContents,
    [isEmptyEvents, isEmptyContents]
  );
  const [event, setEvent] = useState<EventsEntityItem | null>(null);
  const [content, setContent] = useState<ContentsEntityItem | null>(null);
  const [switchValue, setSwitchValue] = useState<FavoriteSwitchValue>(
    FavoriteSwitchValue.content
  );

  return (
    <FavoritesWrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <FavoritesLayout>
          {isEmpty ? (
            <EmptyFavorites />
          ) : (
            <>
              <FavoritesListBox>
                <FavoritesListHeader>
                  <TabSwitch
                    options={FavoriteSwitchOptions}
                    value={switchValue}
                    onChange={(value) => setSwitchValue(value)}
                  />
                </FavoritesListHeader>
                {switchValue === FavoriteSwitchValue.event &&
                  (isEmptyEvents ? (
                    <EmptyList />
                  ) : (
                    <FavoritesList>
                      <EventExploreList
                        data={events}
                        activeId={event?.id || 0}
                        onItemClick={setEvent}
                      />
                    </FavoritesList>
                  ))}
                {switchValue === FavoriteSwitchValue.content &&
                  (isEmptyContents ? (
                    <EmptyList />
                  ) : (
                    <FavoritesList>
                      <ContentList
                        data={showContentList}
                        activeId={content?.id}
                        onVote={onContentVote}
                        onFavor={onContentFavor}
                        onShare={onContentShare}
                        onHidden={onContentHiddenAction}
                        onHiddenUndo={onContentHiddenUndoAction}
                        onItemClick={(item) =>
                          setContent(item as unknown as ContentListItem)
                        }
                      />
                    </FavoritesList>
                  ))}
              </FavoritesListBox>
              <FavoritesContentBox>
                {FavoriteSwitchValue.event === switchValue &&
                  (event ? (
                    <EventLinkPreview data={event} />
                  ) : (
                    <EmptyContent />
                  ))}

                {switchValue === FavoriteSwitchValue.content &&
                  (content ? (
                    <ContentPreview data={content} showAdminOps={false} />
                  ) : (
                    <EmptyContent />
                  ))}
              </FavoritesContentBox>
            </>
          )}
        </FavoritesLayout>
      )}
    </FavoritesWrapper>
  );
}
export default Favorite;

const FavoritesWrapper = styled(MainWrapper)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FavoritesLayout = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid #39424c;
  box-sizing: border-box;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
`;
const FavoritesListBox = styled.div`
  width: 360px;
  height: 100%;
  background: #1b1e23;
  border-right: 1px solid #39424c;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;
const FavoritesListHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 32px;
  border-bottom: 1px solid #39424c;
  padding: 0 20px;
  box-sizing: border-box;
`;
const TabSwitch = styled(Tab)`
  flex: 1;
  border-bottom: none;
  justify-content: flex-start;
`;
const FavoritesList = styled(ScrollBox)`
  width: 100%;
  height: 0px;
  flex: 1;
`;
const FavoritesContentBox = styled.div`
  width: 0;
  flex: 1;
  height: 100%;
`;
