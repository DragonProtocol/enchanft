/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 10:28:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-29 14:36:56
 * @Description: file description
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import useFullScreen from '../../hooks/useFullScreen';
import { ContentListItem } from '../../services/types/contents';
import ButtonFullScreen from '../common/button/ButtonFullScreen';
import ContentShowerBox, {
  ContentShowerHandles,
  ContentShowerTabs,
  Tab,
} from './ContentShowerBox';

export type ContentPreviewProps = StyledComponentPropsWithRef<'div'> & {
  data?: ContentListItem;
  showAdminOps?: boolean;
  onAdminScore?: () => void;
  onAdminDelete?: () => void;
};
export default function ContentPreview({
  data,
  showAdminOps = true,
  onAdminScore,
  onAdminDelete,
  ...otherProps
}: ContentPreviewProps) {
  const navigate = useNavigate();
  const { ref, isFullscreen, onToggle } = useFullScreen();
  const [tab, setTab] = useState<Tab>('readerView');
  useEffect(() => {
    if (data?.supportReaderView) {
      setTab('readerView');
    } else {
      setTab('original');
    }
  }, [data]);

  return (
    <ContentPreviewWrapper {...otherProps}>
      {data && (
        <>
          <Header>
            <ContentShowerTabs tab={tab} setTab={(t) => setTab(t)} />
            <ContentShowerHandles
              showAdminOps={showAdminOps}
              isForU={!!data?.isForU}
              editorScore={data?.editorScore || 0}
              deleteAction={onAdminDelete}
              thumbUpAction={onAdminScore}
              editAction={() => {
                navigate(`/contents/create?id=${data.id}`);
              }}
              onFullscreenRequest={onToggle}
              onFullscreenExit={onToggle}
            />
          </Header>
          <ContentPreviewBox ref={ref}>
            <ContentShowerBox selectContent={data} tab={tab} />
            {isFullscreen && (
              <ContentPreviewFullscreen
                isFullscreen={isFullscreen}
                onClick={onToggle}
              />
            )}
          </ContentPreviewBox>
        </>
      )}
    </ContentPreviewWrapper>
  );
}
const ContentPreviewWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  width: 100%;
  height: 60px;
  padding: 14px;
  box-sizing: border-box;
  background: #1b1e23;
  border-bottom: 1px solid #39424c;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  .content-shower-tabs {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
const ContentPreviewBox = styled.div`
  width: 100%;
  height: 0;
  flex: 1;
  position: relative;
`;
const ContentPreviewFullscreen = styled(ButtonFullScreen)`
  z-index: 1;
  position: absolute;
  top: 10px;
  right: 10px;
`;
