import React from 'react'
import styled from 'styled-components'

type MainContentBoxProps = {
  children: any
}
const MainContentBox: React.FC<MainContentBoxProps> = ({ children }) => {
  return <MainContentBoxWrapper>{children}</MainContentBoxWrapper>
}
export default MainContentBox
const MainContentBoxWrapper = styled.div`
  width: 100%;
  padding: 0 48px;
  box-sizing: border-box;
  margin: 48px 0;
`
