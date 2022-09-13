import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export function EditTitle({
  title,
  save,
}: {
  title: string;
  save: () => void;
}) {
  const navigate = useNavigate();
  return (
    <>
      <div className="title">
        <h3>{title}</h3>
        <div className="btns">
          <button className="cancel" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button className="save" onClick={save}>
            Save
          </button>
        </div>
      </div>
      <hr />
    </>
  );
}

export const EditBox = styled.div`
  border-radius: inherit;
  padding: 40px;
  background: #f7f9f1;
  border: 4px solid #333333;

  & .title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & .btns {
      display: inline-flex;
      gap: 20px;
      & button {
        padding: 10px 18px;
        border-radius: 10px;
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
      }
      & button.cancel {
        background: #ebeee4;
        box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
        color: #333333;
      }

      & button.save {
        background: #3dd606;
        box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
        color: #ffffff;
      }
    }
  }

  & hr {
    border-color: #d9d9d9;
  }

  & .info {
    display: flex;
    gap: 40px;
    margin-top: 40px;
    & > div {
      box-sizing: border-box;
      width: 540px;
    }

    & div.left,
    & div.right {
      display: flex;
      gap: 40px;
      flex-direction: column;
    }
  }
`;
