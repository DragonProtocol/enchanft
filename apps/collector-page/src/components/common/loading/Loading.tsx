/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-02 14:36:19
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-02 18:07:25
 * @Description: file description
 */
import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'
import LoadingGif from '../imgs/loading.gif'
type LoadingProps = HTMLAttributes<HTMLImageElement> & {
  src?: string
  size?: string
}
const Loading: React.FC<LoadingProps> = ({ src, size = '3rem' }: LoadingProps) => {
  return <LoadingWrapper src={src || LoadingGif} size={size} />
}
export default Loading
const LoadingWrapper = styled.img<{ size: string }>`
  border: none;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
`
