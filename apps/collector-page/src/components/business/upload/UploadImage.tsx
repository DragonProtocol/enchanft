/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-14 18:02:58
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-15 13:51:40
 * @Description: file description
 */
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import Upload, { UploadProps } from 'rc-upload';
import IconUpload from '../../common/icons/IconUpload';
import { uploadImage } from '../../../services/api/utils';
export type UploadImageProps = React.PropsWithChildren<{
  url?: string;
  description?: string;
  disabled?: boolean;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}>;

const UploadImage: React.FC<UploadImageProps> = ({
  url,
  description,
  disabled,
  children,
  onSuccess,
  onError,
}: UploadImageProps) => {
  const [imgState, setImgState] = useState({
    name: '',
    loading: false,
    percent: 0,
  });
  const uploadProps: UploadProps = useMemo(
    () => ({
      disabled: disabled || imgState.loading,
      multiple: false,
      component: UploadImageWrapper,
      customRequest: ({ file }) => {
        setImgState({ ...imgState, name: (file as File).name, loading: true });
        uploadImage(file as File, ({ total, loaded }) => {
          setImgState({
            ...imgState,
            percent: Number(Math.round((loaded / total) * 100).toFixed(2)),
          });
        })
          .then(({ data }) => {
            onSuccess(data.url);
          })
          .catch(onError)
          .finally(() => setImgState({ ...imgState, loading: false }));

        return {
          abort() {
            console.log('upload progress is aborted.');
          },
        };
      },
      beforeUpload: (file) => {
        return file && file['type'].split('/')[0] === 'image';
      },
    }),
    [imgState, disabled]
  );

  return (
    <Upload {...uploadProps}>
      {children ||
        (imgState.loading ? (
          <UploadDiscriptionText>{`${imgState.name} [ ${imgState.percent}% ]`}</UploadDiscriptionText>
        ) : url ? (
          <UploadImagePreview src={url} />
        ) : (
          <>
            <IconUpload />
            <UploadDiscriptionText>{description}</UploadDiscriptionText>
          </>
        ))}
    </Upload>
  );
};
export default UploadImage;
const UploadImageWrapper = styled.div`
  width: 100%;
  min-height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 2px 8px;
  gap: 10px;

  background: #e2e4de;
  border-radius: 10px;
  cursor: pointer;
`;
const UploadDiscriptionText = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: rgba(51, 51, 51, 0.5);
`;
const UploadImagePreview = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
