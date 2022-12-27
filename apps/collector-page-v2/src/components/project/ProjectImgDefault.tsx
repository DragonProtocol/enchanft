/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-27 17:29:31
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-27 18:54:27
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';

const ProjectImgDefaultWrapper = styled.img`
  overflow: hidden;
  &:before {
    content: ' ';
    display: block;
    height: 100%;
    width: 100%;
    background-color: #14171a;
    border: 1px solid #39424c;
    box-sizing: border-box;
    border-radius: inherit;
  }
`;
export default function ProjectImgDefault(
  props: StyledComponentPropsWithRef<'img'>
) {
  return <ProjectImgDefaultWrapper {...props} />;
}
