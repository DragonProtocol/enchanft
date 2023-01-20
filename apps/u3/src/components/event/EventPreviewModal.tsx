/* eslint-disable react/no-unescaped-entities */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-26 16:48:41
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-20 14:21:44
 * @Description: file description
 */
import styled from 'styled-components';
import ModalBase, { ModalBaseBody } from '../common/modal/ModalBase';
import {
  EventExploreListItemData,
  EventExploreListItemHandles,
} from './EventExploreListItem';
import EventLinkPreview, { EventPreviewHandles } from './EventLinkPreview';
import { Close } from '../icons/close';
import useFullScreen from '../../hooks/useFullScreen';
import ButtonFullScreen from '../common/button/ButtonFullScreen';

export type EventPreviewModalProps = {
  isOpen: boolean;
  data?: EventExploreListItemData;
  displayHandles?: boolean;
  disabledFavor?: boolean;
  loadingFavor?: boolean;
  isFavored?: boolean;
  disabledComplete?: boolean;
  loadingComplete?: boolean;
  isCompleted?: boolean;
  onComplete?: () => void;
  onShare?: () => void;
  onFavor?: () => void;
  onClose?: () => void;
  showAdminOps?: boolean;
  onAdminThumbUp?: () => void;
  onAdminDelete?: () => void;
  onAdminEdit?: () => void;
};

export default function EventPreviewModal({
  isOpen,
  data,
  onClose,
  displayHandles,
  showAdminOps,
  onAdminDelete,
  onAdminThumbUp,
  onAdminEdit,
  ...handlesProps
}: EventPreviewModalProps) {
  const { ref, isFullscreen, onToggle } = useFullScreen();
  return (
    <ModalBase isOpen={isOpen}>
      <ModalBody>
        {data && (
          <>
            <Header>
              {displayHandles && (
                <ExploreHandlesBox>
                  <EventExploreListItemHandles {...handlesProps} />
                </ExploreHandlesBox>
              )}
              <EventPreviewHandles
                editorScore={data?.editorScore}
                showAdminOps={showAdminOps}
                onAdminThumbUp={onAdminThumbUp}
                onAdminDelete={onAdminDelete}
                onAdminEdit={onAdminEdit}
                isFullscreen={isFullscreen}
                onFullscreenRequest={onToggle}
                onFullscreenExit={onToggle}
              />
              <CloseBox onClick={onClose}>
                <Close />
              </CloseBox>
            </Header>
            <EventLinkPreviewBox ref={ref}>
              <EventLinkPreview data={data} />
              {isFullscreen && (
                <EventLinkPreviewFullscreen
                  isFullscreen={isFullscreen}
                  onClick={onToggle}
                />
              )}
            </EventLinkPreviewBox>
          </>
        )}
      </ModalBody>
    </ModalBase>
  );
}

const ModalBody = styled(ModalBaseBody)`
  width: 976px;
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;
const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;
const ExploreHandlesBox = styled.div`
  height: 100%;
  margin-right: auto;
`;
const CloseBox = styled.div`
  cursor: pointer;
`;
const EventLinkPreviewBox = styled.div`
  width: 100%;
  height: 0;
  flex: 1;
  position: relative;
`;
const EventLinkPreviewFullscreen = styled(ButtonFullScreen)`
  z-index: 1;
  position: absolute;
  top: 10px;
  right: 10px;
`;
