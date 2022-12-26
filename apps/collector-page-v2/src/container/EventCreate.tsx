/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-07 10:41:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-26 15:54:58
 * @Description: file description
 */
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useWlUserReact } from '@ecnft/wl-user-react';
import {
  ChainType,
  OrderBy,
  Platform,
  PlatformLogo,
  Reward,
} from '../services/types/common';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchProjectSelectList,
  selectAll,
} from '../features/project/projectSelectList';
import { CreateEventData } from '../services/types/event';
import UploadImgMaskImg from '../components/imgs/upload_img_mask.svg';
import { uploadImage } from '../services/api/upload';
import { EVENT_IMAGE_SIZE_LIMIT } from '../constants';
import { eventCreate, selectState } from '../features/event/eventCreate';
import { AsyncRequestStatus } from '../services/types';
import { MainWrapper } from '../components/layout/Index';
import CardBase from '../components/common/card/CardBase';
import InputBase from '../components/common/input/InputBase';
import Select from '../components/common/select/Select';
import {
  ButtonPrimary,
  ButtonPrimaryLine,
} from '../components/common/button/ButtonBase';
import Switch from '../components/common/switch/Switch';
import RefreshSvg from '../components/common/icons/svgs/refresh.svg';
import TimePicker from '../components/common/time/TimePicker';
import EventLinkPreview from '../components/event/EventLinkPreview';
import ProjectAsyncSelect from '../components/business/form/ProjectAsyncSelect';
import PlatformSelect from '../components/business/form/PlatformSelect';

const rewardOptions: Array<{
  value: Reward;
  label: string;
}> = [
  {
    value: Reward.BADGE,
    label: 'Badge',
  },
  {
    value: Reward.NFT,
    label: 'NFT',
  },
  {
    value: Reward.TOKEN,
    label: 'Token',
  },
  {
    value: Reward.WL,
    label: 'WL',
  },
];
const chainOptions: Array<{
  value: ChainType;
  label: string;
}> = [
  {
    value: ChainType.EVM,
    label: 'Ethereum',
  },
  {
    value: ChainType.SOLANA,
    label: 'Solana',
  },
  {
    value: ChainType.BSC,
    label: 'Bsc',
  },
  {
    value: ChainType.MATIC,
    label: 'Polygon',
  },
  {
    value: ChainType.APTOS,
    label: 'Aptos',
  },
];
function EventCreate() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProjectSelectList());
  }, []);
  const { status } = useAppSelector(selectState);
  const loading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  const [noEndTime, setNoEndTime] = useState(false);
  const handleSubmit = useCallback(
    (form: CreateEventData) => {
      const data = {
        ...form,
        endTime: noEndTime ? 0 : form.endTime,
      };
      dispatch(eventCreate(data));
    },
    [noEndTime]
  );
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      image: '',
      platform: '' as unknown as Platform,
      project: '' as unknown as number,
      link: '',
      chain: ChainType.EVM,
      reward: Reward.BADGE,
      startTime: new Date().getTime(),
      endTime: new Date().getTime(),
      supportIframe: true,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      platform: Yup.string().required('Required'),
      project: Yup.number().required('Required'),
      link: Yup.string().required('Required').url('Please enter a regular url'),
      chain: Yup.string().required('Required'),
      reward: Yup.string().required('Required'),
      startTime: Yup.number().required('Required'),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  useEffect(() => {
    if (status === AsyncRequestStatus.FULFILLED) {
      formik.resetForm();
    }
  }, [status]);
  const renderFieldError = useCallback(
    (field: string) => {
      return formik.touched[field] && formik.errors[field] ? (
        <FieldErrorText>{formik.errors[field]}</FieldErrorText>
      ) : null;
    },
    [formik.touched, formik.errors]
  );

  const [selectPlatformLogo, setSelectPlatformLogo] = useState('');
  const previewData = useMemo(() => {
    return {
      ...formik.values,
      platform: {
        logo: selectPlatformLogo,
      },
    };
  }, [formik.values, selectPlatformLogo]);

  return (
    <EventCreateWrapper>
      <EventCreateFormCard>
        <FormField>
          <FormLabel htmlFor="name">Title</FormLabel>
          <InputBase
            placeholder="Title"
            onChange={(e) => formik.setFieldValue('name', e.target.value)}
            value={formik.values.name}
          />
          {renderFieldError('name')}
        </FormField>

        <FormField>
          <FormLabel htmlFor="description">Description</FormLabel>
          <InputBase
            placeholder="Description"
            onChange={(e) =>
              formik.setFieldValue('description', e.target.value)
            }
            value={formik.values.description}
          />
          {renderFieldError('description')}
        </FormField>

        <FormField>
          <FormLabel htmlFor="image">Image</FormLabel>
          <UploadImage
            url={formik.values.image}
            onSuccess={(url) => formik.setFieldValue('image', url)}
          />
          {renderFieldError('image')}
        </FormField>

        <FormField>
          <FormLabel htmlFor="platform">Platform</FormLabel>
          <PlatformSelect
            placeholder="Filter by Platform"
            onChange={(value) => formik.setFieldValue('platform', value)}
            onSelectOption={(option) => setSelectPlatformLogo(option.iconUrl)}
            value={formik.values.platform}
          />
          {renderFieldError('platform')}
        </FormField>

        <FormField>
          <FormLabel htmlFor="project">Project</FormLabel>
          <ProjectAsyncSelect
            placeholder="Filter by Project"
            value={formik.values.project}
            onChange={(option) => formik.setFieldValue('project', option.value)}
          />
          {renderFieldError('project')}
        </FormField>

        <FormField>
          <FormLabel htmlFor="link">Original URL</FormLabel>
          <InputBase
            placeholder="Original URL"
            onChange={(e) => formik.setFieldValue('link', e.target.value)}
            value={formik.values.link}
          />
          {renderFieldError('link')}
        </FormField>

        <FormField>
          <FormLabel htmlFor="chain">Blockchain</FormLabel>
          <Select
            options={chainOptions}
            onChange={(value) => formik.setFieldValue('chain', value)}
            value={formik.values.chain}
          />
          {renderFieldError('chain')}
        </FormField>

        <FormField>
          <FormLabel htmlFor="reward">Reward</FormLabel>
          <Select
            id="reward"
            options={rewardOptions}
            onChange={(value) => formik.setFieldValue('reward', value)}
            value={formik.values.reward}
          />
          {renderFieldError('reward')}
        </FormField>

        <FormField>
          <FormLabel htmlFor="startTime">Time</FormLabel>
          <TimeRow>
            <TimePicker
              placeholder="Start Time"
              onChange={(e) =>
                formik.setFieldValue(
                  'startTime',
                  new Date(e.target.value).getTime()
                )
              }
              value={dayjs(formik.values.startTime).format(
                'YYYY-MM-DDTHH:mm:ss'
              )}
            />
            {renderFieldError('startTime')}
            {!noEndTime && (
              <>
                -
                <TimePicker
                  placeholder="End Time"
                  onChange={(e) =>
                    formik.setFieldValue(
                      'endTime',
                      new Date(e.target.value).getTime()
                    )
                  }
                  value={dayjs(formik.values.endTime).format(
                    'YYYY-MM-DDTHH:mm:ss'
                  )}
                  min={dayjs(formik.values.startTime).format(
                    'YYYY-MM-DDTHH:mm:ss'
                  )}
                />
                {renderFieldError('endTime')}
              </>
            )}
          </TimeRow>
          <SwitchRow>
            <Switch
              onChange={(checked) => setNoEndTime(checked)}
              checked={noEndTime}
            />
            <SwitchText>No end</SwitchText>
          </SwitchRow>
        </FormField>

        <FormField>
          <FormLabel htmlFor="supportIframe">Iframe Display</FormLabel>
          <SwitchRow>
            <Switch
              onChange={(checked) =>
                formik.setFieldValue('supportIframe', checked)
              }
              checked={formik.values.supportIframe}
            />
            <SwitchText>Support</SwitchText>
          </SwitchRow>
        </FormField>

        <FormButtons>
          <ButtonPrimaryLine
            type="reset"
            disabled={loading}
            onClick={formik.handleReset}
          >
            <FormButtonIcon src={RefreshSvg} />
          </ButtonPrimaryLine>
          <FormButtonSubmit
            type="submit"
            disabled={loading}
            onClick={() => formik.submitForm()}
          >
            Submit
          </FormButtonSubmit>
        </FormButtons>
      </EventCreateFormCard>
      <EventPreviewBox>
        <EventLinkPreview data={previewData} />
      </EventPreviewBox>
    </EventCreateWrapper>
  );
}
export default EventCreate;
const EventCreateWrapper = styled(MainWrapper)`
  height: auto;
  display: flex;
  gap: 40px;
`;

const EventCreateFormCard = styled(CardBase)`
  width: 360px;
  border: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const FormLabel = styled.label`
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #ffffff;
  text-transform: 'capitalize';
`;
const SwitchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const SwitchText = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #4e5a6e;
`;
const TimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #39424c;
`;
const FieldErrorText = styled.div`
  color: red;
`;
const FormButtons = styled.div`
  display: flex;
  gap: 20px;
`;
const FormButtonSubmit = styled(ButtonPrimary)`
  flex: 1;
`;
const FormButtonIcon = styled.img`
  width: 24px;
  height: 24px;
`;
const EventPreviewBox = styled(CardBase)`
  width: 0;
  height: auto;
  flex: 1;
  padding: 0;
`;
const EventPreview = styled.iframe`
  width: 100%;
  min-height: 100%;
  border: none;
`;
function UploadImage({
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
            toast.error(
              `File Too Large, ${EVENT_IMAGE_SIZE_LIMIT / 1024}k limit`
            );
            return;
          }
          setLoading(true);
          uploadImage(file, user.token)
            .then((result) => {
              onSuccess(result.data.url);
              toast.success('upload success');
            })
            .catch((error) => toast.error(error.message))
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
