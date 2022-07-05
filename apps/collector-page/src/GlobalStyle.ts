/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-30 22:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-30 22:56:40
 * @Description: 全局样式
 */
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  html,body,#root {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #E5E5E5;
    margin:0;
    padding:0;
    width:100vw;
    height:100vh;
    box-sizing: border-box;
  }
`
export default GlobalStyle
