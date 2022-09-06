/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-06 17:34:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-06 18:55:11
 * @Description: file description
 */
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { ButtonPrimary, ButtonProps } from '../../common/button/ButtonBase'
export enum CheckinStatusType {
  ACCOUNT_OPERATION = 'ACCOUNT_OPERATION',
  CHECKIN = 'CHECKIN',
  CHECKING = 'CHECKING',
  CHECKEDIN = 'CHECKEDIN',
  UNKNOWN = 'UNKNOWN',
}

const checkinBtnTextMap = {
  [CheckinStatusType.ACCOUNT_OPERATION]: 'Account operation',
  [CheckinStatusType.CHECKIN]: 'Get Toady’s Contribution Token !',
  [CheckinStatusType.CHECKING]: 'Loading ...',
  [CheckinStatusType.CHECKEDIN]: 'Checked In!',
  [CheckinStatusType.UNKNOWN]: 'Unknown Status',
}

export type CommunityCheckinButtonViewConfigType = {
  checkinStatusType?: CheckinStatusType
  checkinBtnText?: string
}

export type CommunityCheckinButtonHandlesType = {
  onCheckin?: () => void
  onAccountOperation?: () => void
}
export type CommunityCheckinButtonProps = ButtonProps &
  CommunityCheckinButtonViewConfigType &
  CommunityCheckinButtonHandlesType

const CommunityCheckinButton: React.FC<CommunityCheckinButtonProps> = ({
  checkinStatusType = CheckinStatusType.UNKNOWN,
  checkinBtnText,
  onCheckin,
  onAccountOperation,
  ...buttonProps
}: CommunityCheckinButtonProps) => {
  const handleCheckin = () => {
    if (onCheckin) {
      onCheckin()
    }
  }
  const handleAccountOperation = () => {
    if (onAccountOperation) {
      onAccountOperation()
    }
  }
  const _checkinBtnText = checkinBtnText || checkinBtnTextMap[checkinStatusType]
  switch (checkinStatusType) {
    case CheckinStatusType.ACCOUNT_OPERATION:
      return (
        <CheckinBtn onClick={handleAccountOperation} {...buttonProps}>
          {_checkinBtnText}
        </CheckinBtn>
      )
    case CheckinStatusType.CHECKIN:
      return (
        <CheckinBtn onClick={handleCheckin} {...buttonProps}>
          {_checkinBtnText}
        </CheckinBtn>
      )
    case CheckinStatusType.CHECKING:
    case CheckinStatusType.CHECKEDIN:
    default:
      return (
        <CheckinBtn disabled {...buttonProps}>
          {_checkinBtnText}
        </CheckinBtn>
      )
  }
}
export default CommunityCheckinButton
const CheckinBtn = styled(ButtonPrimary)`
  font-weight: 700;
  font-size: 18px;
`
