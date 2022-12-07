import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { contentParse } from '../services/api/contents';

function ContentCreate() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [urlContent, setUrlContent] = useState({
    title: '',
    content: '',
  });
  const [parsing, setParsing] = useState(false);
  const loadUrlContent = useCallback(async () => {
    setParsing(true);
    const { data } = await contentParse(originalUrl);

    setUrlContent({
      title: data.data.title,
      content: data.data.content,
    });
    setParsing(false);
  }, [originalUrl]);

  useEffect(() => {}, []);

  return (
    <ContentCreateWrapper>
      <CreateBox>
        <div>
          <div>Title</div>
          <input title="title" type="text" />
        </div>
        <div>
          <div>Author</div>
          <input title="author" type="text" />
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
          <input title="content-type" type="text" />
        </div>
        <div>Projects</div>
        <div>
          <button type="button">submit</button>
        </div>
      </CreateBox>
      {(parsing && <ShowBox>Parseing</ShowBox>) || (
        <ShowBox dangerouslySetInnerHTML={{ __html: urlContent.content }} />
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
    input {
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
