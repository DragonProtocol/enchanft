/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-10-27 15:55:36
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-29 10:53:35
 * @Description: file description
 */
import React from 'react';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { GradeType } from '../../../types/entities';
import IconOfficialCertification from '../../common/icons/IconOfficialCertification';
import IconVIP from '../../common/icons/IconVIP';

export const gradeStyleMap = {
  [GradeType.OFFICIAL]: {
    icon: IconOfficialCertification,
    bgc: '#43FF00',
  },
  [GradeType.VIP]: {
    icon: IconVIP,
    bgc: '#FFF500',
  },
};
type ProjectGradeTagProps = StyledComponentPropsWithRef<'div'> & {
  grade: GradeType;
  size?: number;
};
const ProjectGradeTag: React.FC<ProjectGradeTagProps> = ({
  grade,
  size = 1,
  ...otherProps
}: ProjectGradeTagProps) => {
  const gradeStyle = gradeStyleMap[grade];
  if (!gradeStyle) return null;

  return (
    <ProjectGradeTagWrapper bgc={gradeStyle.bgc} {...otherProps}>
      <gradeStyle.icon />
    </ProjectGradeTagWrapper>
  );
};
export default ProjectGradeTag;
const ProjectGradeTagWrapper = styled.div<{ bgc: string }>`
  position: absolute;
  top: 0;
  right: 0;
  overflow: hidden;
  padding: 0px 4px;
  border-left: 2px solid #333333;
  border-bottom: 2px solid #333333;
  border-radius: 0px 0px 0px 10px;
  background: ${(props) => props.bgc};
  height: 22px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
`;
