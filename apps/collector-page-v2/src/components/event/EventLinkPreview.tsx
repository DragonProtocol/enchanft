/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 10:28:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-11 18:28:15
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useEffect, useState } from 'react';
import { selectWebsite } from '../../features/website/websiteSlice';
import { useAppSelector } from '../../store/hooks';
import CannotOpenPlatFormLink from './CannotOpenPlatFormLink';
import { Edit3 } from '../icons/edit';
import { ThumbUp } from '../icons/thumbUp';
import { Trash } from '../icons/trash';
import Loading from '../common/loading/Loading';
import isUrl from '../../utils/isUrl';

export type CannotOpenPlatFormLinkProps = {
  data: {
    name: string;
    platform?: {
      logo: string;
    };
    link: string;
    supportIframe: boolean;
    editorScore?: number;
  };
  showAdminOps?: boolean;
  onAdminThumbUp?: () => void;
  onAdminDelete?: () => void;
  onAdminEdit?: () => void;
};
export default function EventLinkPreview({
  data,
  showAdminOps,
  onAdminThumbUp,
  onAdminDelete,
  onAdminEdit,
}: CannotOpenPlatFormLinkProps) {
  const { u3ExtensionInstalled } = useAppSelector(selectWebsite);
  const { platform, link, supportIframe, name } = data;
  const displayCannotOpen = !supportIframe && !u3ExtensionInstalled;
  const [iframeLoading, setIframeLoading] = useState(false);
  useEffect(() => {
    setIframeLoading(true);
  }, [data.link]);
  return (
    <EventPreviewWrapper>
      {displayCannotOpen ? (
        <CannotOpenPlatFormLink
          iconUrl={platform?.logo || ''}
          linkUrl={link}
          title={name}
        />
      ) : (
        isUrl(link) && (
          <EventIframeBox>
            <EventIframe
              src={link}
              onLoad={() => {
                setIframeLoading(false);
              }}
            />
            {iframeLoading && (
              <EventIframeLoadingBox>
                <Loading />
              </EventIframeLoadingBox>
            )}
          </EventIframeBox>
        )
      )}
      {showAdminOps && (
        <div className="admin-ops">
          <span
            onClick={() => {
              if (onAdminThumbUp) onAdminThumbUp();
            }}
          >
            <ThumbUp />
            &nbsp; {data?.editorScore || 0}
          </span>
          <span
            onClick={() => {
              if (onAdminEdit) onAdminEdit();
            }}
          >
            <Edit3 />
          </span>
          <span
            onClick={() => {
              if (onAdminDelete) onAdminDelete();
            }}
          >
            <Trash />
          </span>
        </div>
      )}
    </EventPreviewWrapper>
  );
}
const EventPreviewWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  .admin-ops {
    position: absolute;
    top: 0;
    right: 0;
    padding: 15px;
    display: flex;
    gap: 10px;

    > span {
      cursor: pointer;
      border: 1px solid #39424c;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      background-color: #1b1e23;
      padding: 5px;
      color: #fff;
    }
  }
`;
const EventIframeBox = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;
const EventIframeLoadingBox = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #1b1e23;
`;
const EventIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;
