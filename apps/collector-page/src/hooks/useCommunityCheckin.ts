/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-29 16:47:26
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-29 19:16:40
 * @Description: file description
 */
import { useCallback, useEffect } from 'react'
import { selectAccount } from '../features/user/accountSlice'
import { removeAll, selectIds } from '../features/user/checkinCommunitiesSlice'
import {
  checkin,
  resetVerifyCheckin,
  selectUserCommunityHandlesState,
  verifyCheckin,
} from '../features/user/communityHandlesSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { AsyncRequestStatus } from '../types'

export default (communityId: number | undefined) => {
  const { token } = useAppSelector(selectAccount)
  const dispatch = useAppDispatch()
  const { verifyCheckin: verifyCheckinState, checkin: checkinState } = useAppSelector(selectUserCommunityHandlesState)

  const handleCheckin = useCallback(() => token && communityId && dispatch(checkin(communityId)), [token, communityId])
  const userCheckinCommunityIds = useAppSelector(selectIds)
  const isVerifiedCheckin = verifyCheckinState.status === AsyncRequestStatus.FULFILLED
  const isCheckin = !!communityId && userCheckinCommunityIds.includes(communityId)

  // verify check in
  useEffect(() => {
    if (token && communityId && !isCheckin && verifyCheckinState.status === AsyncRequestStatus.IDLE) {
      dispatch(verifyCheckin(communityId))
    }
  }, [token, communityId, isCheckin, verifyCheckinState.status])

  // empty check in
  useEffect(() => {
    if (!token) {
      dispatch(removeAll)
    }
  }, [token])

  // reset verify in
  useEffect(() => {
    dispatch(resetVerifyCheckin())
    return () => {
      dispatch(resetVerifyCheckin())
    }
  }, [communityId])

  return { isVerifiedCheckin, isCheckin, handleCheckin, checkinState }
}
