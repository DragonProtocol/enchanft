/*
 * @Author: shixuewen
 * @Date: 2022-03-11 18:48:03
 * @LastEditTime: 2022-08-31 11:58:01
 * @LastEditors: shixuewen friendlysxw@163.com
 * @Description: 一些全局样式
 * @FilePath: \synft-app\src\GlobalStyle.ts
 */
import { createGlobalStyle, css } from 'styled-components';

export const FontFamilyCss = css`
  font-family: 'Poppins';
  font-style: normal;
`;
export const CursorPointerCss = css`
  cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABFklEQVRYR9WXURLDIAhE6/0PbSdOtUpcd1Gnpv1KGpTHBpCE1/cXq+vrMph7dGvXZTtpfW10DCA5jrH1H0Jhs5E0hnZdCR+vb5S8Nn8mQCeS9BdSalYJqMBjAGzq59xAESN7VFVUgV8AZB/dZBR7QTFDCqGquvUBVVoEtgIwpQRzmANSFHgWQKExHdIrPeuMvQNDarXe6nC/AutgV3JW+6bgqQLeV8FekRtgV+ToDKEKnACYKsfZjjkam7a0ZpYTytwmgainpC3HvwBocgKOxqRjehoR9DFKNFYtOwCGYCszobeCbl26N6yyQ6g8X/Wex/rBPsNEV6qAMaJPMynIHQCoSqS9JSMmwef51LflTgCRszU7DvAGiV6mHWfsaVUAAAAASUVORK5CYII=')
      0 0,
    auto;
`;
export const CursorPointerUpCss = css`
  cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC')
      0 0,
    auto;
`;
export const DisabledMaskCss = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1;
  cursor: not-allowed;
`;
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Poppins';
    src:  url('/fonts/Poppins-Medium.ttf') format('truetype');
    font-style: normal;
    font-weight: normal;
    font-display: block; // 缩短字体切换闪烁时间(较长的阻塞周期)
  }
  html,body,#root {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #F7F9F1;
    margin:0;
    padding:0;
    width:100%;
    height:100vh;
    overflow:hidden;
    ${FontFamilyCss}
    ${CursorPointerCss}
  }
`;
export default GlobalStyle;
