/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-02 14:36:19
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-02 14:41:42
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import LoadingGif from '../imgs/loading.gif'
type LoadingProps = HTMLAttributes<HTMLImageElement> & {
  src?: string
}
const Loading: React.FC<LoadingProps> = ({ src }: LoadingProps) => {
  return <LoadingWrapper src={src || LoadingGif} />
}
export default Loading
const LoadingWrapper = styled.img``
