import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { login, useWlUserReact } from '@ecnft/wl-user-react';
import { CreateEventData } from '../../services/types/event';
import UploadImgMaskImg from '../imgs/upload_img_mask.svg';
import { uploadImage } from '../../services/api/upload';
import { EVENT_IMAGE_SIZE_LIMIT } from '../../constants';
import { MainWrapper } from '../layout/Index';
import CardBase from '../common/card/CardBase';
import InputBase from '../common/input/InputBase';
import Select from '../common/select/Select';
import { ButtonPrimary, ButtonPrimaryLine } from '../common/button/ButtonBase';
import Switch from '../common/switch/Switch';
import RefreshSvg from '../common/icons/svgs/refresh.svg';
import TimePicker from '../common/time/TimePicker';
import EventLinkPreview from './EventLinkPreview';
import ProjectAsyncSelect from '../business/form/ProjectAsyncSelect';
import {
  EVENT_ADMIN_PLUS_SCORE_STEP,
  NO_ENDTIME_TIMESTRAMP,
} from '../../utils/event';
import useConfigsTopics from '../../hooks/useConfigsTopics';
import useConfigsPlatforms from '../../hooks/useConfigsPlatforms';

type Props = {
  initialValues: CreateEventData;
  loading?: boolean;
  onSubmit?: (values: CreateEventData) => void;
};
export default forwardRef(function EventForm(
  { initialValues, loading, onSubmit }: Props,
  ref
) {
  const [noEndTime, setNoEndTime] = useState(
    !initialValues.endTime || initialValues.endTime === NO_ENDTIME_TIMESTRAMP
  );
  const { topics } = useConfigsTopics();
  const { eventPlatforms } = useConfigsPlatforms();
  const typesOptions = useMemo(
    () =>
      topics.eventTypes.map((item) => ({
        value: item.value,
        label: item.name,
      })),
    [topics]
  );
  const rewardOptions = useMemo(
    () =>
      topics.eventRewards.map((item) => ({
        value: item.value,
        label: item.name,
      })),
    [topics]
  );
  const chainOptions = useMemo(
    () =>
      topics.chains.map((item) => ({
        value: item.chainEnum,
        label: item.name,
      })),
    [topics]
  );
  const platformOptions = useMemo(
    () =>
      eventPlatforms.map((item) => ({
        value: item.platform,
        label: item.platform,
        iconUrl: item.platformLogo,
      })),
    [eventPlatforms]
  );

  const handleSubmit = useCallback(
    (form: CreateEventData) => {
      const data = {
        ...form,
        endTime: noEndTime ? NO_ENDTIME_TIMESTRAMP : form.endTime,
      };
      onSubmit(data);
    },
    [noEndTime, onSubmit]
  );
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      platform: Yup.string().required('Required'),
      project: Yup.number().required('Required'),
      link: Yup.string().required('Required').url('Please enter a regular url'),
      chain: Yup.string().required('Required'),
      reward: Yup.string().required('Required'),
      startTime: Yup.number().required('Required'),
      types: Yup.array().required('Required'),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  useImperativeHandle(
    ref,
    () => ({
      resetForm: formik.resetForm,
    }),
    []
  );

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
          <FormLabel htmlFor="link">Original URL</FormLabel>
          <InputBase
            placeholder="Original URL"
            onChange={(e) => formik.setFieldValue('link', e.target.value)}
            value={formik.values.link}
            onBlur={() => {
              if (
                !formik.values.link.startsWith('http') &&
                formik.values.link.length > 4
              ) {
                const urlWithProtocol = `https://${formik.values.link}`;
                formik.setFieldValue('link', urlWithProtocol);
              }
            }}
          />
          {renderFieldError('link')}
        </FormField>

        <FormField>
          <FormLabel htmlFor="name">Title</FormLabel>
          <InputBase
            placeholder="Title"
            onChange={(e) => formik.setFieldValue('name', e.target.value)}
            value={formik.values.name}
          />
          {renderFieldError('name')}
        </FormField>

        {/* <FormField>
          <FormLabel htmlFor="description">Description</FormLabel>
          <InputBase
            placeholder="Description"
            onChange={(e) =>
              formik.setFieldValue('description', e.target.value)
            }
            value={formik.values.description}
          />
          {renderFieldError('description')}
        </FormField> */}

        <FormField>
          <FormLabel htmlFor="image">Image</FormLabel>
          <UploadImage
            url={formik.values.image}
            onSuccess={(url) => formik.setFieldValue('image', url)}
          />
          {renderFieldError('image')}
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
          <FormLabel htmlFor="platform">Platform</FormLabel>
          <Select
            placeholder="Filter by Platform"
            options={platformOptions}
            onChange={(value) => formik.setFieldValue('platform', value)}
            onSelectOption={(option) => setSelectPlatformLogo(option.iconUrl)}
            value={formik.values.platform}
          />
          {renderFieldError('platform')}
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
          <FormLabel htmlFor="types">Event Type</FormLabel>
          <Select
            id="types"
            options={typesOptions}
            onChange={(value) => formik.setFieldValue('types', [value])}
            value={formik.values.types[0]}
          />
          {renderFieldError('types')}
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
          <FormLabel htmlFor="project">Project</FormLabel>
          <ProjectAsyncSelect
            placeholder="Filter by Project"
            value={formik.values.project}
            onChange={(value) => formik.setFieldValue('project', value)}
          />
          {renderFieldError('project')}
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
            <SwitchText>Iframe supports the website display 👉</SwitchText>
          </SwitchRow>
        </FormField>
        <FormField>
          <FormLabel htmlFor="editorScore">admin score</FormLabel>
          <InputBase
            placeholder="score"
            type="number"
            min={0}
            step={EVENT_ADMIN_PLUS_SCORE_STEP}
            value={formik.values.editorScore as unknown as string}
            onChange={(e) =>
              formik.setFieldValue('editorScore', e.target.value)
            }
          />
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
});
const EventCreateWrapper = styled(MainWrapper)`
  display: flex;
  gap: 24px;
`;

const EventCreateFormCard = styled(CardBase)`
  width: 360px;
  height: 100%;
  overflow-y: auto;
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
  gap: 2px;
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
  height: 100%;
  flex: 1;
  padding: 0;
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
