/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-08-29 16:47:26
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-28 02:09:10
 * @Description: file description
 */
import { useEffect, useRef } from 'react';
import {
  fetchCommunityContributionRanks,
  selectAll,
  selecteContributionRanksState,
} from '../features/community/contributionRanksSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export default (projectSlug?: string) => {
  const dispatch = useAppDispatch();
  const contributionranks = useAppSelector(selectAll);
  const contributionranksState = useAppSelector(selecteContributionRanksState);
  const fetchContributionranksIntervalRef = useRef<any>(null);
  const dispatchContributionRanks = () =>
    projectSlug && dispatch(fetchCommunityContributionRanks(projectSlug));
  useEffect(() => {
    if (projectSlug) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      dispatchContributionRanks();
      fetchContributionranksIntervalRef.current = setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        dispatchContributionRanks();
      }, 60 * 1000);
    } else {
      clearInterval(fetchContributionranksIntervalRef.current);
    }
    return () => {
      clearInterval(fetchContributionranksIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectSlug]);

  return { contributionranks, contributionranksState };
};
