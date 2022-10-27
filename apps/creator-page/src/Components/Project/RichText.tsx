import styled from 'styled-components';
import RichText from '../RichText';

export default function Desc({
  desc,
  setDesc,
  title = 'Project Description',
}: {
  desc: string;
  setDesc: (arg0: string) => void;
  title?: string;
}) {
  console.log({ desc });
  return (
    <ContentBox>
      <div>
        <h4>{title}</h4>
        {/* <span>({desc.length}/250)</span> */}
      </div>
      <div className="input-area">
        <RichText text={desc} setText={setDesc} />
      </div>
    </ContentBox>
  );
}

const ContentBox = styled.div`
  > div {
    &:first-child {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      gap: 10px;
      & h4 {
        margin: 0;
      }
    }
  }
`;
