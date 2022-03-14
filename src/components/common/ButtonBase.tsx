import styled from 'styled-components'
import { CursorPointerUpCss, FontFamilyCss } from '../../GlobalStyle'
const ButtonBase: React.FC = ({ children, ...otherProps }) => {
  return <ButtonBaseWrapper {...otherProps}>{children}</ButtonBaseWrapper>
}
export default ButtonBase
const ButtonBaseWrapper = styled.button`
  width: 216px;
  height: 48px;
  text-align: center;
  line-height: 48px;
  background: #ebb700;
  box-shadow: inset 0px 4px 0px rgba(255, 255, 255, 0.25), inset 0px -4px 0px rgba(0, 0, 0, 0.25);
  font-size: 12px;
  color: #ffffff;
  ${FontFamilyCss}
  ${CursorPointerUpCss}
`
