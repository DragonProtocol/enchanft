import React, { useEffect } from 'react'
import { useRoutes, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Home from '../container/Home'
import Info from '../container/Info'
import { backToTop } from '../utils/tools'

const Main: React.FC = () => {
  const location = useLocation()
  const routes = useRoutes([
    { path: '/', element: <Home /> },
    { path: '/info/:mint', element: <Info /> },
    { path: '*', element: <div>404</div> },
  ])
  useEffect(() => {
    backToTop()
  }, [location])
  return <MainWrapper>{routes}</MainWrapper>
}
export default Main
const MainWrapper = styled.div``
