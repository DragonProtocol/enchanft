import React, { useCallback, useEffect, useState } from 'react';
import { EditBox, EditTitle } from '../Components/Project/EditTitle';
import CalendarTime from '../Components/Project/Mint/CalendarTime';
import TotalSupply from '../Components/Project/Mint/TotalSupply';
import MintPrice from '../Components/Project/Mint/MintPrice';
import MintLimit from '../Components/Project/Mint/MintLimit';
import styled from 'styled-components';
import { useAppConfig } from '../AppProvider';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchProjectDetail, selectProjectDetail } from '../redux/projectSlice';
import WhitelistSupply from '../Components/Project/Mint/WhitelistSupply';
import { BlockchainType } from '../Components/Project/types';
import dayjs from 'dayjs';
import PublicSaleTime from '../Components/Project/Mint/PublicSaleTime';
import { updateProject } from '../api';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import isEqual from '../utils/isEqual';

export default function ProjectMintEdit() {
  const { account, updateAccount } = useAppConfig();
  const { slug } = useParams();
  const { data } = useAppSelector(selectProjectDetail);
  const dispatch = useAppDispatch();

  // TODO fix any
  const [project, setProject] = useState<any>({ ...data });
  const [couldSave, setCouldSave] = useState(false);

  const saveProject = useCallback(async () => {
    if (!account.info?.token || !slug) return;
    try {
      await updateProject(project, account.info?.token);
      dispatch(fetchProjectDetail({ slug, token: account.info.token }));
      toast.success('save success!');
    } catch (error) {
      const err: AxiosError = error as any;
      if (err.response?.status === 401) {
        toast.error('Login has expired,please log in again!');
        updateAccount({ ...account, info: null });
      } else {
        toast.error('save fail!');
      }
    }
  }, [account, dispatch, project, slug, updateAccount]);

  useEffect(() => {
    if (!isEqual(data, project)) {
      setCouldSave(true);
    } else {
      setCouldSave(false);
    }
  }, [data, project]);

  return (
    <ContentBox>
      <EditTitle
        title="Mint Information"
        save={saveProject}
        couldSave={couldSave}
      />
      <div className="info">
        <div className="left">
          <TotalSupply supply={project.itemTotalNum} />
          <MintPrice
            mintPrice={project.publicSalePrice || '0'}
            updateMintPrice={(price) => {
              setProject({
                ...project,
                publicSalePrice: price,
              });
            }}
            blockchain={
              project.chainId === -1
                ? BlockchainType.Solana
                : BlockchainType.Ethereum
            }
          />
        </div>
        <div className="right">
          <PublicSaleTime
            startDate={
              project.publicSaleTime
                ? new Date(project.publicSaleTime)
                : new Date()
            }
            updateStartDate={(date) => {
              setProject({
                ...project,
                publicSaleTime: date.getTime(),
              });
            }}
          />
          <MintLimit
            mintMaxNum={project.mintLimited || 0}
            updateMintMaxNum={(data) => {
              setProject({
                ...project,
                mintLimited: data,
              });
            }}
          />
        </div>
      </div>
      <hr />
      {project.whitelists.map((item: any, index: number) => {
        return (
          <React.Fragment key={index}>
            <div className="whitelist">
              <div className="title">
                <h3>Whitelist {index + 1}</h3>
                <span>(Optional)</span>
              </div>
              <div className="info">
                <div className="left">
                  <WhitelistSupply
                    totalNum={item.totalNum}
                    updateTotalNum={(n) => {
                      setProject({
                        ...project,
                        whitelists: [
                          ...project.whitelists.slice(0, index),
                          {
                            ...project.whitelists[index],
                            totalNum: n,
                          },
                          ...project.whitelists.slice(index + 1),
                        ],
                      });
                    }}
                  />
                  <MintPrice
                    mintPrice={item.mintPrice}
                    updateMintPrice={(price: string) => {
                      setProject({
                        ...project,
                        whitelists: [
                          ...project.whitelists.slice(0, index),
                          {
                            ...project.whitelists[index],
                            mintPrice: price,
                          },
                          ...project.whitelists.slice(index + 1),
                        ],
                      });
                    }}
                    blockchain={
                      project.chainId === -1
                        ? BlockchainType.Solana
                        : BlockchainType.Ethereum
                    }
                  />
                </div>
                <div className="right">
                  <CalendarTime
                    startDate={item.mintStartTime}
                    endDate={item.mintEndTime}
                    updateStartDate={(time) => {
                      setProject({
                        ...project,
                        whitelists: [
                          ...project.whitelists.slice(0, index),
                          {
                            ...project.whitelists[index],
                            mintStartTime: time,
                          },
                          ...project.whitelists.slice(index + 1),
                        ],
                      });
                    }}
                    updateEndDate={(time) => {
                      setProject({
                        ...project,
                        whitelists: [
                          ...project.whitelists.slice(0, index),
                          {
                            ...project.whitelists[index],
                            mintEndTime: time,
                          },
                          ...project.whitelists.slice(index + 1),
                        ],
                      });
                    }}
                  />
                  <MintLimit
                    mintMaxNum={item.mintMaxNum}
                    updateMintMaxNum={(v) => {
                      setProject({
                        ...project,
                        whitelists: [
                          ...project.whitelists.slice(0, index),
                          {
                            ...project.whitelists[index],
                            mintMaxNum: v,
                          },
                          ...project.whitelists.slice(index + 1),
                        ],
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <hr />
          </React.Fragment>
        );
      })}

      <div className="add-btns">
        <button
          onClick={() => {
            setProject({
              ...project,
              whitelists: [
                ...project.whitelists,
                {
                  mintMaxNum: 0,
                  mintPrice: '0',
                  mintStartTime: Date.now(),
                  mintEndTime: dayjs().add(1, 'M').toDate().getTime(),
                  totalNum: 0,
                },
              ],
            });
          }}
        >
          + Add Whitelist
        </button>
      </div>
    </ContentBox>
  );
}

const ContentBox = styled(EditBox)`
  & .whitelist {
    & .title {
      margin-top: 40px;
      display: flex;
      align-items: center;
      justify-content: start;

      & h3 {
        font-weight: 700;
        font-size: 24px;
        line-height: 36px;
        margin: 0;
        color: #3dd606;
      }

      & span {
        margin-left: 5px;
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: #333333;
      }
    }

    & .info {
      margin-top: 20px;
    }
  }

  & .add-btns {
    margin-top: 40px;
    & button {
      padding: 10px 18px;
      width: 210px;
      height: 48px;
      background: #ebeee4;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
      color: #333333;
    }
  }
`;
