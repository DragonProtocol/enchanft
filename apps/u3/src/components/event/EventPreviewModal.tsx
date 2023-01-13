/* eslint-disable react/no-unescaped-entities */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-26 16:48:41
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-12 13:23:49
 * @Description: file description
 */
import styled from 'styled-components';
import ModalBase, { ModalBaseBody } from '../common/modal/ModalBase';
import {
  EventExploreListItemData,
  EventExploreListItemHandles,
} from './EventExploreListItem';
import EventLinkPreview from './EventLinkPreview';
import { Close } from '../icons/close';

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
  return (
    <ModalBase isOpen={isOpen}>
      <ModalBody>
        {data && (
          <>
            <Header>
              {displayHandles && (
                <EventExploreListItemHandles {...handlesProps} />
              )}
              <CloseBox onClick={onClose}>
                <Close />
              </CloseBox>
            </Header>
            <EventLinkPreview
              data={data}
              showAdminOps={showAdminOps}
              onAdminDelete={onAdminDelete}
              onAdminThumbUp={onAdminThumbUp}
              onAdminEdit={onAdminEdit}
            />
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
`;
const CloseBox = styled.div`
  margin-left: auto;
  cursor: pointer;
`;
