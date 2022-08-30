/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-29 16:47:26
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-30 11:18:01
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

export default (communityId?: number, slug?: string) => {
  const { token } = useAppSelector(selectAccount)
  const dispatch = useAppDispatch()
  const { verifyCheckin: verifyCheckinState, checkin: checkinState } = useAppSelector(selectUserCommunityHandlesState)

  const handleCheckin = useCallback(() => token && communityId && dispatch(checkin(communityId)), [token, communityId])
  const userCheckinCommunityIds = useAppSelector(selectIds)
  const isVerifiedCheckin = verifyCheckinState.status === AsyncRequestStatus.FULFILLED
  const isCheckedin = !!communityId && userCheckinCommunityIds.includes(communityId)

  // verify check in
  useEffect(() => {
    if (token && communityId && !isCheckedin && verifyCheckinState.status === AsyncRequestStatus.IDLE) {
      dispatch(verifyCheckin({ communityId, slug }))
    }
  }, [token, communityId, isCheckedin, verifyCheckinState.status])

  // empty check in
  useEffect(() => {
    if (!token) {
      dispatch(removeAll)
    }
  }, [token])

  // reset verify in
  useEffect(() => {
    return () => {
      dispatch(resetVerifyCheckin())
    }
  }, [])

  return { isVerifiedCheckin, isCheckedin, handleCheckin, checkinState }
}
