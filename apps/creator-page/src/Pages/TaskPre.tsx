import { useMemo, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';

import { selectProjectDetail } from '../redux/projectSlice';
import { useAppSelector } from '../redux/store';

type Tab = 'Future' | 'Live' | 'Closed';

export function TaskPre() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [tab, setTab] = useState<Tab>('Future');
  const { data: project } = useAppSelector(selectProjectDetail);

  const list = useMemo(() => {
    if (!project) return [];
    const { tasks } = project;
    const dateNow = Date.now();
    if (tab === 'Future') {
      return tasks.filter((item) => item.startTime >= dateNow);
    }
    if (tab === 'Live') {
      return tasks.filter(
        (item) => item.startTime < dateNow && item.endTime > dateNow
      );
    }
    if (tab === 'Closed') {
      return tasks.filter((item) => item.endTime <= dateNow);
    }
    return [];
  }, [project, tab]);

  return (
    <ContentBox>
      <div className="tab-header">
        <div className="tab">
          {['Future', 'Live', 'Closed'].map((item, idx) => {
            return (
              <span
                key={item}
                className={tab === item ? 'active' : ''}
                onClick={() => setTab(item as Tab)}
              >
                {item}
              </span>
            );
          })}
        </div>
        <button
          onClick={() => {
            navigate(`/project/${slug}/task/new`);
          }}
        >
          + New Task
        </button>
      </div>
      <div className="table">
        <div className="title item">
          <span>Title</span>
          <span>Method</span>
          <span>Date</span>
          <span>Reward</span>
        </div>
        {list.map((item, idx) => {
          const { reward } = item;
          return (
            <div key={idx} className="content item">
              <span>
                <NavLink to={`/project/${slug}/task/${item.id}`}>
                  {item.name}
                </NavLink>
              </span>
              <span>{reward && reward.raffled ? 'Raffles' : 'FCFS'}</span>
              <span>
                {dayjs(item.startTime).format('YYYY/MM/DD HH:mm')} —{' '}
                {dayjs(item.endTime).format('YYYY/MM/DD HH:mm')}
              </span>
              <span>
                {reward && reward.type.toLowerCase().replace('_', ' ')}
              </span>
            </div>
          );
        })}
      </div>
    </ContentBox>
  );
}

const ContentBox = styled.div`
  padding: 40px;
  background: #f7f9f1;
  border: 4px solid #333333;

  & .tab-header {
    display: flex;
    justify-content: space-between;

    & .tab {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      width: 400px;
      height: 48px;

      border: 2px solid #333333;
      border-radius: 10px;
      overflow: hidden;

      & span {
        display: inline-block;
        border-left: 2px solid #333333;
        text-align: center;
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
        color: #333333;
        padding-top: 10px;
        cursor: pointer;
        &:first-child {
          border: none;
        }
        &.active {
          color: #ffffff;
          background: #333333;
        }
      }
    }

    & button {
      width: 180px;
      height: 48px;

      background: #3dd606;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: #ffffff;
    }
  }

  & .table {
    margin-top: 20px;
    padding: 5px 20px;
    gap: 20px;

    background: #ebeee4;
    border-radius: 10px;

    & .item {
      display: flex;
      gap: 50px;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      border-top: 1px solid #d9d9d9;

      min-width: 200px;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      color: #333333;

      & a {
        text-decoration: none;
        color: inherit;
      }

      &:first-child {
        border: none;
      }

      &.title {
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        color: rgba(51, 51, 51, 0.6);
      }
      &.content {
        & span {
          &:first-child {
            font-weight: 700;
          }
        }
      }
      & span {
        min-width: 200px;
        &:nth-child(3) {
          flex-grow: 1;
        }
      }
    }
  }
`;
