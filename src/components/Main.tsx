import React from 'react'
import { useRoutes } from 'react-router-dom'
import styled from 'styled-components'
import Home from '../container/Home'
import Info from '../container/Info'
const Main: React.FC = () => {
  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/info/:mint/:address', element: <Info /> },
  ])
  return <MainWrapper>{routes}</MainWrapper>
}
export default Main
const MainWrapper = styled.div`
`
