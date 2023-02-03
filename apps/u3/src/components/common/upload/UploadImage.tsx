import { toast } from 'react-toastify';
import { useWlUserReact } from '@ecnft/wl-user-react';
import { useState } from 'react';
import { EVENT_IMAGE_SIZE_LIMIT } from 'apps/u3/src/constants';
import { uploadImage } from 'apps/u3/src/services/api/upload';
import styled from 'styled-components';
import { messages } from 'apps/u3/src/utils/message';
import UploadImgMaskImg from '../../imgs/upload_img_mask.svg';
import CardBase from '../card/CardBase';

export default function UploadImage({
  url,
  onSuccess,
}: {
  url: string;
  onSuccess: (url: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { user } = useWlUserReact();
  return (
    <UploadImageWrapper
      onClick={() => {
        document.getElementById('uploadInput')?.click();
      }}
    >
      <input
        title="uploadInput"
        id="uploadInput"
        style={{ display: 'none' }}
        type="file"
        accept="image/png, image/gif, image/jpeg"
        onChange={(e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          if (file.size > EVENT_IMAGE_SIZE_LIMIT) {
            toast.error(messages.common.upload_img_limit);
            return;
          }
          setLoading(true);
          uploadImage(file, user.token)
            .then((result) => {
              onSuccess(result.data.url);
              toast.success(messages.common.upload_img);
            })
            .catch((error) =>
              toast.error(error.message || messages.common.error)
            )
            .finally(() => setLoading(false));
        }}
      />

      {(loading && <div className="uploading">Uploading ...</div>) ||
        (url && <UploadImagePreview src={url} />)}
    </UploadImageWrapper>
  );
}

const UploadImageWrapper = styled(CardBase)`
  width: 160px;
  height: 160px;
  padding: 0;
  position: relative;
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
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #4e5a6e;
  }
`;
const UploadImagePreview = styled.img`
  width: 160px;
  height: 160px;
  object-fit: cover;
`;
