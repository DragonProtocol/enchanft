/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 10:28:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-12 16:54:56
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
import { ButtonPrimaryLine } from '../common/button/ButtonBase';

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
          <EventHandleButton
            onClick={() => {
              if (onAdminThumbUp) onAdminThumbUp();
            }}
          >
            <ThumbUp />
            &nbsp; {data?.editorScore || 0}
          </EventHandleButton>
          <EventHandleButton
            onClick={() => {
              if (onAdminEdit) onAdminEdit();
            }}
          >
            <Edit3 />
          </EventHandleButton>
          <EventHandleButton
            onClick={() => {
              if (onAdminDelete) onAdminDelete();
            }}
          >
            <Trash />
          </EventHandleButton>
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
const EventHandleButton = styled(ButtonPrimaryLine)`
  padding: 6px;
  height: 32px;
  background-color: #1b1e23;
`;
