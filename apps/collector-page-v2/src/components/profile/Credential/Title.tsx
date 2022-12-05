import styled from 'styled-components';

export default function Title({
  name,
  expand,
  setExpand,
  exploreAction,
}: {
  name: string;
  expand: boolean;
  setExpand: (arg0: boolean) => void;
  exploreAction: () => void;
}) {
  return (
    <TitleBox>
      <span>{name}</span>
      <div>
        <button
          type="button"
          onClick={() => {
            exploreAction();
          }}
        >
          Explore More
        </button>
        <button
          type="button"
          onClick={() => {
            setExpand(!expand);
          }}
        >
          {!expand ? '+' : '-'}
        </button>
      </div>
    </TitleBox>
  );
}

const TitleBox = styled.div`
  display: flex;
  justify-content: space-between;
`;
