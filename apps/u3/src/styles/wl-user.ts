/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-17 10:56:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-17 16:12:26
 * @Description: file description
 */
import { css } from 'styled-components';
import { ButtonBaseCss } from '../components/common/button/ButtonBase';

const wlUserbuttonBase = css`
  ${ButtonBaseCss}
  background-color: #ffffff;
  color: #14171a;
  &:disabled {
    cursor: not-allowed;
    pointer-events: auto;
    opacity: 0.5;
  }
`;
const wlUserbuttonBaseLine = css`
  ${wlUserbuttonBase}
  border: 1px solid #39424c;
  background-color: #1a1e23;
  color: #718096;
`;
const wlUserInputBase = css`
  width: 100%;
  height: 48px;
  font-weight: 400;
  font-size: 16px;
  color: #fff;
  outline: none;
  display: flex;
  align-items: center;
  padding: 0px 12px;
  box-sizing: border-box;
  background: #1a1e23;
  border: 1px solid #39424c !important;
  border-radius: 12px;
  gap: 10px;
  &:focus-within {
    border-color: #555;
  }

  &::placeholder {
    color: #4e5a6e;
  }
`;
export const wlUserLayout = css``;
export const wlUserTheme = css`
  .wl-user-button-base {
    box-shadow: none;
  }
  .wl-user-input-base {
    ${wlUserInputBase}
  }
  .wl-user-modal > div {
    width: 380px;
    background: #1b1e23;
    box-sizing: border-box;
  }
  .wl-user-modal-base-title {
    font-style: italic;
    color: #ffffff;
  }
  // signature modal
  .wl-user-modal_signature {
    .signature-btns {
      .signature-btn-cancel {
        flex: 1;
        ${wlUserbuttonBaseLine}
      }
      .signature-btn-retry {
        flex: 1;
        ${wlUserbuttonBase}
      }
    }
  }
  // email signature modal
  .wl-user-modal_email-signature {
    .wl-user-modal_email-signature-cancel {
      flex: 1;
      ${wlUserbuttonBaseLine}
    }
    .wl-user-modal_email-signature-confirm {
      flex: 1;
      ${wlUserbuttonBase}
    }
  }
  // email unbind modal
  .wl-user-modal_unbind-confirm {
    .unbind-confirm-btn-cancel {
      flex: 1;
      ${wlUserbuttonBaseLine}
    }
    .unbind-confirm-btn-submit {
      flex: 1;
      ${wlUserbuttonBase}
    }
  }
  .signature-desc,
  .wl-user-modal_email-signature-desc,
  .unbind-confirm-desc {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #ffffff;
    opacity: 0.8;
  }
  // edit profile modal
  .wl-user-modal_edit-profile {
    .edit-profile-form {
      .form-field-avatar,
      .form-field-avatar img {
        width: 120px;
        height: 120px;
      }
      .form-field-name {
        margin-top: 0px;
        .form-field-label {
          display: none;
        }
        .form-field-name-input {
          ${wlUserInputBase}
        }
      }
    }
    .edit-profile-btns {
      .btn-cancel {
        flex: 1;
        ${wlUserbuttonBaseLine}
      }
      .btn-save {
        flex: 1;
        ${wlUserbuttonBase}
      }
    }
  }
`;
