/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-22 10:50:29
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-22 11:49:23
 * @Description: file description
 */
import React from 'react'
import styled from 'styled-components'
import { createReturn } from 'typescript'
import { ButtonPrimary } from './components/common/button/ButtonBase'
import CardBox from './components/common/card/CardBox'
import PcPng from './components/imgs/pc.png'
import { WL_INFO_URL } from './constants'
import GlobalStyle from './GlobalStyle'
export default function () {
  const redirectToInfo = React.useCallback(() => {
    window.location.href = WL_INFO_URL
  }, [])
  const [count, setCount] = React.useState(5)
  const timer = React.useRef<any>(null)
  React.useEffect(() => {
    if (count === 0) {
      redirectToInfo()
    }
    timer.current = setInterval(() => {
      setCount(count - 1)
    }, 1000)
    return () => {
      clearInterval(timer.current)
    }
  }, [count])

  return (
    <>
      <GlobalStyle />
      <MobileRedirectWrapper>
        <MobileRedirecCard>
          <PcImg src={PcPng} />
          <Title>PLEASE USE THE APP ON PC</Title>
          <RedirectDescBox>
            Redirect to Homepage after <RedirectTime>{count}</RedirectTime> Seconds
          </RedirectDescBox>
          <RedirectBtn onClick={redirectToInfo}>About WL</RedirectBtn>
        </MobileRedirecCard>
      </MobileRedirectWrapper>
    </>
  )
}
const MobileRedirectWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  position: relative;
`
const MobileRedirecCard = styled(CardBox)`
  position: absolute;
  width: 335px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background: #f7f9f1;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const PcImg = styled.img`
  width: 80px;
  height: 80px;
`
const Title = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 30px;
  text-align: center;
  color: #333333;
  margin-top: 20px;
`
const RedirectDescBox = styled.div`
  font-size: 14px;
  line-height: 21px;
  text-align: center;
  color: #333333;
  margin-top: 10px;
`
const RedirectTime = styled.span`
  font-weight: 700;
`
const RedirectBtn = styled(ButtonPrimary)`
  width: 200px;
  margin-top: 20px;
  font-weight: 700;
  font-size: 18px;
  color: #ffffff;
`
