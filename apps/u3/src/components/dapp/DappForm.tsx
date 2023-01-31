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
import { toast } from 'react-toastify';
import { login, useWlUserReact } from '@ecnft/wl-user-react';
import UploadImgMaskImg from '../imgs/upload_img_mask.svg';
import { uploadImage } from '../../services/api/upload';
import { EVENT_IMAGE_SIZE_LIMIT } from '../../constants';
import CardBase from '../common/card/CardBase';
import InputBase from '../common/input/InputBase';
import { ButtonPrimary, ButtonPrimaryLine } from '../common/button/ButtonBase';
import Switch from '../common/switch/Switch';
import useConfigsTopics from '../../hooks/useConfigsTopics';
import {
  UpdateProjectData,
  UniprojectStatus,
} from '../../services/types/project';
import TextareaBase from '../common/input/TextareaBase';
import MultiSelect from '../common/select/MultiSelect';

export const PROJECT_ADMIN_PLUS_SCORE_STEP = 10;

type Props = {
  initialValues: UpdateProjectData;
  disabled?: boolean;
  loading?: boolean;
  onCancel?: () => void;
  onSubmit?: (values: UpdateProjectData) => void;
};
export default forwardRef(function DappForm(
  { initialValues, disabled, loading, onSubmit, onCancel }: Props,
  ref
) {
  const { topics } = useConfigsTopics();
  const typeOptions = useMemo(
    () =>
      topics.projectTypes.map((item) => ({
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
  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      name: Yup.string()
        .transform((value) => value || '')
        .required('Required'),
      description: Yup.string()
        .transform((value) => value || '')
        .required('Required'),
      image: Yup.string()
        .transform((value) => value || '')
        .required('Required')
        .url('Please upload dapp logo'),
      types: Yup.array(),
      dappUrl: Yup.string()
        .transform((value) => value || '')
        .nullable()
        .url('Please enter a regular url'),
      url: Yup.string()
        .transform((value) => value || '')
        .nullable()
        .url('Please enter a regular url'),
      status: Yup.string()
        .transform((value) => value || '')
        .nullable(),
      chains: Yup.array(),
      mediaLinks: Yup.object({
        twitter: Yup.string()
          .transform((value) => value || '')
          .nullable()
          .url('Please enter a regular url'),
        discord: Yup.string()
          .transform((value) => value || '')
          .nullable()
          .url('Please enter a regular url'),
        facebook: Yup.string()
          .transform((value) => value || '')
          .nullable()
          .url('Please enter a regular url'),
        telegram: Yup.string()
          .transform((value) => value || '')
          .nullable()
          .url('Please enter a regular url'),
      }),
      editorScore: Yup.number()
        .transform((value) => value || 0)
        .nullable(),
    }),
    onSubmit: (values) => {
      console.log({ values });

      onSubmit(values);
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
    (fieldStr: string) => {
      const fields = fieldStr.split('.');
      let touched = { ...formik.touched };
      let errors = { ...formik.errors };
      let errorText = '';
      for (const field of fields) {
        if (touched[field]) {
          touched = touched[field];
        }
        if (errors[field]) {
          errors = errors[field];
        }

        if (touched && typeof errors === 'string') {
          errorText = errors;
        }
      }
      return errorText ? <FieldErrorText>{errorText}</FieldErrorText> : null;
    },
    [formik.touched, formik.errors]
  );
  console.log({ formik });

  return (
    <DappFormWrapper>
      <FormGroupLabel>Information</FormGroupLabel>
      <FormField>
        <FormLabel htmlFor="name">Dapp name</FormLabel>
        <FormValueBox>
          <InputBase
            placeholder="Dapp name"
            onChange={(e) => formik.setFieldValue('name', e.target.value)}
            value={formik.values.name}
          />
          {renderFieldError('name')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel htmlFor="image">Image</FormLabel>
        <FormValueBox>
          <UploadImage
            url={formik.values.image}
            onSuccess={(url) => formik.setFieldValue('image', url)}
          />
          {renderFieldError('image')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel htmlFor="description">Description</FormLabel>
        <FormValueBox>
          <TextareaBase
            rows={3}
            placeholder="Description"
            onChange={(e) =>
              formik.setFieldValue('description', e.target.value)
            }
            value={formik.values.description}
          />
          {renderFieldError('description')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel>Dapp url</FormLabel>
        <FormValueBox>
          <InputBase
            placeholder="Dapp url"
            onChange={(e) => formik.setFieldValue('dappUrl', e.target.value)}
            value={formik.values.dappUrl}
            onBlur={() => {
              if (
                !formik.values?.dappUrl.startsWith('http') &&
                formik.values.dappUrl.length > 4
              ) {
                const urlWithProtocol = `https://${formik.values.dappUrl}`;
                formik.setFieldValue('dappUrl', urlWithProtocol);
              }
            }}
          />
          {renderFieldError('dappUrl')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel htmlFor="supportIframe">Verify</FormLabel>
        <Switch
          onChange={(checked) =>
            formik.setFieldValue(
              'status',
              checked ? UniprojectStatus.VERIFIED : UniprojectStatus.VISIBLE
            )
          }
          checked={formik.values.status === UniprojectStatus.VERIFIED}
        />
      </FormField>
      <FormField>
        <FormLabel htmlFor="type">Type</FormLabel>
        <FormValueBox>
          <MultiSelect
            options={typeOptions}
            onChange={(value) => formik.setFieldValue('types', value)}
            value={formik.values.types}
          />
          {renderFieldError('types')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel htmlFor="chain">Chain</FormLabel>
        <FormValueBox>
          <MultiSelect
            options={chainOptions}
            onChange={(value) => formik.setFieldValue('chains', value)}
            value={formik.values.chains}
          />
          {renderFieldError('chains')}
        </FormValueBox>
      </FormField>

      <FormGroupLabel>Social Network</FormGroupLabel>
      <FormField>
        <FormLabel>Facebook</FormLabel>
        <FormValueBox>
          <InputBase
            placeholder="Facebook"
            onChange={(e) =>
              formik.setFieldValue('mediaLinks.facebook', e.target.value)
            }
            value={formik.values?.mediaLinks?.facebook}
            onBlur={() => {
              if (
                !formik.values?.mediaLinks?.facebook.startsWith('http') &&
                formik.values?.mediaLinks?.facebook.length > 4
              ) {
                const urlWithProtocol = `https://${formik.values?.mediaLinks?.facebook}`;
                formik.setFieldValue('mediaLinks.facebook', urlWithProtocol);
              }
            }}
          />
          {renderFieldError('mediaLinks.facebook')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel>Twitter</FormLabel>
        <FormValueBox>
          <InputBase
            placeholder="Twitter"
            onChange={(e) =>
              formik.setFieldValue('mediaLinks.twitter', e.target.value)
            }
            value={formik.values?.mediaLinks?.twitter}
            onBlur={() => {
              if (
                !formik.values?.mediaLinks?.twitter.startsWith('http') &&
                formik.values?.mediaLinks?.twitter.length > 4
              ) {
                const urlWithProtocol = `https://${formik.values?.mediaLinks?.twitter}`;
                formik.setFieldValue('mediaLinks.twitter', urlWithProtocol);
              }
            }}
          />
          {renderFieldError('mediaLinks.twitter')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel>Discord</FormLabel>
        <FormValueBox>
          <InputBase
            placeholder="Discord"
            onChange={(e) =>
              formik.setFieldValue('mediaLinks.discord', e.target.value)
            }
            value={formik.values?.mediaLinks?.discord}
            onBlur={() => {
              if (
                !formik.values?.mediaLinks?.discord.startsWith('http') &&
                formik.values?.mediaLinks?.discord.length > 4
              ) {
                const urlWithProtocol = `https://${formik.values?.mediaLinks?.discord}`;
                formik.setFieldValue('mediaLinks.discord', urlWithProtocol);
              }
            }}
          />
          {renderFieldError('mediaLinks.discord')}
        </FormValueBox>
      </FormField>
      <FormField>
        <FormLabel>Telegram</FormLabel>
        <FormValueBox>
          <InputBase
            placeholder="Telegram"
            onChange={(e) =>
              formik.setFieldValue('mediaLinks.telegram', e.target.value)
            }
            value={formik.values?.mediaLinks?.telegram}
            onBlur={() => {
              if (
                !formik.values?.mediaLinks?.telegram.startsWith('http') &&
                formik.values?.mediaLinks?.telegram.length > 4
              ) {
                const urlWithProtocol = `https://${formik.values?.mediaLinks?.telegram}`;
                formik.setFieldValue('mediaLinks.telegram', urlWithProtocol);
              }
            }}
          />
          {renderFieldError('mediaLinks.telegram')}
        </FormValueBox>
      </FormField>

      <FormGroupLabel>admin score</FormGroupLabel>
      <FormField>
        <InputBase
          placeholder="score"
          type="number"
          min={0}
          step={PROJECT_ADMIN_PLUS_SCORE_STEP}
          value={formik.values.editorScore as unknown as string}
          onChange={(e) =>
            formik.setFieldValue('editorScore', Number(e.target.value))
          }
        />
      </FormField>

      <FormButtons>
        <ButtonPrimaryLine disabled={disabled || loading} onClick={onCancel}>
          Cancel
        </ButtonPrimaryLine>
        <ButtonPrimary
          disabled={disabled || loading}
          onClick={() => formik.submitForm()}
        >
          Submit
        </ButtonPrimary>
      </FormButtons>
    </DappFormWrapper>
  );
});
const DappFormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const FormGroupLabel = styled.label`
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #ffffff;
`;
const FormField = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  gap: 20px;
`;
const FormLabel = styled.label`
  width: 80px;
  font-size: 14px;
  line-height: 24px;
  color: #ffffff;
  text-transform: 'capitalize';
  & + input,
  & + textarea {
    flex: 1;
  }
`;
const FormValueBox = styled.div`
  flex: 1;
`;
const FieldErrorText = styled.div`
  margin-top: 5px;
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
