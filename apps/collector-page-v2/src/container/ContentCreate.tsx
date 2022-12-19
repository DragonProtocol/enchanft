import { useWlUserReact } from '@ecnft/wl-user-react';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
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
import { ContentType, Project } from '../services/types/contents';
import { Close } from '../components/icons/close';
import { ProjectAsyncSelectV2 } from '../components/business/form/ProjectAsyncSelect';

function ContentCreate() {
  const { user } = useWlUserReact();
  const [parsing, setParsing] = useState(false);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [type, setType] = useState(ContentType.NEWS);
  const [selectProjects, setSelectProjects] = useState<Array<Project>>([]);
  const [supportReader, setSupportReader] = useState(true);

  const [urlContent, setUrlContent] = useState({
    title: '',
    content: '',
  });

  const reset = useCallback(() => {
    setTitle('');
    setAuthor('');
    setOriginalUrl('');
    setType(ContentType.NEWS);
    setSelectProjects([]);
  }, []);

  const loadUrlContent = useCallback(async () => {
    if (!originalUrl) return;
    setParsing(true);
    const { data } = await contentParse(originalUrl);

    setUrlContent({
      title: data.data.title,
      content: data.data.content,
    });
    setParsing(false);
  }, [originalUrl]);

  const submitContent = useCallback(async () => {
    if (
      !title ||
      !author ||
      !originalUrl ||
      !type ||
      selectProjects.length === 0
    )
      return;
    try {
      await saveContent(
        {
          title,
          author,
          url: originalUrl,
          types: type,
          uniProjectId: selectProjects.map((item) => item.id),
          supportReaderView: supportReader,
        },
        user.token
      );
      toast.success('Add Content Success!!!');
      reset();
    } catch (error) {
      toast.error('Add Content Fail!!!');
    }
  }, [
    user.token,
    title,
    author,
    originalUrl,
    type,
    selectProjects,
    supportReader,
  ]);

  return (
    <ScrollBox>
      <ContentCreateWrapper>
        <CreateBox>
          <FormField>
            <FormLabel htmlFor="title">Title</FormLabel>
            <InputBase
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              placeholder="title"
            />
            {/* {renderFieldError('name')} */}
          </FormField>

          <FormField>
            <FormLabel htmlFor="author">Author</FormLabel>
            <InputBase
              onChange={(e) => setAuthor(e.target.value)}
              value={author}
              placeholder="author"
            />
            {/* {renderFieldError('description')} */}
          </FormField>

          <FormField>
            <FormLabel htmlFor="original-url">Original URL</FormLabel>
            <InputBase
              onChange={(e) => setOriginalUrl(e.target.value)}
              value={originalUrl}
              placeholder="original url"
              onBlur={loadUrlContent}
            />
            {/* {renderFieldError('description')} */}
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
              onChange={(value) => setType(value as ContentType)}
              value={type}
            />
          </FormField>

          <FormField>
            <FormLabel htmlFor="support-reader">
              support reader view display
            </FormLabel>
            <SwitchRow>
              <Switch
                onChange={(checked) => setSupportReader(checked)}
                checked={supportReader}
              />
              <SwitchText>Support</SwitchText>
            </SwitchRow>
          </FormField>

          <FormField>
            <FormLabel htmlFor="project">Tag Project</FormLabel>
            <div className="proj-list">
              {selectProjects.map((item, idx) => {
                return (
                  <div key={item.id}>
                    <div>
                      <img src={item.image} alt="" />
                      {item.name}{' '}
                    </div>
                    <span
                      onClick={() => {
                        setSelectProjects([
                          ...selectProjects.slice(0, idx),
                          ...selectProjects.slice(idx + 1),
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
                if (!selectProjects.find((item) => item.id === value.id))
                  setSelectProjects([...selectProjects, value]);
              }}
            />
          </FormField>

          <FormButtons>
            <FormButtonSubmit
              type="submit"
              // disabled={loading}
              onClick={submitContent}
            >
              Submit
            </FormButtonSubmit>
          </FormButtons>
        </CreateBox>
        {(parsing && <ShowBox>Parseing</ShowBox>) || (
          <ShowBox>
            <h3>{urlContent.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: urlContent.content }} />
          </ShowBox>
        )}
      </ContentCreateWrapper>
    </ScrollBox>
  );
}
export default ContentCreate;
const ContentCreateWrapper = styled(MainWrapper)`
  width: 1240px;
  height: calc(100vh - 72px);
  box-sizing: border-box;
  display: flex;
  gap: 40px;
  color: #fff;
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
  padding: 10px;
  overflow: scroll;
  color: white;
  width: calc(100% - 360px);

  & img {
    max-width: 100%;
  }
  & pre {
    overflow: scroll;
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
