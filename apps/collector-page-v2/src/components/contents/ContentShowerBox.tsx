import { usePermissions } from '@ecnft/wl-user-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { selectWebsite } from '../../features/website/websiteSlice';
import { contentParse } from '../../services/api/contents';
import { ContentListItem } from '../../services/types/contents';
import { useAppSelector } from '../../store/hooks';
import ExtensionSupport from '../common/ExtensionSupport';
import Loading from '../common/loading/Loading';
import { Edit3 } from '../icons/edit';
import { ThumbUp } from '../icons/thumbUp';
import { Trash } from '../icons/trash';
import ContentShower from './ContentShower';

const urlCache: { [key: string]: string } = {};
export type Tab = 'original' | 'readerView';

export default function ContentShowerBox({
  selectContent,
  thumbUpAction,
  deleteAction,
  editAction,
}: {
  selectContent: ContentListItem | undefined;
  thumbUpAction?: () => void;
  deleteAction?: () => void;
  editAction?: () => void;
}) {
  const { u3ExtensionInstalled } = useAppSelector(selectWebsite);
  const [tab, setTab] = useState<Tab>(
    u3ExtensionInstalled ? 'original' : 'readerView'
  );
  const [daylightContentLoading, setDaylightContentLoading] = useState(false);
  const [daylightContent, setDaylightContent] = useState('');
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const loadDaylightContent = useCallback(async (url: string) => {
    if (urlCache[url]) {
      setDaylightContent(urlCache[url]);
      return;
    }
    setDaylightContent('');
    try {
      setDaylightContentLoading(true);
      const { data } = await contentParse(url);
      urlCache[url] = data.data.content;
      setDaylightContent(data.data.content);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDaylightContentLoading(false);
    }
  }, []);

  useEffect(() => {
    // console.log('selectContent', selectContent);
    setIframeLoaded(false);
    setDaylightContent('');
    if (selectContent?.supportReaderView) {
      if (!selectContent.value) loadDaylightContent(selectContent.link);
      setTab('readerView');
    } else {
      setTab('original');
    }
  }, [selectContent]);

  const contentValue = useMemo(() => {
    if (!selectContent?.value) return '';
    try {
      const content = JSON.parse(selectContent?.value);
      return content.content;
    } catch (error) {
      return selectContent?.value;
    }
  }, [selectContent]);

  return (
    <ContentBox>
      <ContentShowerTab
        tab={tab}
        setTab={(t) => setTab(t)}
        readerViewAction={() => {
          if (selectContent?.supportReaderView && !selectContent.value) {
            loadDaylightContent(selectContent.link);
          }
        }}
        showAdminOps
        thumbUpAction={thumbUpAction}
        deleteAction={deleteAction}
        editAction={editAction}
      />
      {(() => {
        if (tab === 'original') {
          if (u3ExtensionInstalled || selectContent?.supportIframe) {
            return (
              <div className="iframe-container">
                {!iframeLoaded && (
                  <LoadingBox>
                    <Loading />
                  </LoadingBox>
                )}
                <iframe
                  title="daylight"
                  src={selectContent.link}
                  style={{
                    opacity: iframeLoaded ? 1 : 0,
                  }}
                  onLoad={() => {
                    setIframeLoaded(true);
                  }}
                />
              </div>
            );
          }
          if (selectContent) {
            return (
              <ExtensionSupport
                url={selectContent.link}
                title={selectContent.title}
                img={
                  selectContent.imageUrl ||
                  (selectContent.uniProjects &&
                    selectContent.uniProjects[0]?.image)
                }
              />
            );
          }
          return null;
        }
        if (tab === 'readerView') {
          if (daylightContentLoading) {
            return (
              <LoadingBox>
                <Loading />
              </LoadingBox>
            );
          }
          if (contentValue || daylightContent) {
            return (
              <ContentShower
                {...selectContent}
                content={daylightContent || contentValue}
              />
            );
          }
        }
        return (
          <ExtensionSupport
            url={selectContent.link}
            title={selectContent.title}
            msg="Reader view is not supported for this page! Please view it in new tab."
            img={
              selectContent.imageUrl ||
              (selectContent.uniProjects && selectContent.uniProjects[0]?.image)
            }
          />
        );
      })()}
    </ContentBox>
  );
}

export function ContentShowerTab({
  tab,
  setTab,
  readerViewAction,
  showAdminOps,
  thumbUpAction,
  deleteAction,
  editAction,
}: {
  tab: Tab;
  setTab: (tab: Tab) => void;
  readerViewAction?: () => void;
  showAdminOps?: boolean;
  thumbUpAction?: () => void;
  deleteAction?: () => void;
  editAction?: () => void;
}) {
  const { isAdmin } = usePermissions();
  return (
    <div className="tabs">
      <div>
        <button
          type="button"
          className={tab === 'original' ? 'active' : ''}
          onClick={() => {
            setTab('original');
          }}
        >
          Original
        </button>
        <button
          className={tab === 'readerView' ? 'active' : ''}
          type="button"
          onClick={() => {
            setTab('readerView');
            if (readerViewAction) readerViewAction();
          }}
        >
          ReaderView
        </button>
      </div>
      {showAdminOps && isAdmin && (
        <div className="admin-ops">
          <span
            onClick={() => {
              if (thumbUpAction) thumbUpAction();
            }}
          >
            <ThumbUp />
          </span>
          <span
            onClick={() => {
              if (editAction) editAction();
            }}
          >
            <Edit3 />
          </span>
          <span
            onClick={() => {
              if (deleteAction) deleteAction();
            }}
          >
            <Trash />
          </span>
        </div>
      )}
    </div>
  );
}

export const ContentBoxContainer = styled.div`
  height: calc(100%);
  width: calc(100% - 360px);
`;

export const ContentBox = styled.div`
  height: calc(100%);
  width: 100%;

  overflow-x: hidden;
  overflow: hidden;

  & img {
    max-width: 100%;
  }

  & pre {
    overflow: scroll;
  }

  & div.tabs {
    height: 60px;
    background: #1b1e23;
    border-bottom: 1px solid #39424c;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    > div {
      width: 260px;
      height: 40px;
      background: #14171a;
      border-radius: 100px;
      padding: 4px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      > button {
        cursor: pointer;
        width: 122px;
        height: 32px;
        border: none;

        box-shadow: 0px 0px 8px rgba(20, 23, 26, 0.08),
          0px 0px 4px rgba(20, 23, 26, 0.04);
        border-radius: 100px;
        outline: none;
        background: inherit;
        color: #a0aec0;

        &.active {
          color: #ffffff;
          background: #21262c;
        }
      }
    }

    > div.admin-ops {
      position: absolute;
      right: 0;
      background: inherit;
      width: fit-content;
      padding: 0 15px;
      color: #ffffff;
      gap: 10px;

      > span {
        cursor: pointer;
        border: 1px solid #39424c;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        box-sizing: border-box;
      }
    }
  }

  & .iframe-container {
    width: 100%;
    height: calc(100% - 60px);

    & iframe {
      border: 0;
      width: 100%;
      height: 100%;
    }
  }
`;

export const LoadingBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
`;
