/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-27 18:36:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-11 14:18:23
 * @Description: file description
 */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ModalBase, { ModalBaseTitle } from './common/modal/ModalBase';
import { isMobile } from 'react-device-detect';
import { ButtonInfo, ButtonPrimary } from './common/button/ButtonBase';
import { useWlUserReact } from '../provider';
import UserAvatar from './UserAvatar';
import UploadImgMaskImg from './imgs/upload_img_mask.svg';
import LoadingSvg from './imgs/loading.svg';
import { AVATAR_SIZE_LIMIT } from '../constants';
import { toast } from 'react-toastify';
import { uploadUserAvatar, User } from '../api';
type EditUserForm = Pick<User, 'name' | 'avatar'>;
export type EditProfileModalProps = {
  isOpen: boolean;
  isLoading?: boolean;
  onClose?: () => void;
  onSave?: (form: EditUserForm) => void;
};
const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  isLoading,
  onClose,
  onSave,
}: EditProfileModalProps) => {
  const { user } = useWlUserReact();
  const [userForm, setUserForm] = useState<EditUserForm>({
    name: '',
    avatar: '',
  });
  const [avatarUploading, setAvatarUploading] = useState(false);
  useEffect(() => {
    setUserForm({ name: user.name, avatar: user.avatar });
  }, [isOpen]);
  return (
    <EditProfileModalWrapper isOpen={isOpen}>
      <EditProfileModalBody className="wl-user-modal-update-profile_body">
        <ModalBaseTitle>Edit Profile</ModalBaseTitle>
        <EditProfileForm className="wl-user-modal-update-profile_form">
          <EditAvatarBox
            onClick={() => {
              document.getElementById('uploadinput')?.click();
            }}
          >
            <input
              title="uploadinput"
              id="uploadinput"
              style={{ display: 'none' }}
              type="file"
              accept="image/png, image/gif, image/jpeg"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                if (file.size > AVATAR_SIZE_LIMIT) {
                  toast.error(
                    `File Too Large, ${AVATAR_SIZE_LIMIT / 1024}k limit`
                  );
                  return;
                }
                setAvatarUploading(true);
                uploadUserAvatar(user.token, file)
                  .then((result) => {
                    setUserForm({ ...userForm, avatar: result.data.url });
                    toast.success('upload success');
                  })
                  .catch((error) => toast.error(error.message))
                  .finally(() => setAvatarUploading(false));
              }}
            />

            {(avatarUploading && (
              <div className="uploading">
                <img src={LoadingSvg} alt="" />
                <p>Uploading ...</p>
              </div>
            )) || <EditAvatar src={userForm.avatar} />}
          </EditAvatarBox>

          <EditNameBox>
            <EditNameLabel>Name</EditNameLabel>
            <input
              title="name"
              id="name"
              value={userForm.name}
              onChange={(e) =>
                setUserForm({ ...userForm, name: e.target.value })
              }
            />
          </EditNameBox>
        </EditProfileForm>
        <EditProfileBtns className="wl-user-modal-update-profile_btns">
          <CancelBtn onClick={onClose}>Cancel</CancelBtn>
          <SaveBtn
            disabled={isLoading}
            onClick={() => onSave && onSave(userForm)}
          >
            {isLoading ? 'Loading ...' : 'Save'}
          </SaveBtn>
        </EditProfileBtns>
      </EditProfileModalBody>
    </EditProfileModalWrapper>
  );
};
export default EditProfileModal;

const EditProfileModalWrapper = styled(ModalBase)``;
const EditProfileModalBody = styled.div`
  width: 540px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: #f7f9f1;
  border-radius: 20px;
  ${isMobile &&
  `
  width: auto;
  `}
`;
const EditProfileForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EditAvatarBox = styled.div`
  margin: 0 auto;
  width: 160px;
  height: 160px;
  position: relative;
  ${isMobile &&
  `
    width: 80px;
    height: 80px;
  `}
  &:hover {
    cursor: pointer;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url(${UploadImgMaskImg});
    }
  }
  & .uploading {
    text-align: center;
    padding-top: 20px;
    ${isMobile &&
    `
      padding-top: 0;
      font-size: 12px;
      line-height: 18px;
    `}
  }
`;
const EditAvatar = styled(UserAvatar)`
  width: 160px;
  height: 160px;
  object-fit: cover;
  ${isMobile &&
  `
    width: 80px;
    height: 80px;
  `}
`;
const EditNameBox = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  & input {
    padding: 11.5px 18px;
    margin-top: 10px;
    border-radius: 10px;
    background: #ebeee4;
    border: none !important;
    outline: none !important;
    font-weight: 400;
    font-size: 18px;
    line-height: 27px;
    color: #333333;
  }
`;
const EditNameLabel = styled.div`
  font-weight: 700;
  font-size: 18px;
  line-height: 27px;
  color: #333333;
`;
const EditProfileBtns = styled.div`
  display: flex;
  justify-content: end;
  gap: 20px;
  ${isMobile &&
  `
    justify-content: space-between;
  `}
`;
const CancelBtn = styled(ButtonInfo)`
  width: 120px;
`;
const SaveBtn = styled(ButtonPrimary)`
  width: 204px;
`;
