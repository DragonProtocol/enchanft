import styled from 'styled-components';
import { Link } from 'react-router-dom';
import multiavatar from '@multiavatar/multiavatar';
import dayjs from 'dayjs';

import { Stream } from '../types';
import { sortPubKey } from '../utils/sortPubkey';
import { TableBox } from './TableBox';
import { FamilyOrAppMapReverse } from '../constants';

export default function ListTable({
  network,
  data,
  showDid,
}: {
  network: string | undefined;
  data: Array<Stream>;
  showDid?: boolean;
}) {
  return (
    <TableBox>
      <TableContainer>
        <thead>
          <tr>
            <th>Stream ID</th>
            {showDid && <th>DiD</th>}
            <th>Family or app</th>
            <th>Tags or type</th>
            <th>Schema</th>
            <th>Indexing time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => {
            const pubkey = item.did.split(':').pop() || '';
            return (
              <tr key={item.streamId + idx}>
                <td>
                  <Link to={`/${network}/stream/${item.streamId}`}>
                    {sortPubKey(item.streamId, { len: 8, split: '-' })}
                  </Link>
                </td>
                {showDid && (
                  <td>
                    <div className="did-container">
                      <div>
                        <Avatar
                          dangerouslySetInnerHTML={{
                            __html: multiavatar(pubkey),
                          }}
                        />
                      </div>
                      <div className="user-details-container">
                        <div className="name">
                          <a href={`/${network}/profile/${item.did}`}>
                            {sortPubKey(pubkey)}
                          </a>
                        </div>
                        <div className="badge grey">{sortPubKey(pubkey)}</div>
                      </div>
                    </div>
                  </td>
                )}
                <td>
                  <div className="family-container">
                    {(item.familyOrApp && (
                      <Link to={`/${network}/family/${item.familyOrApp}`}>
                        <div className="family">
                          {FamilyOrAppMapReverse[item.familyOrApp] ||
                            item.familyOrApp}
                        </div>
                      </Link>
                    )) || <div>-</div>}
                  </div>
                </td>
                <td>
                  <div>
                    <span>-</span>
                  </div>
                </td>
                <td>
                  {(item.schema && (
                    <Link to={`/${network}/stream/${item.schema}`}>
                      {sortPubKey(item.schema, { len: 8, split: '-' })}
                    </Link>
                  )) ||
                    '-'}
                </td>
                <td>
                  <span>
                    <time>{dayjs(item.indexingTime).fromNow()}</time>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </TableContainer>
    </TableBox>
  );
}

const Avatar = styled.div`
  width: 40px;
  height: 40px;
`;

const TableContainer = styled.table`
  width: 100%;

  border-collapse: collapse;

  tbody tr,
  thead tr {
    font-size: 15px;
    text-align: center;
    height: 40px;
  }

  tbody tr {
    border-top: 1px solid #e7eaf2;
  }

  tbody td {
    padding: 10px;
  }

  .did-container {
    display: flex;
    gap: 10px;
    justify-content: center;

    & div {
      text-align: start;
    }

    .badge {
      background-color: #f1f2f3;
      border-radius: 20px;
      padding: 4px 10px;
      font-size: 13px;
      font-weight: 500;
      align-items: center;
      flex-direction: row;
      display: flex;
    }
    .grey {
      color: #79838e;
    }
  }

  & .family-container {
    text-align: center;
    .family {
      margin: 0 auto;
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;

      color: #a86ecb;

      padding: 5px 10px;

      width: fit-content;

      border: 1px solid #a86ecb;
      border-radius: 4px;
    }
  }
`;
