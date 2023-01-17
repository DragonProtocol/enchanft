import styled from 'styled-components';
import ArrowDown from '../Icons/svgs/arrow_down.svg';

export const Box = styled.div`
  & h4 {
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;
    margin-top: 0px;
    margin-bottom: 10px;
    color: #333333;
  }

  & .input-area {
    padding: 10px 20px;
    background: #ebeee4;
    border-radius: 10px;
    position: relative;
    display: flex;
    & input,
    & textarea {
      background: none;
      font-family: inherit;
      border: none;
      outline: none;
      flex-grow: 1;
      font-weight: 400;
      font-size: 18px;
      line-height: 27px;
    }
    & textarea {
      resize: none;
      height: 110px;
    }
    & span {
      position: absolute;
      right: 10px;
      bottom: 10px;
      font-weight: 400;
      font-size: 18px;
      line-height: 27px;
      color: rgba(51, 51, 51, 0.3);
    }

    & label {
      font-weight: 400;
      font-size: 18px;
      line-height: 27px;
      color: #333333;
      position: relative;
      border-right: 2px solid #f7f9f1;
      padding-right: 20px;
      &::after {
        content: ' ';
        position: absolute;
        background: #f7f9f1;
        width: 2px;
        height: 52px;
        right: -2px;
        top: -12px;
      }
    }
  }

  & button.twitter,
  & button.invite-bot {
    width: 100%;
    height: 50px;

    border-radius: 10px;
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;
    color: #ffffff;
    & svg {
      vertical-align: bottom;
      margin-right: 10px;
    }
  }
  & button.twitter {
    background: #4d93f1;
    box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
  }
  & button.invite-bot {
    background: #5368ed;
    box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
  }

  & select {
    background: #ebeee4;
    border: none;
    outline: unset;
    width: 540px;
    height: 50px;
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 400;
    font-size: 18px;
    line-height: 27px;
    color: #333333;
    -webkit-appearance: none;
    -moz-appearance: none;

    background-image: url(${ArrowDown});
    background-repeat: no-repeat;
    background-position-x: calc(100% - 20px);
    background-position-y: 19px;
  }
`;
