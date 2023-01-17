/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-07 10:41:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-12 14:26:41
 * @Description: file description
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChainType, Platform, Reward } from '../services/types/common';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { eventCreate, selectState } from '../features/event/eventCreate';
import { AsyncRequestStatus } from '../services/types';
import EventForm from '../components/event/EventForm';

function EventCreate() {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(selectState);
  const [searchParams, setSearchParams] = useSearchParams();
  const loading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  const initialValues = {
    name: '',
    description: '',
    image: '',
    platform: '' as unknown as Platform,
    project: '' as unknown as number,
    link: searchParams.get('url') || '',
    chain: ChainType.EVM,
    reward: Reward.BADGE,
    startTime: Date.now(),
    endTime: Date.now() + 48 * 60 * 60 * 1000,
    supportIframe: true,
    editorScore: 0,
    types: [],
  };
  const formHandleRef = useRef(null);
  useEffect(() => {
    if (status === AsyncRequestStatus.FULFILLED) {
      formHandleRef.current?.resetForm();
    }
  }, [status]);

  return (
    <EventForm
      initialValues={initialValues}
      loading={loading}
      onSubmit={(values) => dispatch(eventCreate(values))}
      ref={formHandleRef}
    />
  );
}
export default EventCreate;
