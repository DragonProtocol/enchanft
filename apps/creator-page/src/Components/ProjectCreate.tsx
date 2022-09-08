import styled from 'styled-components';

export default function ProjectCreate() {
  return (
    <CreateBox>
      <div className="title">
        <h3>Information</h3>
      </div>
      <div></div>
      <div className="title">
        <h3>Other Setting</h3>
      </div>
      <div></div>
      <div className="btns">
        <button>Cancel</button>
        <button>Submit</button>
      </div>
    </CreateBox>
  );
}

const CreateBox = styled.div`
  margin-top: 40px;

  & .title {
    border-bottom: 1px solid #d9d9d9;

    & h3 {
      height: 40px;
      padding-bottom: 6px;
      display: inline-block;
      font-weight: 700;
      font-size: 24px;
      line-height: 40px;
      color: #333333;
      border-bottom: 4px solid #3dd606;
    }
  }

  & > div {
    margin-top: 20px;
  }
`;
