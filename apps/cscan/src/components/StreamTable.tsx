import styled from 'styled-components';
import multiavatar from '@multiavatar/multiavatar';
import dayjs from 'dayjs';

import { Network, Stream } from '../types';
import { FamilyOrAppMapReverse } from '../constants';
import { TableBox } from './TableBox';
import { useMemo } from 'react';
import { sortPubKey } from '../utils/sortPubkey';
import { Link } from 'react-router-dom';

export default function StreamTable({
  data,
  network,
}: {
  data: Stream;
  network: Network;
}) {
  const pubkey = useMemo(() => {
    return data.did.split(':').pop() || '';
  }, [data.did]);

  return (
    <TableBox>
      <TableContainer>
        <div>
          <span>Stream ID:</span>
          <div>
            <Link to={`/${network}/stream/${data.streamId}`}>
              {data.streamId}
            </Link>
          </div>
        </div>
        <div className="network">
          <span>Network:</span>
          <div>{network}</div>
        </div>
        <div>
          <span>indexing time:</span>
          <div>{dayjs(data.indexingTime).fromNow()}</div>
        </div>
        <div>
          <span>Family or App:</span>
          <div>
            {(data.familyOrApp && (
              <Link to={`/${network}/family/${data.familyOrApp}`}>
                <div className="family">
                  {FamilyOrAppMapReverse[data.familyOrApp] || data.familyOrApp}
                </div>
              </Link>
            )) || <div>-</div>}
          </div>
        </div>
        <div>
          <span>Type:</span>
          <div>{data.type}</div>
        </div>
        <div className="from">
          <span>From:</span>
          <div>
            <Link to={`/${network}/profile/${data.did}`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: multiavatar(pubkey),
                }}
              />
              {sortPubKey(pubkey)}
            </Link>
          </div>
        </div>
        <div>
          <span>Tag:</span>
          <div>{data.tags.join(' ').trim() || '-'}</div>
        </div>
        <div>
          <span>Status:</span>
          <div>{data.anchorStatus}</div>
        </div>
        {/* <div>
          <span>Hash:</span>
          <div>...</div>
        </div> */}
        {/* <div>
          <span>Date:</span>
          <div>...</div>
        </div> */}
        <div>
          <span>Schema:</span>
          <div>
            {(data.schema && (
              <a href={`/${network}/stream/${data.schema}`}>{data.schema}</a>
            )) ||
              '-'}
          </div>
        </div>
        <div>
          <span>Commit IDs:</span>
          <div>{data.commitIds.join('\n')}</div>
        </div>
        <div className="content">
          <span>Content:</span>
          <div>
            <pre>
              <code>{JSON.stringify(data.content, null, 2)}</code>
            </pre>
          </div>
        </div>
        <div className="metadata">
          <span>Metadata:</span>
          <div>
            <pre>
              <code>{JSON.stringify(data.metadata, null, 2)}</code>
            </pre>
          </div>
        </div>
      </TableContainer>
    </TableBox>
  );
}

const TableContainer = styled.div`
  margin: 10px;
  > div {
    display: flex;
    padding: 20px 0;
    border-bottom: 1px solid #e7eaf2;
    &:first-child {
      padding-top: 15px;
    }
    &:last-child {
      border-bottom: none;
      padding-bottom: 15px;
    }

    > span {
      width: 200px;
      min-width: 200px;
      font-weight: 500;
    }

    > div {
      flex-grow: 1;
    }

    &.content,
    &.metadata {
      & div {
        overflow: scroll;
      }
    }
  }

  & .from {
    & > div > a {
      display: flex;
      align-items: center;
      gap: 10px;
      width: fit-content;
      > div {
        width: 50px;
      }
    }
  }

  & .network {
    > div {
      text-transform: capitalize;
    }
  }
`;
