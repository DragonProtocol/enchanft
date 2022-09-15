import styled from 'styled-components';
import { Box } from './ItemBox';

export default function Desc({
  desc,
  setDesc,
  title = 'Project Description',
}: {
  desc: string;
  setDesc: (arg0: string) => void;
  title?: string;
}) {
  return (
    <ContentBox>
      <div>
        <h4>{title}</h4>
        <span>({desc.length}/250)</span>
      </div>
      <div className="input-area">
        <textarea
          title="desc"
          name=""
          id=""
          placeholder="Input"
          value={desc}
          onChange={(e) => {
            if (e.target.value.length > 250) return;
            setDesc(e.target.value);
          }}
        />
      </div>
    </ContentBox>
  );
}

const ContentBox = styled(Box)`
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
