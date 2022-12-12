import { useWlUserReact } from '@ecnft/wl-user-react';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  contentParse,
  getContentProjects,
  saveContent,
} from '../services/api/contents';
import { ContentType, Project } from '../services/types/contents';

function ContentCreate() {
  const { user } = useWlUserReact();
  const [parsing, setParsing] = useState(false);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [type, setType] = useState(ContentType.NEWS);
  const [projects, setProjects] = useState<Array<Project>>([]);
  const [selectProjects, setSelectProjects] = useState<Array<Project>>([]);
  const [supportReader, setSupportReader] = useState(true);

  const [urlContent, setUrlContent] = useState({
    title: '',
    content: '',
  });

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
  }, [
    user.token,
    title,
    author,
    originalUrl,
    type,
    selectProjects,
    supportReader,
  ]);

  const loadProjects = useCallback(async () => {
    const { data } = await getContentProjects();
    setProjects(data.data);
  }, []);

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <ContentCreateWrapper>
      <CreateBox>
        <div>
          <div>Title</div>
          <input
            title="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <div>Author</div>
          <input
            title="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          <div>Original URL</div>
          <input
            title="original-url"
            type="text"
            onBlur={loadUrlContent}
            value={originalUrl}
            onChange={(e) => {
              setOriginalUrl(e.target.value);
            }}
          />
        </div>
        <div>
          <div>Content Type</div>
          <select
            title="type"
            value={type}
            onChange={(e) => {
              setType(e.target.value as ContentType);
            }}
          >
            {Object.values(ContentType).map((item) => {
              return (
                <option key={item} value={item}>
                  {item}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <label htmlFor="support-reader">
            support reader view display
            <input
              id="support-reader"
              title="support-reader"
              type="checkbox"
              defaultChecked={supportReader}
              onChange={(e) => {
                setSupportReader(e.target.checked);
              }}
            />
          </label>
        </div>
        <div>
          <div> Projects</div>
          <div>
            {selectProjects.map((item, idx) => {
              return (
                <div key={item.id}>
                  {item.name}{' '}
                  <span
                    onClick={() => {
                      setSelectProjects([
                        ...selectProjects.slice(0, idx),
                        ...selectProjects.slice(idx + 1),
                      ]);
                    }}
                  >
                    x
                  </span>
                </div>
              );
            })}
          </div>
          <select
            title="project"
            name=""
            id=""
            value="default"
            onChange={(e) => {
              const selectItem = projects.find((item) => {
                return item.id.toString() === e.target.value;
              });
              setSelectProjects([...selectProjects, selectItem]);
            }}
          >
            <option value="default">select project</option>
            {projects
              .filter((item) => {
                return !selectProjects.find((i) => i.id === item.id);
              })
              .map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
          </select>
        </div>
        <div>
          <button type="button" onClick={submitContent}>
            submit
          </button>
        </div>
      </CreateBox>
      {(parsing && <ShowBox>Parseing</ShowBox>) || (
        <ShowBox>
          <h3>{urlContent.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: urlContent.content }} />
        </ShowBox>
      )}
    </ContentCreateWrapper>
  );
}
export default ContentCreate;
const ContentCreateWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  display: flex;
  gap: 20px;
`;

const CreateBox = styled.div`
  min-width: 500px;
  display: flex;
  flex-direction: column;
  > div {
    input,
    select {
      box-sizing: border-box;
      width: 100%;
    }
    input[type='checkbox'] {
      width: initial;
    }
  }
`;

const ShowBox = styled.div`
  flex-grow: 1;
  height: calc(100vh - 120px);
  overflow: scroll;
`;
