/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-17 10:56:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-17 16:12:26
 * @Description: file description
 */
import { css } from 'styled-components';

const modal = css`
  .Us3r-Modal__overlay {
    background-color: rgba(0, 0, 0, 0.8);
  }
  .Us3r-Modal__content {
    min-width: 380px;
    border-radius: 20px;
    background: #1b1e23;
    padding: 20px;
  }
  .Us3r-Modal__header {
    height: 28px;
    .Us3r-Modal__title {
      font-style: italic;
      font-weight: 700;
      font-size: 24px;
      line-height: 28px;
      color: #ffffff;
    }
    .Us3r-Modal__close {
      color: #718096;
      font-size: 20px;
    }
  }
  .Us3r-Modal__body {
    margin-top: 20px;
  }
`;

const loginBtn = css`
  .us3r-LoginModal__options {
    gap: 20px;
  }
  .us3r-LoginModal__option {
    height: 80px;
    border-radius: 12px;
    padding: 20px;
    gap: 10px;

    .us3r-LoginWithAuthorizerButton__icon {
      width: 32px;
      height: 32px;
    }

    .us3r-LoginWithAuthorizerButton__name {
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      text-align: center;
      color: #ffffff;
    }
    .us3r-LoginWithAuthorizerButton__last {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      /* identical to box height */

      text-align: center;

      color: rgba(255, 255, 255, 0.5);
    }
  }
`;

export const us3rAuthkitCss = css`
  ${modal}
  ${loginBtn}
`;
