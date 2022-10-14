import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  creatorMembersDownloadWithFilter,
  creatorMembersInsert,
  creatorMembersWithFilter,
  creatorMemberTempDownload,
  PageSize,
  Member,
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

import convertToCSV from '../utils/convertToCsv';
import Loading from '../Components/Loading';
import { Whales } from '../utils/constants';
import UserAvatar from '../Components/UserAvatar';
import { sortPubKey } from '../utils';

const fileDownload = require('js-file-download');

export default function Members() {
  const { slug } = useParams();
  const [showFilter, setShowFilter] = useState(false);
  // const [searchText, setSearchText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { data: project } = useAppSelector(selectProjectDetail);
  const [loading, setLoading] = useState(false);
  const [select, setSelect] = useState<Member[]>([]);
  const { account } = useAppConfig();
  const [data, setData] = useState<Member[]>([]);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<MemberFilter>({});
  const [loaded, setLoaded] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!project?.id || !account.info?.token) return;

    // console.log({ currentPage });
    setLoading(true);

    creatorMembersWithFilter(
      project.id,
      filter,
      account.info.token,
      currentPage - 1,
      PageSize
    )
      .then((resp) => {
        const { data } = resp.data;
        const { totalNumber, members } = data;
        setTotal(totalNumber);
        setData(members);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, project, account.info?.token, filter]);

  useEffect(() => {
    const windowClick = (e: MouseEvent) => {
      setShowFilter(false);
    };
    window.addEventListener('click', windowClick);
    return () => {
      window.removeEventListener('click', windowClick);
    };
  }, []);

  const search = useCallback(
    async (filter: MemberFilter) => {
      if (!account.info?.token || !project) return;
      setFilter(filter);
      setCurrentPage(1);
      setShowFilter(false);
    },
    [account.info?.token, project]
  );

  const downloadList = useCallback(async () => {
    if (!account.info?.token || !project) return;
    if (slug !== project.slug) return;
    if (select.length > 0) {
      const data = select.map((item) => ({
        wallet: item.wallet,
      }));
      const csv = convertToCSV(data);
      fileDownload(csv, `member.csv`, 'text/csv;charset=utf-8', '\uFEFF');
    } else {
      creatorMembersDownloadWithFilter(project.id, filter, account.info.token);
    }
  }, [project, slug, account.info?.token, select, filter]);

  const downloadTemp = useCallback(() => {
    if (!account.info?.token || !project) return;
    if (slug !== project.slug) return;
    creatorMemberTempDownload(account.info.token);
  }, [project, slug, account.info?.token]);

  const uploadCsvFile = useCallback(
    async (file: File) => {
      if (!project) return;
      if (!account.info?.token) return;
      if (slug !== project.slug) return;
      await creatorMembersInsert(project?.id, file, account.info?.token);
      toast.success('upload success');
      setShowModal(false);
    },
    [project, account, slug]
  );

  return (
    <ContentBox>
      <div className="title">
        <div className="search">
          <span>Members ({total})</span>
          {/* <div>
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
          </div> */}
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
      {(loading && (
        <div className="loading">
          <Loading />
        </div>
      )) || (
        <div className="body">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>NAME</th>
                <th>TWITTER</th>
                <th>TWITTER ID</th>
                <th>DISCORD</th>
                <th>DISCORD ID</th>
                <th>ETH ADDRESS</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>
                      {(select.find((s) => s.id === item.id) && (
                        <span
                          onClick={() => {
                            const ss = select.find((s) => s.id === item.id);
                            const idx = select.indexOf(ss!);
                            setSelect([
                              ...select.slice(0, idx),
                              ...select.slice(idx + 1),
                            ]);
                          }}
                        >
                          <IconCheckboxChecked />
                        </span>
                      )) || (
                        <span
                          onClick={() => {
                            setSelect([...select, { ...item }]);
                          }}
                        >
                          <IconCheckbox />
                        </span>
                      )}
                    </td>
                    {/* <td>{item.userId}</td> */}
                    <td>
                      <UserAvatar src={item.userAvatar} />
                      {item.userName || 'X'}
                    </td>
                    <td>{item.twitterName || 'X'}</td>
                    <td>{item.twitterId || 'X'}</td>
                    <td>{item.discordName || 'X'}</td>
                    <td>{item.discordId || 'X'}</td>
                    <td>
                      {(item.wallet && sortPubKey(item.wallet, 8)) || 'X'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalCount={total}
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
  const [whales, setWhales] = useState('');

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
            {/* <option value={CoinType.SOL}>SOL</option> */}
          </select>
        </div>
        <p>NFT Holder</p>
        <div className="nft">
          <select
            title="nft-holder"
            name=""
            id=""
            value={whales}
            onChange={(e) => {
              setWhales(e.target.value);
            }}
          >
            <option value="">Select</option>
            {Object.keys(Whales).map((item) => {
              return (
                <option key={item} value={Whales[item]}>
                  {item}
                </option>
              );
            })}
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
          if (whales) data.nftWhales = [whales];
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

    & img {
      border-radius: 20%;
      width: 30px;
      height: 30px;
      vertical-align: middle;
      margin-right: 8px;
    }

    table tr {
      height: 50px;
    }

    thead tr th {
      font-weight: 500;
      text-align: left;
      /* background-color: #fafafa; */
    }

    & span,
    & svg {
      vertical-align: middle;
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
