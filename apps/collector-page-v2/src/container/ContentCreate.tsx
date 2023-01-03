import { useWlUserReact } from '@ecnft/wl-user-react';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSearchParams } from 'react-router-dom';
import ScrollBox from '../components/common/box/ScrollBox';
import { ButtonPrimary } from '../components/common/button/ButtonBase';
import CardBase from '../components/common/card/CardBase';
import InputBase from '../components/common/input/InputBase';
import Select from '../components/common/select/Select';
import Switch from '../components/common/switch/Switch';
import { MainWrapper } from '../components/layout/Index';
import CrownImg from '../components/imgs/crown.svg';
import {
  contentParse,
  getContentProjects,
  saveContent,
} from '../services/api/contents';
import { ContentLang, ContentType, Project } from '../services/types/contents';
import { Close } from '../components/icons/close';
import { ProjectAsyncSelectV2 } from '../components/business/form/ProjectAsyncSelect';
import {
  ContentBox,
  ContentShowerTab,
  LoadingBox,
  Tab,
} from '../components/contents/ContentShowerBox';
import { useAppSelector } from '../store/hooks';
import { selectWebsite } from '../features/website/websiteSlice';
import Loading from '../components/common/loading/Loading';
import isUrl from '../utils/isUrl';

function ContentCreate() {
  const { user } = useWlUserReact();
  const [parsing, setParsing] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { u3ExtensionInstalled } = useAppSelector(selectWebsite);
  const [tab, setTab] = useState<Tab>(
    u3ExtensionInstalled ? 'original' : 'readerView'
  );

  const [loading, setLoading] = useState(false);

  const [urlContent, setUrlContent] = useState({
    title: '',
    content: '',
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      author: '',
      url: searchParams.get('url') || '',
      type: ContentType.NEWS,
      lang: ContentLang.English,
      uniProjectId: [],
      supportReaderView: true,
      supportIframe: true,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      author: Yup.string().required('Required'),
      url: Yup.string().required('Required').url('Please enter a regular url'),
      type: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      submitContent(values);
    },
  });

  const reset = useCallback(() => {
    formik.resetForm();
    setUrlContent({
      title: '',
      content: '',
    });
  }, []);

  useEffect(() => {
    if (!formik.values.url) return;
    loadUrlContent();
  }, [formik.values.url]);

  const loadUrlContent = useCallback(async () => {
    if (!formik.values.url) return;
    if (!isUrl(formik.values.url)) return;
    setParsing(true);
    try {
      const { data } = await contentParse(formik.values.url);
      setUrlContent({
        title: data.data.title,
        content: data.data.content,
      });
      formik.setFieldValue('title', data.data.title);
    } catch (error) {
      toast.error(error.msg);
    } finally {
      setParsing(false);
    }
  }, [formik.values.url]);

  const submitContent = useCallback(
    async (data: {
      title: string;
      author: string;
      url: string;
      type: ContentType;
      lang: ContentLang;
      uniProjectId: { id: number }[];
      supportReaderView: boolean;
      supportIframe: boolean;
    }) => {
      if (loading) return;
      setLoading(true);
      try {
        await saveContent(
          {
            title: data.title,
            author: data.author,
            url: data.url,
            type: data.type,
            lang: data.lang,
            uniProjectId: data.uniProjectId.map((item) => item.id),
            supportReaderView: data.supportReaderView,
            supportIframe: data.supportIframe,
          },
          user.token
        );
        toast.success('Add Content Success!!!');
        reset();
      } catch (error) {
        toast.error('Add Content Fail!!!');
      } finally {
        setLoading(false);
      }
    },
    [user.token]
  );

  const renderFieldError = useCallback(
    (field: string) => {
      return formik.touched[field] && formik.errors[field] ? (
        <FieldErrorText>{formik.errors[field]}</FieldErrorText>
      ) : null;
    },
    [formik.touched, formik.errors]
  );

  return (
    <ScrollBox>
      <ContentCreateWrapper>
        <CreateBox>
          <FormField>
            <FormLabel htmlFor="original-url">Original URL</FormLabel>
            <InputBase
              onChange={(e) => formik.setFieldValue('url', e.target.value)}
              value={formik.values.url}
              placeholder="original url"
              onBlur={loadUrlContent}
            />
            {renderFieldError('url')}
          </FormField>

          <FormField>
            <FormLabel htmlFor="title">Title</FormLabel>
            <InputBase
              onChange={(e) => formik.setFieldValue('title', e.target.value)}
              value={formik.values.title}
              placeholder="title"
            />
            {renderFieldError('title')}
          </FormField>

          <FormField>
            <FormLabel htmlFor="author">Author</FormLabel>
            <InputBase
              onChange={(e) => formik.setFieldValue('author', e.target.value)}
              value={formik.values.author}
              placeholder="author"
            />
            {renderFieldError('author')}
          </FormField>

          <FormField>
            <FormLabel htmlFor="content-type">Content Type</FormLabel>
            <Select
              options={Object.values(ContentType).map((item) => {
                return {
                  value: item,
                  label: item,
                };
              })}
              onChange={(value) =>
                formik.setFieldValue('type', value as ContentType)
              }
              value={formik.values.type}
            />
            {renderFieldError('type')}
          </FormField>

          <FormField>
            <FormLabel htmlFor="content-lang">Content Lang</FormLabel>
            <Select
              defaultValue={ContentLang.English}
              options={Object.keys(ContentLang)
                .slice(1)
                .map((item) => {
                  return {
                    value: ContentLang[item],
                    label: item,
                  };
                })}
              onChange={(value) =>
                formik.setFieldValue('lang', value as ContentLang)
              }
              value={formik.values.lang}
            />
            {/* {renderFieldError('lang')} */}
          </FormField>

          <FormField>
            <FormLabel htmlFor="support-reader">Reader View</FormLabel>
            <SwitchRow>
              <Switch
                onChange={(checked) =>
                  formik.setFieldValue('supportReaderView', checked)
                }
                checked={formik.values.supportReaderView}
              />
              <SwitchText>Readability</SwitchText>
            </SwitchRow>
          </FormField>

          <FormField>
            <FormLabel htmlFor="support-iframe">Original</FormLabel>
            <SwitchRow>
              <Switch
                onChange={(checked) =>
                  formik.setFieldValue('supportIframe', checked)
                }
                checked={formik.values.supportIframe}
              />
              <SwitchText>Original</SwitchText>
            </SwitchRow>
          </FormField>

          <FormField>
            <FormLabel htmlFor="project">Tag Project</FormLabel>
            <div className="proj-list">
              {formik.values.uniProjectId.map((item, idx) => {
                return (
                  <div key={item.id}>
                    <div>
                      <img src={item.image} alt="" />
                      {item.name}{' '}
                    </div>
                    <span
                      className="close"
                      onClick={() => {
                        formik.setFieldValue('uniProjectId', [
                          ...formik.values.uniProjectId.slice(0, idx),
                          ...formik.values.uniProjectId.slice(idx + 1),
                        ]);
                      }}
                    >
                      <Close />
                    </span>
                  </div>
                );
              })}
            </div>
            <ProjectAsyncSelectV2
              value=""
              onChange={(value) => {
                if (
                  !formik.values.uniProjectId.find(
                    (item) => item.id === value.id
                  )
                ) {
                  formik.setFieldValue('uniProjectId', [
                    ...formik.values.uniProjectId,
                    value,
                  ]);
                }
                // setSelectProjects([...selectProjects, value]);
              }}
            />
          </FormField>

          <FormButtons>
            <FormButtonSubmit
              type="submit"
              disabled={loading}
              onClick={() => formik.submitForm()}
            >
              Submit
            </FormButtonSubmit>
          </FormButtons>
        </CreateBox>
        <ShowBox>
          <ContentBox>
            <ContentShowerTab tab={tab} setTab={(t) => setTab(t)} />
            {(() => {
              if (tab === 'original') {
                return (
                  <div className="iframe-container">
                    {isUrl(formik.values.url) && (
                      <iframe title="daylight" src={formik.values.url} />
                    )}
                  </div>
                );
              }
              if (parsing) {
                return (
                  <LoadingBox>
                    <Loading />
                  </LoadingBox>
                );
              }
              return (
                <div className="reader-view">
                  <h3>{urlContent.title}</h3>
                  <div
                    dangerouslySetInnerHTML={{ __html: urlContent.content }}
                  />
                </div>
              );
            })()}
          </ContentBox>
        </ShowBox>
      </ContentCreateWrapper>
    </ScrollBox>
  );
}
export default ContentCreate;
const ContentCreateWrapper = styled(MainWrapper)`
  display: flex;
  gap: 24px;
`;

const CreateBox = styled(CardBase)`
  width: 360px;
  border: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
  overflow: scroll;

  > div {
    input,
    select {
      box-sizing: border-box;
      width: 100%;
      width: 100%;
      background: inherit;
      outline: none;
      color: #fff;
      border: 1px solid #39424c;
      height: 40px;
      border-radius: 10px;
    }
    select {
      padding-left: 5px;
      margin-top: 10px;
      appearance: none;
      background-image: url(${CrownImg});
      background-repeat: no-repeat;
      background-position: right 1rem center;
      background-size: 1em;
    }
    input[type='checkbox'] {
      width: initial;
    }
  }

  & .proj-list {
    display: flex;
    flex-direction: column;
    gap: 5px;

    > div {
      padding: 3px;
      padding: 10px;
      border: 1px solid #39424c;
      border-radius: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      > div {
        display: flex;
        align-items: center;
      }

      & img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        margin-right: 5px;
      }
    }

    & .close {
      cursor: pointer;
    }
  }
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
const ShowBox = styled.div`
  flex-grow: 1;
  height: 100%;
  border: 1px solid #39424c;
  border-radius: 20px;
  /* padding: 10px; */
  overflow: scroll;
  color: white;
  width: calc(100% - 360px);

  & img {
    max-width: 100%;
  }
  & pre {
    overflow: scroll;
  }

  & .reader-view {
    padding: 10px;
    overflow: scroll;
    height: calc(100% - 60px);
    background: #1b1e23;
  }
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

const FieldErrorText = styled.div`
  color: red;
`;
