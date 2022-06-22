/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-06-21 10:42:05
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-06-21 17:42:06
 * @FilePath: \synft-app\src\components\Main.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect } from 'react'
import { useRoutes, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import About from '../container/About'
import Launchpad from '../container/Launchpad'
import MyEnchaNFT from '../container/MyEnchaNFT'
import Info from '../container/Info'
import { backToTop } from '../utils/tools'

const Main: React.FC = () => {
  const location = useLocation()
  const routes = useRoutes([
    { path: '/', element: <About /> },
    { path: '/launchpad', element: <Launchpad /> },
    { path: '/myenchanft', element: <MyEnchaNFT /> },
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
