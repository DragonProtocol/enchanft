import styled from 'styled-components';

export default function ContentShower({
  title,
  author,
  upVoteNum,
  favored,
  content,
  voteAction,
  favorsActions,
  hiddenAction,
}: {
  title: string;
  author: string;
  upVoteNum: number;
  favored: boolean;
  content: string;
  voteAction: () => void;
  favorsActions: () => void;
  hiddenAction: () => void;
}) {
  return (
    <div>
      <ContentTitle>
        <div>{title}</div>
        <div>
          <div>{author}</div>
          <div>
            <span onClick={voteAction}>up {upVoteNum}</span>
            <span onClick={favorsActions}>{favored ? 'favored' : 'favor'}</span>
            <span onClick={hiddenAction}>hidden</span>
            {/* <span>share</span> */}
          </div>
        </div>
      </ContentTitle>
      <ContentBody dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

const ContentTitle = styled.div`
  border-bottom: 1px dotted gray;
  > div {
    display: flex;
    justify-content: space-between;
    &:first-child {
      font-size: 25px;
    }
    > div {
      display: flex;
      gap: 10px;
    }
  }
`;
const ContentBody = styled.div``;
