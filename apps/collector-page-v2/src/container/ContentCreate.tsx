import { useWlUserReact } from '@ecnft/wl-user-react';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { contentParse, saveContent } from '../services/api/contents';
import { ContentType } from '../services/types/contents';

function ContentCreate() {
  const { user } = useWlUserReact();
  const [parsing, setParsing] = useState(false);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [type, setType] = useState(ContentType.NEWS);

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
    await saveContent(
      {
        title,
        author,
        url: originalUrl,
        types: type,
        uniProjectId: 1,
      },
      user.token
    );
  }, [user.token, title, author, originalUrl, type]);

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
        <div>Projects</div>
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
  }
`;

const ShowBox = styled.div`
  flex-grow: 1;
  height: calc(100vh - 120px);
  overflow: scroll;
`;
