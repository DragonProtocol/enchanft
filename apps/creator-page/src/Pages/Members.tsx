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
import IconPngSearch from '../Components/Icons/IconPngSearch';
import IconTweet from '../Components/Icons/IconTweet';
import IconTwitter from '../Components/Icons/IconTwitter';
import IconDiscord from '../Components/Icons/IconDiscord';

const fileDownload = require('js-file-download');

export default function Members() {
  const { slug } = useParams();
  const [showFilter, setShowFilter] = useState(false);
  const [searchText, setSearchText] = useState('');
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

  const loadData = useCallback(() => {
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
    loadData();
  }, [loadData]);

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
      loadData();
      toast.success('upload success');
      setShowModal(false);
    },
    [project, account, slug, loadData]
  );

  const searchTextData = useMemo(() => {
    const text = searchText.trim();
    if (text) {
      return data.filter((item) => {
        const reg = new RegExp(text);
        return (
          reg.test(item.userName) ||
          reg.test(item.discordName || '') ||
          reg.test(item.twitterName || '') ||
          reg.test(item.twitterId || '') ||
          reg.test(item.discordId || '') ||
          reg.test(item.wallet || '')
        );
      });
    } else {
      return data;
    }
  }, [searchText, data]);

  return (
    <ContentBox>
      <h3>Member List ({total})</h3>
      <div className="title">
        <div className="search">
          <button title="filter" onClick={() => {}}>
            <IconPngSearch size="20px" />
          </button>
          <input
            title="search-input"
            placeholder="Search"
            type="text"
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </div>
        <div className="btns">
          <button title="download" onClick={downloadList}>
            <IconDownload size="16px" />
          </button>
          <div className="filter">
            <button
              title={'random'}
              className={showFilter ? 'active' : ''}
              onClick={(e) => {
                e.stopPropagation();
                setShowFilter(!showFilter);
              }}
            >
              <IconRandom size="16px" />
            </button>
            {showFilter && <SearchFilter search={search} />}
          </div>
          <button className="add-member" onClick={() => setShowModal(true)}>
            +Add Member
          </button>
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
                {/* <th></th> */}
                <th>Name</th>
                <th>Twitter</th>
                <th>Twitter ID</th>
                <th>Discord</th>
                <th>Discord ID</th>
                <th>ETH Address</th>
              </tr>
            </thead>
            <tbody>
              {searchTextData.map((item) => {
                return (
                  <tr key={item.id}>
                    {/*<td>
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
                    </td>*/}
                    {/* <td>{item.userId}</td> */}
                    <td>
                      <UserAvatar src={item.userAvatar} />
                      {item.userName || '❌'}
                    </td>
                    <td>
                      {(item.twitterName && (
                        <>
                          <IconTwitter /> {item.twitterName}
                        </>
                      )) || (
                        <>
                          <span className="twitter-obs">
                            <IconTwitter />
                          </span>{' '}
                          ❌
                        </>
                      )}
                    </td>
                    <td>{item.twitterId || '❌'}</td>
                    <td>
                      {(item.discordName && (
                        <>
                          <IconDiscord /> {item.discordName}
                        </>
                      )) || (
                        <>
                          <span className="twitter-obs">
                            <IconDiscord />
                          </span>
                          ❌
                        </>
                      )}
                    </td>
                    <td>{item.discordId || '❌'}</td>
                    <td>
                      {(item.wallet && sortPubKey(item.wallet, 8)) || '❌'}
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
      <h3>Filter your result</h3>
      <div className="filter-item">
        <h4>On chain</h4>
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
        <p>Holding blue chip NFTs:</p>
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
            {hasPhantom ? (
              <IconCheckboxChecked size="18px" />
            ) : (
              <IconCheckbox size="18px" />
            )}
            <span>Connect Phantom Wallet</span>
          </p>
          <p onClick={() => setHasMetaMask(!hasMetaMask)}>
            {hasMetaMask ? (
              <IconCheckboxChecked size="18px" />
            ) : (
              <IconCheckbox size="18px" />
            )}
            <span>Connect MetaMask Wallet</span>
          </p>
        </div>
      </div>
      <div className="filter-item">
        <h4>Twitter</h4>
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
            {twitterFollow ? (
              <IconCheckboxChecked size="18px" />
            ) : (
              <IconCheckbox size="18px" />
            )}
            <span>Twitter follower</span>
          </p>
          <p onClick={() => setTwitterVerified(!twitterVerified)}>
            {twitterVerified ? (
              <IconCheckboxChecked size="18px" />
            ) : (
              <IconCheckbox size="18px" />
            )}
            <span>Twitter verified</span>
          </p>
        </div>
      </div>
      <div className="filter-item">
        <h4>Discord</h4>
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
            {discordMember ? (
              <IconCheckboxChecked size="18px" />
            ) : (
              <IconCheckbox size="18px" />
            )}
            <span>Discord member</span>
          </p>
          <p onClick={() => setDiscordVerified(!discordVerified)}>
            {discordVerified ? (
              <IconCheckboxChecked size="18px" />
            ) : (
              <IconCheckbox size="18px" />
            )}
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
  width: 440px;
  & > h3 {
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    color: #333333;
    margin: 0;
    margin-bottom: 20px;
  }
  & .filter-item {
    margin-top: 10px;
    border-top: 1px solid #d9d9d9;

    & > h4 {
      font-weight: 700;
      font-size: 16px;
      line-height: 24px;
      margin: 20px 0;
      color: #333333;
    }

    & p {
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      margin: 0;
      margin: 10px 0;
      color: #333333;
    }

    & .wallet,
    & .nft,
    & .discord,
    & .twitter {
      border-radius: 10px;
      background: #ebeee4;
      display: flex;
      gap: 10px;
      padding: 5px 10px;
      margin-bottom: 10px;
    }

    & .wallet,
    & .discord,
    & .twitter {
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
    height: 30px;
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
  border-radius: 20px;
  border: 4px solid black;
  box-sizing: border-box;
  padding: 40px;
  background-color: #f7f9f1;
  & > h3 {
    font-weight: 700;
    font-size: 24px;
    line-height: 36px;
    color: #333333;
    margin: 0 0 20px 0;
  }
  & .title {
    margin: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & .search {
      display: inline-flex;
      align-items: center;
      width: 500px;
      height: 48px;

      background: #ebeee4;
      padding: 0 20px;
      border-radius: 10px;
      & input {
        border: none;
        outline: none;
        background: none;
        font-weight: 400;
        font-size: 18px;
        flex-grow: 1;
      }

      & button {
        margin-right: 10px;
        & img {
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

        &.add-member {
          background: #3dd606;
          box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
          font-weight: 700;
          font-size: 18px;
          line-height: 27px;
          color: #ffffff;
        }

        &.active {
          background: #333333;

          & svg path {
            fill: #fff;
          }
        }
      }

      & .filter {
        position: relative;
        & > div {
          width: 440px;
          box-sizing: border-box;
          background-color: #f7f9f1;
          border: 2px solid black;
          border-radius: 10px;
          padding: 20px;
          z-index: 100;
          top: 50px;
          right: -160px;
          position: absolute;
        }
      }
    }
  }

  & .body {
    border-radius: 10px;
    /* border: 4px solid black; */
    box-sizing: border-box;
    overflow: hidden;
    margin-top: 20px;
    padding: 0 10px;
    background: #ebeee4;
    table {
      width: 100%;
      border-collapse: collapse;
      position: relative;
    }

    & img {
      border-radius: 20%;
      width: 40px;
      height: 40px;
      vertical-align: middle;
      margin-right: 8px;
    }

    table thead tr {
      height: 60px;
    }

    table tbody tr {
      height: 80px;
    }

    table {
      & .twitter-obs {
        visibility: hidden;
      }
    }

    thead tr th,
    tbody tr td {
      font-weight: 500;
      text-align: left;
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      /* identical to box height, or 125% */

      color: rgba(51, 51, 51, 0.6);
    }

    & span,
    & svg {
      vertical-align: middle;
    }

    tbody tr {
      /* background-color: #fafafa; */
      border-top: 1px solid #d9d9d9;
      /* border-bottom: 1px solid #d9d9d9; */
    }

    th,
    td {
      padding: 8px;
      overflow-wrap: break-word;
    }
  }
`;
