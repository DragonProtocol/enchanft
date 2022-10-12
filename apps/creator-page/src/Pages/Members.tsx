import { useCallback, useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  creatorMembers,
  creatorMembersDownload,
  creatorMembersInsert,
  creatorMembersWithFilter,
  MemberFilter,
} from '../api';
import { useAppConfig } from '../AppProvider';
import AddMemberModal from '../Components/AddMemberModal';
import IconCheckbox from '../Components/Icons/IconCheckbox';
import IconCheckboxChecked from '../Components/Icons/IconCheckboxChecked';
import IconDownload from '../Components/Icons/IconDownload';
import IconInputSearch from '../Components/Icons/IconInputSearch';
import IconRandom from '../Components/Icons/IconRandom';
import { selectProjectDetail } from '../redux/projectSlice';
import { useAppSelector } from '../redux/store';
import { CoinType } from '../utils/token';
import Pagination from '../Components/Pagination';

import data from './mock-data.json';

let PageSize = 20;

const columns = [
  {
    name: 'NAME',
    selector: (row: any) => row.title,
  },
  {
    name: 'TWITTER',
    selector: (row: any) => row.title,
  },
  {
    name: 'TWITTER ID',
    selector: (row: any) => row.title,
  },
  {
    name: 'DISCORD',
    selector: (row: any) => row.title,
  },
  {
    name: 'DISCORD ID',
    selector: (row: any) => row.year,
    // sortable: true,
  },
  {
    name: 'ETH ADDRESS',
    selector: (row: any) => row.year,
    // sortable: true,
  },
];

export default function Members() {
  const { slug } = useParams();
  const [showFilter, setShowFilter] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { data: project } = useAppSelector(selectProjectDetail);
  const [loading, setLoading] = useState(false);
  const [select, setSelect] = useState([]);
  const { account } = useAppConfig();
  // const [data, setData] = useState([
  //   data
  // ]);

  const [currentPage, setCurrentPage] = useState(1);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return data.slice(firstPageIndex, lastPageIndex);
  }, [currentPage]);

  useEffect(() => {
    const windowClick = (e: MouseEvent) => {
      setShowFilter(false);
    };
    window.addEventListener('click', windowClick);
    return () => {
      window.removeEventListener('click', windowClick);
    };
  }, []);

  useEffect(() => {
    if (!project?.id || !account.info?.token) return;

    console.log('creatorMembers');
    creatorMembers(project.id, account.info.token).then((resp) => {
      const { data } = resp;
      console.log(data);
    });
  }, [project?.id, account.info?.token]);

  const search = useCallback(
    async (text: MemberFilter) => {
      if (!account.info?.token || !project) return;
      const resp = await creatorMembersWithFilter(
        project.id,
        text,
        account.info.token
      );
      const { data } = resp;
      console.log(data);
    },
    [account.info?.token, project]
  );

  const downloadList = useCallback(() => {
    if (!account.info?.token || !project) return;
    if (slug !== project.slug) return;
    if (select.length > 0) {
      // TODO
    } else {
      creatorMembersDownload(project.id, [], account.info.token);
    }
  }, [project, slug, account.info?.token, select]);

  const downloadTemp = useCallback(() => {
    if (!account.info?.token || !project) return;
    if (slug !== project.slug) return;
    creatorMembersDownload(project.id, [0], account.info.token);
  }, [project, slug, account.info?.token]);

  const uploadCsvFile = useCallback(
    async (file: File) => {
      if (!project) return;
      if (!account.info?.token) return;
      if (slug !== project.slug) return;
      const resp = await creatorMembersInsert(
        project?.id,
        file,
        account.info?.token
      );
      const { data } = resp;
      console.log(data);
    },
    [project, account, slug]
  );

  return (
    <ContentBox>
      <div className="title">
        <div className="search">
          {/* <span>Members</span> */}
          <div>
            <input
              title="search-input"
              type="text"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
            />
            <button title="filter" onClick={() => {}}>
              <IconInputSearch />
            </button>
          </div>
        </div>
        <div className="btns">
          <button title="download" onClick={downloadList}>
            <IconDownload size="16px" />
          </button>
          <div className="filter">
            <button
              title="random"
              onClick={(e) => {
                e.stopPropagation();
                setShowFilter(!showFilter);
              }}
            >
              <IconRandom size="16px" />
            </button>
            {showFilter && <SearchFilter search={search} />}
          </div>
          <button onClick={() => setShowModal(true)}>+Add Member</button>
        </div>
      </div>
      <div className="body">
        <table>
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>NAME</th>
              <th>TWITTER</th>
              <th>TWITTER ID</th>
              <th>DISCORD</th>
              <th>DISCORD ID</th>
              <th>ETH ADDRESS</th>
            </tr>
          </thead>
          <tbody>
            {currentTableData.map((item) => {
              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.phone}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalCount={data.length}
        pageSize={PageSize}
        onPageChange={(page: number) => setCurrentPage(page)}
      />
      <AddMemberModal
        show={showModal}
        closeModal={() => {
          setShowModal(false);
        }}
        downloadTemp={downloadTemp}
        uploadCsvFile={uploadCsvFile}
      />
    </ContentBox>
  );
}

function SearchFilter({ search }: { search: (arg0: MemberFilter) => void }) {
  const [walletBalance, setWalletBalance] = useState('');
  const [walletBalanceUnit, setWalletBalanceUnit] = useState(CoinType.SOL);
  const [twitterNum, setTwitterNum] = useState('');
  const [hasPhantom, setHasPhantom] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [twitterFollow, setTwitterFollow] = useState(false);
  const [twitterVerified, setTwitterVerified] = useState(false);
  const [discordMember, setDiscordMember] = useState(false);
  const [discordVerified, setDiscordVerified] = useState(false);
  const [discordRole, setDiscordRole] = useState('');

  return (
    <SearchFilterBox
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div>Filter your result</div>
      <div className="filter-item">
        <p>On chain</p>
        <p>Wallet Balance (Minimum):</p>
        <div className="wallet">
          <input
            title="wallet-balance"
            type="number"
            value={walletBalance}
            onChange={(e) => {
              setWalletBalance(e.target.value);
            }}
          />
          <select
            title="unit"
            name=""
            id=""
            value={walletBalanceUnit}
            onChange={(e) => {
              setWalletBalanceUnit(e.target.value as CoinType);
            }}
          >
            <option value={CoinType.ETH}>ETH</option>
            <option value={CoinType.SOL}>SOL</option>
          </select>
        </div>
        <p>NFT Holder</p>
        <div className="nft">
          <select title="nft-holder" name="" id="">
            <option value="">Select</option>
          </select>
        </div>
        <div>
          <p onClick={() => setHasPhantom(!hasPhantom)}>
            {hasPhantom ? <IconCheckboxChecked /> : <IconCheckbox />}
            <span>Connect Phantom Wallet</span>
          </p>
          <p onClick={() => setHasMetaMask(!hasMetaMask)}>
            {hasMetaMask ? <IconCheckboxChecked /> : <IconCheckbox />}
            <span>Connect MetaMask Wallet</span>
          </p>
        </div>
      </div>
      <div className="filter-item">
        <p>Twitter</p>
        <p>Twitter followers number (Minimum):</p>
        <div className="twitter">
          <input
            title="twitter-num"
            type="text"
            value={twitterNum}
            onChange={(e) => {
              setTwitterNum(e.target.value);
            }}
          />
        </div>
        <div>
          <p onClick={() => setTwitterFollow(!twitterFollow)}>
            {twitterFollow ? <IconCheckboxChecked /> : <IconCheckbox />}
            <span>Twitter follower</span>
          </p>
          <p onClick={() => setTwitterVerified(!twitterVerified)}>
            {twitterVerified ? <IconCheckboxChecked /> : <IconCheckbox />}
            <span>Twitter verified</span>
          </p>
        </div>
      </div>
      <div className="filter-item">
        <p>Discord Role</p>
        <div className="discord">
          <input
            title="discord"
            type="text"
            value={discordRole}
            onChange={(e) => setDiscordRole(e.target.value)}
          />
        </div>
        <div>
          <p onClick={() => setDiscordMember(!discordMember)}>
            {discordMember ? <IconCheckboxChecked /> : <IconCheckbox />}
            <span>Discord member</span>
          </p>
          <p onClick={() => setDiscordVerified(!discordVerified)}>
            {discordVerified ? <IconCheckboxChecked /> : <IconCheckbox />}
            <span>Discord verified</span>
          </p>
        </div>
      </div>
      <button
        onClick={() => {
          const data: MemberFilter = {};
          if (walletBalance) data.walletBalance = walletBalance;
          if (twitterFollow) data.isTwitterFollower = twitterFollow;
          if (twitterNum) data.twitterFollowerNum = Number(twitterNum);
          if (twitterVerified) data.twitterConnected = true;
          if (hasPhantom || hasMetaMask) data.walletConnected = true;
          if (discordMember) data.isDiscordMember = discordMember;
          if (discordVerified) data.discordConnected = discordVerified;
          if (discordRole) data.discordRole = discordRole;
          search(data);
        }}
      >
        Search
      </button>
    </SearchFilterBox>
  );
}

const SearchFilterBox = styled.div`
  & .filter-item {
    margin-top: 10px;
    border-top: 1px dotted black;

    & .wallet,
    & .nft,
    & .discord,
    & .twitter {
      border-radius: 10px;
      background: #f7f9f1;
      display: flex;
      gap: 10px;
      padding: 5px 10px;
      margin-bottom: 10px;
    }

    & .wallet {
      & input {
        flex-grow: 1;
      }
    }

    & .nft {
      & select {
        flex-grow: 1;
      }
    }
  }
  & p {
    margin: 5px 0;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  & input,
  & select {
    font-size: 18px;
    line-height: 27px;
    border: none;
    outline: none;
    background: none;
  }

  & > button {
    width: 100%;
    height: 48px;
    background: #3dd606 !important;
    box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    font-weight: 700;
    font-size: 18px;
    line-height: 27px;

    color: #ffffff;
  }
`;

const ContentBox = styled.div`
  & .title {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & .search {
      display: inline-flex;
      align-items: center;

      & > div {
        background: #ebeee4;
        padding: 0 10px;
        border-radius: 10px;
        & input {
          border: none;
          outline: none;
          height: 30px;
          background: none;
        }

        & svg {
          vertical-align: middle;
        }
      }
    }

    & .btns {
      display: inline-flex;
      gap: 10px;
      & button {
        min-width: 40px;
        height: 40px;
        padding: 0 10px;
        background: #ebeee4;
        box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }

      & .filter {
        position: relative;
        & > div {
          width: 300px;
          background-color: #ebeee4;
          border: 2px solid black;
          border-radius: 10px;
          padding: 20px;
          z-index: 100;
          right: 0;
          position: absolute;
        }
      }
    }
  }

  & .body {
    border-radius: 20px;
    border: 4px solid black;
    box-sizing: border-box;
    overflow: hidden;
    table {
      width: 100%;
      border-collapse: collapse;
      position: relative;
      background: #f7f9f1;
    }

    thead tr th {
      font-weight: 500;
      text-align: left;
      /* background-color: #fafafa; */
    }

    tbody tr:nth-child(odd) {
      /* background-color: #fafafa; */
      border-top: 1px solid #d9d9d9;
      border-bottom: 1px solid #d9d9d9;
    }

    th,
    td {
      padding: 8px;
      overflow-wrap: break-word;
    }
  }
`;

const Table = styled(DataTable)`
  border-radius: 20px;
  border: 4px solid black;
  box-sizing: border-box;

  & .rdt_TableHeadRow,
  & .rdt_TableRow {
    background: #f7f9f1;
  }
`;
