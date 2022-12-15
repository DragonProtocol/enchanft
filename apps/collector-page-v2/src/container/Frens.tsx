/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-05 15:35:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-11-30 14:58:27
 * @Description: 首页任务看板
 */
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import { TagType } from '../services/types/common';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import SearchInput from '../components/common/input/SearchInput';
import Select, { SelectOption } from '../components/common/select/Select';
import ProjectTypeSvg from '../components/common/icons/svgs/grid.svg';

import {
  getFeed,
  selectFrensHandlesState,
} from '../features/frens/frensHandles';

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');

const tagTypeOptions: Array<SelectOption> = [
  {
    value: '',
    label: 'Type',
  },
  {
    value: TagType.SOCIAL,
    label: 'social',
  },
  {
    value: TagType.TRANSACTION,
    label: 'transaction',
  },
  {
    value: TagType.EXCHANGE,
    label: 'exchange',
  },
  {
    value: TagType.COLLECTIBLE,
    label: 'collectible',
  },
  {
    value: TagType.DONATION,
    label: 'donation',
  },
  {
    value: TagType.GOVERNANCE,
    label: 'governance',
  },
];

const renderAddress = (address: string, isIcon = true) => {
  const formatAddress = `${address.substring(0, 6)}...${address.substring(
    address.length - 4
  )}`;

  return (
    <>
      <span className="address">{formatAddress}</span>
      {isIcon && (
        <svg
          width="14"
          height="15"
          viewBox="0 0 14 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          // class="cursor-pointer"
        >
          <path
            d="M8.80274 5.29972C8.1339 4.63087 7.17243 4.4165 6.07762 4.4165H5.02016C5.03446 3.54192 5.22297 3.10056 5.46316 2.86038C5.71307 2.61047 6.18076 2.4165 7.12762 2.4165H9.57762C10.5245 2.4165 10.9922 2.61047 11.2421 2.86038C11.492 3.11028 11.686 3.57798 11.686 4.52484V6.97484C11.686 7.9217 11.492 8.38939 11.2421 8.6393C11.0019 8.87948 10.5605 9.068 9.68595 9.0823V8.02484C9.68595 6.93003 9.47159 5.96856 8.80274 5.29972ZM9.68525 10.5825C10.7354 10.5686 11.6559 10.3468 12.3027 9.69996C12.9716 9.03112 13.186 8.06964 13.186 6.97484V4.52484C13.186 3.43003 12.9716 2.46856 12.3027 1.79972C11.6339 1.13087 10.6724 0.916504 9.57762 0.916504H7.12762C6.03281 0.916504 5.07134 1.13087 4.4025 1.79972C3.75566 2.44655 3.53389 3.36708 3.51999 4.41721C2.46986 4.4311 1.54934 4.65288 0.902499 5.29972C0.233655 5.96856 0.0192871 6.93003 0.0192871 8.02484V10.4748C0.0192871 11.5696 0.233655 12.5311 0.902499 13.2C1.57134 13.8688 2.53281 14.0832 3.62762 14.0832H6.07762C7.17243 14.0832 8.1339 13.8688 8.80274 13.2C9.44958 12.5531 9.67135 11.6326 9.68525 10.5825ZM4.26929 5.9165H3.62762C2.68076 5.9165 2.21307 6.11047 1.96316 6.36038C1.71325 6.61028 1.51929 7.07798 1.51929 8.02484V10.4748C1.51929 11.4217 1.71325 11.8894 1.96316 12.1393C2.21307 12.3892 2.68076 12.5832 3.62762 12.5832H6.07762C7.02448 12.5832 7.49218 12.3892 7.74208 12.1393C7.99199 11.8894 8.18595 11.4217 8.18595 10.4748V9.83317V8.02484C8.18595 7.07798 7.99199 6.61028 7.74208 6.36038C7.5078 6.12609 7.08209 5.94097 6.24961 5.91874C6.19411 5.91726 6.1368 5.9165 6.07762 5.9165H4.26929Z"
            fill="#0072FF"
          />
        </svg>
      )}
    </>
  );
};

const tagComponentsMap = {
  comment: (item) => {
    const { timestamp, owner_name: ownerName } = item || {};
    const { platform, metadata, tag } = item?.actions?.[0] || {};
    const {
      target,
      // target: { body: targetBody },
      body,
    } = metadata;
    const targetBody = target?.body;
    return (
      <>
        <div className="first-row">
          <span className="tag">{tag}</span>
          <strong>{ownerName}</strong> made a comment on{' '}
          <strong>{platform}</strong>
          {'  |  '}
          {timeAgo.format(new Date(timestamp).getTime())}
        </div>
        <div className="line-clamp-2 color-white">{body}</div>
        {targetBody && (
          <div className="target-bg">
            <div className="line-clamp-2">{targetBody}</div>
          </div>
        )}
      </>
    );
  },
  mint: (item) => {
    const {
      timestamp,
      owner_name: ownerName,
      address_to: fromAddress,
    } = item || {};
    const { metadata, tag } = item?.actions?.[0] || {};
    const {
      image,
      name,
      description,
      symbol,
      value_display: valueDisplay,
    } = metadata;
    return (
      <>
        <div className="first-row">
          <span className="tag">{tag}</span>
          <strong>{ownerName}</strong> claimed an NFT from
          <strong>{renderAddress(fromAddress, false)}</strong> for{' '}
          <strong>
            {valueDisplay} {symbol}
          </strong>
          {'  |  '}
          {timeAgo.format(new Date(timestamp).getTime())}
        </div>
        <div className="nft-box">
          {/* TODO 显示策略 + 闪光效果 */}
          {/* https://rss3.io/images/default.svg */}
          <div className="nft-media">
            {image.includes('.mp4') ? (
              <video src={image} />
            ) : (
              <img
                src={image}
                alt={name}
                onError={(e) => {
                  // console.log('---------->', e);
                  e.currentTarget.src = 'https://rss3.io/images/default.svg';
                  // e.target.src = 'https://rss3.io/images/default.svg';
                  // this.onerror=null;
                  // this.src='https://rss3.io/images/default.svg';
                }}
              />
            )}
          </div>

          <div>
            <div className="name">{name}</div>
            {description && <div className="line-clamp-2">{description}</div>}
          </div>
        </div>
      </>
    );
  },
  trade: (item) => {
    const { timestamp, owner_name: ownerName } = item || {};
    const { metadata, tag } = item?.actions?.[0] || {};
    const { image, name, description } = metadata;
    return (
      <>
        <div className="first-row">
          <span className="tag">{tag}</span>
          <strong>{ownerName}</strong> minted an NFT
          {/* <strong>{platform}</strong> */}
          {'  |  '}
          {timeAgo.format(new Date(timestamp).getTime())}
        </div>
        <div className="nft-box">
          {/* TODO 显示策略 + 闪光效果 */}
          {/* https://rss3.io/images/default.svg */}
          <div className="nft-media">
            {image.includes('.mp4') ? (
              <video src={image} />
            ) : (
              <img
                src={image}
                alt={name}
                onError={(e) => {
                  e.currentTarget.src = 'https://rss3.io/images/default.svg';
                }}
              />
            )}
          </div>

          <div>
            <div className="name">{name}</div>
            {description && <div className="line-clamp-2">{description}</div>}
          </div>
        </div>
      </>
    );
  },
  swap: (item) => {
    const { timestamp, owner_name: ownerName, platform } = item || {};
    const { metadata, tag } = item?.actions?.[0] || {};
    const { image, name, description, to, from } = metadata;
    return (
      <>
        <div className="first-row">
          <span className="tag">{tag}</span>
          <strong>{ownerName}</strong> swapped on <strong>{platform}</strong>
          {'  |  '}
          {timeAgo.format(new Date(timestamp).getTime())}
        </div>
        <div className="nft-box">
          {/* TODO 显示策略 + 闪光效果 */}
          {/* https://rss3.io/images/default.svg */}
          <div className="swap">
            <img src={from?.image} alt={from?.name} />
            <img src={to?.image} alt={to?.name} />
            {/* {image.includes('.mp4') ? (
              <video src={image} />
            ) : (
              <img
                src={image}
                alt={name}
                onError={(e) => {
                  e.currentTarget.src = 'https://rss3.io/images/default.svg';
                }}
              />
            )} */}
          </div>

          <div>
            <strong>{`${from?.value_display} ${from?.symbol} for ${to?.value_display} ${to?.symbol}`}</strong>
          </div>
        </div>
      </>
    );
  },
  transfer: (item) => {
    const { timestamp, owner_name: ownerName, platform, owner } = item || {};
    const {
      metadata,
      tag,
      address_from: formAddress,
      address_to: toAddress,
    } = item?.actions?.[0] || {};
    const { image, name, value_display: valueDisplay, symbol } = metadata;

    const isSent = formAddress === owner;
    return (
      <>
        <div className="first-row">
          <span className="tag">{tag}</span>
          <strong>{ownerName}</strong> {isSent ? 'sent to' : 'claimed from'}
          <strong>
            {renderAddress(isSent ? toAddress : formAddress, false)}
          </strong>
          {'  |  '}
          {timeAgo.format(new Date(timestamp).getTime())}
        </div>
        <div className="nft-box">
          {/* TODO 金额显示方式 */}
          {/* https://rss3.io/images/default.svg */}
          <div className="trans">
            <img src={image} alt={name} />
          </div>

          <div>
            <strong>{`${valueDisplay} ${symbol}`}</strong>
          </div>
        </div>
      </>
    );
  },
};

function Frens() {
  const [feedTab, setFeedTab] = useState<'Explore' | 'Following'>('Explore');
  const [followTab, setFollowTab] = useState<'Following' | 'Follower'>(
    'Following'
  );
  const [filterTag, setFilterTag] = useState('');
  const dispatch = useAppDispatch();

  const { feed } = useAppSelector(selectFrensHandlesState);

  const onComplete = useCallback(() => {
    dispatch(getFeed({ id: '111' }));
  }, [dispatch]);

  useEffect(() => {
    // console.log('---------->');
    dispatch(getFeed({ id: '111' }));
  }, []);
  console.log(feed, '---------->');

  return (
    <FrensWrapper>
      <FrensFeed>
        <FrensFeedSwitch>
          <div
            onClick={() => setFeedTab('Explore')}
            className={feedTab === 'Explore' ? 'active' : ''}
          >
            Explore
          </div>
          <div
            onClick={() => setFeedTab('Following')}
            className={feedTab === 'Following' ? 'active' : ''}
          >
            Following
          </div>
          <div className="tag-select">
            <Select
              options={tagTypeOptions}
              onChange={(value) => setFilterTag(value)}
              value={filterTag}
              iconUrl={ProjectTypeSvg}
            />
          </div>
        </FrensFeedSwitch>
        {feed?.result?.map((item) => {
          const { owner, tag, type, owner_name: ownerName } = item;
          return (
            <FrensFeedCard>
              <img
                className="avatar"
                src={`https://cdn.stamp.fyi/avatar/${owner}?s=300`}
                alt={owner}
              />
              <div className="content">
                <div className="owner">
                  <span className="name color-white">{ownerName}</span>{' '}
                  {renderAddress(owner)}
                </div>
                {tagComponentsMap?.[`${type}`]?.(item)}
                {/* {tagComponentsMap?.[`${tag}_${type}`]?.(item)} */}
              </div>
            </FrensFeedCard>
          );
        })}
      </FrensFeed>
      <FrensRight>
        <SearchInput onSearch={() => {}} placeholder="Search Address or ENS" />
        <div className="card">
          <FrensFeedSwitch>
            <div
              onClick={() => setFollowTab('Following')}
              className={`${
                followTab === 'Following' ? 'active' : ''
              } follow-tab`}
            >
              Following (12.4k)
            </div>
            <div
              onClick={() => setFollowTab('Follower')}
              className={`${
                followTab === 'Follower' ? 'active' : ''
              } follow-tab`}
            >
              Follower (398)
            </div>
          </FrensFeedSwitch>
        </div>
      </FrensRight>
    </FrensWrapper>
  );
}

export default React.memo(Frens);
const FrensWrapper = styled.div`
  width: 100%;
  background: #14171a;
  padding: 20px 20px 0 20px;
  box-sizing: border-box;
  color: #718096;
  display: flex;

  .card {
    background: #1b1e23;
    border-radius: 20px;
    padding: 0px 20px;
    margin-top: 30px;
    & > div {
      justify-content: space-between;
    }
  }
`;
const FrensFeed = styled.div`
  width: 100%;
  max-width: 47.5rem;
  min-width: 37.5rem;
  background: #1b1e23;
  border-radius: 20px;
  padding: 0px 20px;
  margin-right: 40px;
`;
const FrensRight = styled.div`
  flex-grow: 1;
`;
const FrensFeedSwitch = styled.div`
  display: flex;
  column-gap: 20px;
  border-bottom: 1px solid #39424c;
  position: relative;
  & > div {
    padding: 25px 0 18px 0;
    font-weight: bolder;
    cursor: pointer;
    font-size: 17px;
  }

  .active {
    color: white;
    border-bottom: 3px solid white;
    border-radius: 100px 100px 0px 0px;
  }

  .tag-select {
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    padding: 0;
  }

  .follow-tab {
    width: 50%;
    text-align: center;
    white-space: pre;
  }
`;

const FrensFeedCard = styled.div`
  display: flex;
  padding: 40px 0;
  border-bottom: 1px solid #39424c;

  .avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 20px;
  }

  .tag {
    background: #718096;
    border-radius: 4px;
    color: #14171a;
    padding: 2px 4px;
    margin-right: 10px;
    font-size: 12px;
  }

  .content {
    display: flex;
    flex-direction: column;
    /* row-gap: 0.675rem; */
    row-gap: 0.875rem;
    /* row-gap: 0.575rem; */
    font-size: 14px;
  }

  .color-white {
    color: white;
  }

  .target-bg {
    background: #14171a;
    padding: 10px 20px;
    border-radius: 10px;
    color: #718096;
    opacity: 0.8;
  }

  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    max-height: 2.5rem;
    /* white-space: pre-wrap; */
  }

  .owner {
    display: flex;
    align-items: center;
  }

  .address {
    margin-left: 10px;
    margin-right: 5px;
  }

  .name {
    font-weight: bolder;
  }

  .first-row {
    white-space: pre;
  }

  .nft-box {
    display: flex;
    align-items: center;
    column-gap: 1.25rem;

    .nft-media {
      width: 4.375rem;
      height: 4.375rem;
      video,
      img {
        object-fit: cover;
        border-radius: 0.375rem;
        width: 100%;
        height: 100%;
      }
    }

    .swap {
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 2rem;
        height: 2rem;
        object-fit: contain;
        z-index: 0;
      }
      img:last-of-type {
        margin-left: -0.5rem;
        z-index: 1;
        filter: drop-shadow(rgba(0, 0, 0, 0.25) -1px 0px 2px);
      }
    }

    .trans {
      img {
        width: 2rem;
        height: 2rem;
        object-fit: contain;
        z-index: 0;
      }
    }
  }
`;
