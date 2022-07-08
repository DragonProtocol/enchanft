/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-30 22:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-07 17:42:58
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
const GlobalStyle = createGlobalStyle`
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
  }
`
export default GlobalStyle
