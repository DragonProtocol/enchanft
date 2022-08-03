/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-30 22:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-03 13:00:17
 * @Description: 全局样式
 */
import { createGlobalStyle, css } from 'styled-components'

export const ScrollBarCss = css`
  /* 设置滚动条的样式 */
  ::-webkit-scrollbar {
    width: 3px;
  }
  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: rgba(0, 0, 0, 0.3);
    box-shadow: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(17, 16, 16, 0.13);
    -webkit-box-shadow: rgba(0, 0, 0, 0.9);
    box-shadow: rgba(0, 0, 0, 0.5);
  }
  ::-webkit-scrollbar-thumb:window-inactive {
    background: #ccc;
  }
`

export const FontFamilyCss = css`
  font-family: 'Poppins-Regular';
  /* font-family: 'PressStart2P-Regular'; */
`
export const CursorPointerCss = css`
  /* cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABFklEQVRYR9WXURLDIAhE6/0PbSdOtUpcd1Gnpv1KGpTHBpCE1/cXq+vrMph7dGvXZTtpfW10DCA5jrH1H0Jhs5E0hnZdCR+vb5S8Nn8mQCeS9BdSalYJqMBjAGzq59xAESN7VFVUgV8AZB/dZBR7QTFDCqGquvUBVVoEtgIwpQRzmANSFHgWQKExHdIrPeuMvQNDarXe6nC/AutgV3JW+6bgqQLeV8FekRtgV+ToDKEKnACYKsfZjjkam7a0ZpYTytwmgainpC3HvwBocgKOxqRjehoR9DFKNFYtOwCGYCszobeCbl26N6yyQ6g8X/Wex/rBPsNEV6qAMaJPMynIHQCoSqS9JSMmwef51LflTgCRszU7DvAGiV6mHWfsaVUAAAAASUVORK5CYII=')
      0 0,
    auto; */
  cursor: pointer;
`
export const CursorPointerUpCss = css`
  /* cursor: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAzElEQVRYR+2X0Q6AIAhF5f8/2jYXZkwEjNSVvVUjDpcrGgT7FUkI2D9xRfQETwNIiWO85wfINfQUEyxBG2ArsLwC0jioGt5zFcwF4OYDPi/mBYKm4t0U8ATgRm3ThFoAqkhNgWkA0jJLvaOVSs7j3qMnSgXWBMiWPXe94QqMBMBc1VZIvaTu5u5pQewq0EqNZvIEMCmxAawK0DNkay9QmfFNAJUXfgGgUkLaE7j/h8fnASkxHTz0DGIBMCnBeeM7AArpUd3mz2x3C7wADglA8BcWMZhZAAAAAElFTkSuQmCC')
    0 0; */
  cursor: pointer;
`
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Poppins-Regular';
    src: url('/fonts/Poppins-Regular.ttf') format('truetype');
    font-style: normal;
    font-weight: normal;
    font-display: block; // 缩短字体切换闪烁时间(较长的阻塞周期)
  }
  /* @font-face {
    font-family: 'PressStart2P-Regular';
    src: url('/fonts/PressStart2P-Regular.ttf') format('truetype');
    font-style: normal;
    font-weight: normal;
    font-display: block; // 缩短字体切换闪烁时间(较长的阻塞周期)
  } */
  html,body,#root {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #E5E5E5;
    margin:0;
    padding:0;
    width:100%;
    height:100vh;
    box-sizing: border-box;
    ${FontFamilyCss}
  }
`
export default GlobalStyle
