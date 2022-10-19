/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-29 16:47:26
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-19 18:41:33
 * @Description: file description
 */
import { useCallback, useEffect, useState } from 'react'
import { selectIds as selectIdsForFollowedCommunities } from '../features/user/followedCommunitiesSlice'
import { removeAll, selectById, selectIds } from '../features/user/checkinCommunitiesSlice'
import {
  follow,
  checkin,
  resetVerifyCheckin,
  verifyCheckin,
  selectUserCommunityHandlesState,
} from '../features/user/communityHandlesSlice'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { AsyncRequestStatus } from '../types'
import { useWlUserReact } from '../../../../libs/wl-user-react/core/src'

export default (communityId?: number, slug?: string) => {
  const { isLogin } = useWlUserReact()

  const dispatch = useAppDispatch()
  const handlesState = useAppSelector(selectUserCommunityHandlesState)
  const { follow: followState, verifyCheckin: verifyCheckinState, checkin: checkinState } = handlesState

  /*** follow community*/
  const userFollowedCommunityIds = useAppSelector(selectIdsForFollowedCommunities)
  const isFollowed = !!communityId && userFollowedCommunityIds.includes(communityId)
  const handleFollow = useCallback(() => {
    if (isLogin && communityId) {
      dispatch(follow({ id: communityId }))
    }
  }, [isLogin, communityId])

  /*** checkin community */
  const userCheckinCommunityIds = useAppSelector(selectIds)
  const isCheckedin = !!communityId && userCheckinCommunityIds.includes(communityId)
  const isVerifiedCheckin = verifyCheckinState.status === AsyncRequestStatus.FULFILLED
  const userCheckedinCommunityData = useAppSelector((state) => selectById(state, communityId || -1))
  const checkinData = {
    contribution: userCheckedinCommunityData?.contribution || 0,
    seqDays: userCheckedinCommunityData?.seqDays || 0,
  }
  const handleCheckin = useCallback(
    () => isLogin && communityId && dispatch(checkin({ communityId, slug })),
    [isLogin, communityId, slug],
  )

  // verify check in
  useEffect(() => {
    if (isLogin && communityId && isFollowed && !isCheckedin && verifyCheckinState.status === AsyncRequestStatus.IDLE) {
      dispatch(verifyCheckin(communityId))
    }
  }, [isLogin, communityId, isFollowed, isCheckedin, verifyCheckinState.status])

  // empty check in
  useEffect(() => {
    if (!isLogin) {
      dispatch(removeAll)
    }
  }, [isLogin])

  // reset verify in
  useEffect(() => {
    return () => {
      dispatch(resetVerifyCheckin())
    }
  }, [communityId])

  return { handlesState, isFollowed, handleFollow, isCheckedin, isVerifiedCheckin, handleCheckin, checkinData }
}
