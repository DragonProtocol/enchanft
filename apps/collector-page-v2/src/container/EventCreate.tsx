/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-07 10:41:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-08 17:52:14
 * @Description: file description
 */
import styled from 'styled-components';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { useWlUserReact } from '@ecnft/wl-user-react';
import { Platform, Reward } from '../services/types/common';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchProjectSelectList,
  selectAll,
} from '../features/project/projectSelectList';
import { CreateEventData, EventChain } from '../services/types/event';
import UploadImgMaskImg from '../components/imgs/upload_img_mask.svg';
import { uploadImage } from '../services/api/upload';
import { EVENT_IMAGE_SIZE_LIMIT } from '../constants';
import { eventCreate, selectState } from '../features/event/eventCreate';
import { AsyncRequestStatus } from '../services/types';

const platformOptions: Array<{
  value: Platform;
  label: string;
}> = [
  {
    value: Platform.GALXE,
    label: 'Galxe',
  },
  {
    value: Platform.NOOX,
    label: 'Noox',
  },
  {
    value: Platform.POAP,
    label: 'POAP',
  },
  {
    value: Platform.QUEST3,
    label: 'Quest3',
  },
];
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
  value: EventChain;
  label: string;
}> = [
  {
    value: EventChain.ETH,
    label: 'Ethereum',
  },
  {
    value: EventChain.SOLANA,
    label: 'Solana',
  },
];
function EventCreate() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProjectSelectList());
  }, []);
  const projectSelectList = useAppSelector(selectAll);
  const projectOptions = useMemo(
    () =>
      projectSelectList.map((item) => ({ value: item.id, label: item.name })),
    [projectSelectList]
  );
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
      platform: Platform.GALXE,
      project: projectOptions[0]?.value,
      link: '',
      chain: EventChain.ETH,
      reward: Reward.BADGE,
      startTime: new Date().getTime(),
      endTime: new Date().getTime(),
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      platform: Yup.string().required('Required'),
      project: Yup.number().required('Required'),
      link: Yup.string().required('Required'),
      chain: Yup.string().required('Required'),
      reward: Yup.string().required('Required'),
      startTime: Yup.number().required('Required'),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const renderFieldError = useCallback(
    (field: string) => {
      return formik.touched[field] && formik.errors[field] ? (
        <FieldErrorText>{formik.errors[field]}</FieldErrorText>
      ) : null;
    },
    [formik.touched, formik.errors]
  );

  return (
    <EventCreateWrapper>
      <EventCreateForm
        onSubmit={formik.handleSubmit}
        onReset={formik.handleReset}
      >
        <label htmlFor="name">name</label>
        <input
          id="name"
          name="name"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        {renderFieldError('name')}
        <label htmlFor="description">description</label>
        <textarea
          id="description"
          name="description"
          onChange={formik.handleChange}
          value={formik.values.description}
        />
        {renderFieldError('description')}
        <label htmlFor="image">image</label>
        <UploadImage
          url={formik.values.image}
          onSuccess={(url) => formik.setFieldValue('image', url)}
        />
        {renderFieldError('image')}
        <label htmlFor="platform">platform</label>
        <Select
          id="platform"
          name="platform"
          options={platformOptions}
          onChange={({ value }) => formik.setFieldValue('platform', value)}
          value={platformOptions.find(
            (item) => item.value === formik.values.platform
          )}
        />
        {renderFieldError('platform')}
        <label htmlFor="project">project</label>
        <Select
          id="project"
          name="project"
          options={projectOptions}
          onChange={({ value }) => formik.setFieldValue('project', value)}
          value={projectOptions.find(
            (item) => item.value === formik.values.project
          )}
        />
        {renderFieldError('project')}
        <label htmlFor="link">link</label>
        <input
          id="link"
          name="link"
          onChange={formik.handleChange}
          value={formik.values.link}
        />
        {renderFieldError('link')}
        <label htmlFor="chain">chain</label>
        <Select
          id="chain"
          name="chain"
          options={chainOptions}
          onChange={({ value }) => formik.setFieldValue('chain', value)}
          value={chainOptions.find(
            (item) => item.value === formik.values.chain
          )}
        />
        {renderFieldError('chain')}
        <label htmlFor="reward">reward</label>
        <Select
          id="reward"
          name="reward"
          options={rewardOptions}
          onChange={({ value }) => formik.setFieldValue('reward', value)}
          value={rewardOptions.find(
            (item) => item.value === formik.values.reward
          )}
        />
        {renderFieldError('reward')}
        <label htmlFor="startTime">time</label>
        <TimeRow>
          <input
            id="startTime"
            name="startTime"
            type="datetime-local"
            onChange={(e) =>
              formik.setFieldValue(
                'startTime',
                new Date(e.target.value).getTime()
              )
            }
            value={dayjs(formik.values.startTime).format('YYYY-MM-DDTHH:mm:ss')}
          />
          {renderFieldError('startTime')}
          {!noEndTime && (
            <>
              -
              <input
                id="endTime"
                name="endTime"
                type="datetime-local"
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

          <label>
            <input
              type="checkbox"
              checked={noEndTime}
              onChange={(e) => setNoEndTime(!noEndTime)}
            />
            <span>No end</span>
          </label>
        </TimeRow>
        <FormButtons>
          <button type="reset" disabled={loading}>
            Reset
          </button>
          <button type="submit" disabled={loading}>
            Submit
          </button>
        </FormButtons>
      </EventCreateForm>
    </EventCreateWrapper>
  );
}
export default EventCreate;
const EventCreateWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`;
const EventCreateForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const TimeRow = styled.div`
  display: flex;
  gap: 20px;
`;
const FieldErrorText = styled.div`
  color: red;
`;
const FormButtons = styled.div`
  display: flex;
  gap: 20px;
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

      {(loading && (
        <div className="uploading">
          <p>Uploading ...</p>
        </div>
      )) || <UploadImagePreview src={url} />}
    </UploadImageWrapper>
  );
}

const UploadImageWrapper = styled.div`
  width: 160px;
  height: 160px;
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
    text-align: center;
    padding-top: 20px;
  }
`;
const UploadImagePreview = styled.img`
  width: 160px;
  height: 160px;
  object-fit: cover;
`;
