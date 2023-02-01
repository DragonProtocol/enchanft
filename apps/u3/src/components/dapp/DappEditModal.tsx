/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-31 14:23:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-01 10:10:19
 * @Description: file description
 */
import styled from 'styled-components';
import ModalBase, { ModalBaseBody } from '../common/modal/ModalBase';
import { UpdateProjectData } from '../../services/types/project';
import DappForm from './DappForm';

export type DappEditModalProps = {
  isOpen: boolean;
  data?: UpdateProjectData;
  disabled?: boolean;
  loading?: boolean;
  onCancel?: () => void;
  onSubmit?: (values: UpdateProjectData) => void;
};

export default function DappEditModal({
  isOpen,
  data,
  disabled,
  loading,
  onCancel,
  onSubmit,
}: DappEditModalProps) {
  return (
    <ModalBase isOpen={isOpen}>
      <ModalBody>
        {data && (
          <DappForm
            initialValues={data}
            disabled={disabled}
            loading={loading}
            onCancel={onCancel}
            onSubmit={onSubmit}
          />
        )}
      </ModalBody>
    </ModalBase>
  );
}

const ModalBody = styled(ModalBaseBody)`
  width: 976px;
`;
