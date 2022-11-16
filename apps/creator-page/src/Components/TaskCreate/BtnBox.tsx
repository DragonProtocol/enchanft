import styled from 'styled-components';

export default styled.div`
  display: flex;
  margin-top: 10px;
  gap: 10px;
  justify-content: end;
  & button {
    cursor: pointer;
    margin-top: 20px;
    width: 200px;

    color: #fff;
    border: none;
    height: 48px;
    font-size: 20px;
    box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;
    &.cancel {
      background: #ebeee4;
      color: #333333;
    }
    &.next-btn {
      background-color: #3dd606;
      color: #fff;
    }
  }
`;
