import { createGlobalStyle } from 'styled-components'
const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family:'PressStart2P-Regular';
    src:url('/fonts/PressStart2P-Regular.ttf');
    font-style: normal;
    font-weight: normal;
    font-display: fallback; /* <- this can be added to each @font-face definition */
  }
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
    font-family:'PressStart2P-Regular'
  }
  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`
export default GlobalStyle
