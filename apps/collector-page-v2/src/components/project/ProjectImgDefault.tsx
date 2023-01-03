/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-27 17:29:31
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-28 11:09:31
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';

const ProjectImgDefaultWrapper = styled.img`
  overflow: hidden;
  position: relative;
  &:before {
    content: ' ';
    display: block;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, #cd62ff 35.31%, #62aaff 89.64%);
    border-radius: inherit;
    padding: 2px;
    box-sizing: border-box;
  }
  &:after {
    content: '';
    width: calc(100% - 4px);
    height: calc(100% - 4px);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: inherit;
    background: #000;
  }
`;
export default function ProjectImgDefault(
  props: StyledComponentPropsWithRef<'img'>
) {
  return <ProjectImgDefaultWrapper {...props} />;
}
