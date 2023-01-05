/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 10:28:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-05 10:42:44
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { selectWebsite } from '../../features/website/websiteSlice';
import { useAppSelector } from '../../store/hooks';
import CannotOpenPlatFormLink from './CannotOpenPlatFormLink';
import { Edit3 } from '../icons/edit';
import { ThumbUp } from '../icons/thumbUp';
import { Trash } from '../icons/trash';

export type CannotOpenPlatFormLinkProps = {
  data: {
    name: string;
    platform?: {
      logo: string;
    };
    link: string;
    supportIframe: boolean;
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
  return (
    <EventPreviewWrapper>
      {displayCannotOpen ? (
        <CannotOpenPlatFormLink
          iconUrl={platform?.logo || ''}
          linkUrl={link}
          title={name}
        />
      ) : (
        <EventIframe src={link} />
      )}
      {showAdminOps && (
        <div className="admin-ops">
          <span
            onClick={() => {
              if (onAdminThumbUp) onAdminThumbUp();
            }}
          >
            <ThumbUp />
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
      width: 32px;
      height: 32px;
      box-sizing: border-box;
    }
  }
`;
const EventIframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;
