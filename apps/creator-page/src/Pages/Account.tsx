import { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';

import { useAppConfig } from '../AppProvider';
import IconEdit from '../Components/Icons/IconEdit';
import IconEditClose from '../Components/Icons/IconEditClose';
import IconEditOk from '../Components/Icons/IconEditOk';
import PngIconDelete from '../Components/Icons/PngIconDelete';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { fetchProjectDetail, selectProjectDetail } from '../redux/projectSlice';
import { addAccount, delAccount } from '../api';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

export default function Account() {
  const { account, updateAccount } = useAppConfig();
  const [edit, setEdit] = useState(false);
  const [email, setEmail] = useState(account.info?.email || '');
  const [showModal, setShowModal] = useState(false);

  const { slug } = useParams();
  const { data } = useAppSelector(selectProjectDetail);
  const dispatch = useAppDispatch();
  // TODO fix any
  const project = useMemo(() => {
    return { ...data } as any;
  }, [data]);

  const save = useCallback(() => {
    const result = email.trim();
    if (!account.info?.token || !result) return;
    console.log(email);
    alert('coming soon');
  }, [email, account.info?.token]);

  const addMember = useCallback(
    async (wallet: string) => {
      if (!account.info?.token || !slug) return;
      const data = {
        ...project,
        teamMembers: [
          {
            wallet,
            addOrRemove: true,
          },
        ],
      };
      try {
        await addAccount(data, account.info?.token);
        dispatch(fetchProjectDetail({ slug, token: account.info.token }));
        toast.success('save success!');
        setShowModal(false);
      } catch (error) {
        const err: AxiosError = error as any;
        if (err.response?.status === 401) {
          toast.error('Login has expired,please log in again!');
          updateAccount({ ...account, info: null });
        } else {
          toast.error('save fail!');
        }
      }
    },
    [account, dispatch, project, slug, updateAccount]
  );

  const delMember = useCallback(
    async (userId: number, index: number) => {
      if (!account.info?.token || !slug) return;
      const data = {
        ...project,
        teamMembers: [
          {
            userId,
            addOrRemove: false,
          },
        ],
      };
      try {
        await delAccount(data, account.info?.token);
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
    },
    [account, dispatch, project, slug, updateAccount]
  );

  return (
    <>
      <ContentBox>
        <div className="contact">
          <h3>Email Address for Main Contact</h3>

          {(!edit && (
            <div className="desc">
              <span>{account.info?.email || 'Email has not set'}</span>{' '}
              <button
                title="edit"
                onClick={() => {
                  setEdit(true);
                }}
              >
                <IconEdit size="15px" />
              </button>
            </div>
          )) || (
            <div className="edit">
              <input
                title="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button title="save" onClick={save}>
                <IconEditOk />
              </button>
              <button title="close" onClick={() => setEdit(false)}>
                <IconEditClose />
              </button>
            </div>
          )}
        </div>
        <hr />
        <div className="members">
          <div className="title">
            <h3>Team Members</h3>
            <button onClick={() => setShowModal(true)}>+ Member</button>
          </div>
          <div className="list">
            <div className="header">
              <div>User Name</div>
              <div>Wallet Address</div>
              <div>Action</div>
            </div>
            {project.teamMembers.map((item: any, idx: number) => {
              return (
                <div className="item" key={item.userId}>
                  <div>
                    <img src={item.avatar} alt="" />
                    <span>{item.name}</span>
                  </div>
                  <div>{item.wallet}</div>
                  <div>
                    {project.teamMembers.length > 1 && (
                      <button
                        title="del"
                        onClick={() => delMember(item.userId, idx)}
                      >
                        <PngIconDelete />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ContentBox>
      <AddModal
        show={showModal}
        closeModal={() => setShowModal(false)}
        save={(newWallet) => {
          addMember(newWallet);
        }}
      />
    </>
  );
}

Modal.setAppElement('#add-modal');
function AddModal({
  show,
  closeModal,
  save,
}: {
  show: boolean;
  closeModal: () => void;
  save: (arg0: string) => void;
}) {
  const [wallet, setWallet] = useState('');
  return (
    <Modal
      isOpen={show}
      style={{
        overlay: {
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 200,
          backdropFilter: 'blur(12px)',
        },
        content: {
          display: 'flex',
          alignItems: 'center',
          margin: '0 auto',
          background: 'none',
          border: 'none',
        },
      }}
    >
      <AddMemberBox>
        <h3>Add Member</h3>
        <input
          type="text"
          placeholder="Wallet Address"
          value={wallet}
          onChange={(e) => {
            setWallet(e.target.value);
          }}
        />
        <div className="btns">
          <button className="cancel" onClick={closeModal}>
            Cancel
          </button>
          <button
            className="save"
            onClick={() => {
              save(wallet);
            }}
          >
            Save
          </button>
        </div>
      </AddMemberBox>
    </Modal>
  );
}

const AddMemberBox = styled.div`
  margin: 0 auto;

  background: #f7f9f1;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  & h3 {
    margin: 0;
    font-weight: 700;
    font-size: 20px;
    line-height: 30px;
    color: #333333;
  }

  & input {
    border: none;
    outline: none;
    box-sizing: border-box;
    padding: 10px 18px;
    width: 500px;
    height: 50px;
    background: #ebeee4;
    border-radius: 10px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: #333333;
  }

  & .btns {
    display: flex;
    gap: 20px;
    justify-content: end;
    & button {
      padding: 10px 18px;
      width: 120px;
      height: 48px;

      background: #ebeee4;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
      font-weight: 700;
      font-size: 18px;
      line-height: 27px;
    }

    & button.cancel {
      color: #333333;
    }

    & button.save {
      background: #3dd606;
      color: #ffffff;
    }
  }
`;

const ContentBox = styled.div`
  padding: 40px;
  border-radius: inherit;
  padding: 40px;
  background: #f7f9f1;
  border: 4px solid #333333;

  & .contact {
    display: flex;
    gap: 20px;
    flex-direction: column;
    & > h3 {
      margin: 0;
      font-weight: 700;
      font-size: 24px;
      line-height: 36px;
      color: #333333;
    }

    & .desc {
      display: flex;
      align-items: center;
      & span {
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        color: #333333;
        margin-right: 10px;
      }

      & button {
        & svg {
          vertical-align: middle;
        }
      }
    }

    & .edit {
      display: flex;
      gap: 20px;

      & input {
        border: none;
        outline: none;
        padding: 10px 0px 10px 10px;
        width: 400px;
        height: 50px;
        box-sizing: border-box;

        background: #ebeee4;
        border-radius: 10px;
        font-weight: 700;
        font-size: 16px;
        line-height: 24px;
        color: #333333;
      }

      & button {
        padding: 12px;
        width: 50px;
        height: 50px;
        background: #ebeee4;
        box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }
    }
  }

  & hr {
    margin-top: 40px;
    background: #d9d9d9;
  }

  & .members {
    margin-top: 20px;
    & .title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      & button {
        width: 180px;
        height: 48px;
        background: #3dd606;
        font-weight: 700;
        font-size: 18px;
        line-height: 27px;
        color: #ffffff;
        box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }
    }

    & .list {
      margin-top: 20px;
      padding: 10px;
      background: #ebeee4;
      border-radius: 10px;
      & .header,
      & .item {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        > div {
          width: 400px;
          &:first-child {
            width: 250px;
          }

          &:last-child {
            width: 100px;
          }
        }
      }
      & .header {
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        color: rgba(51, 51, 51, 0.6);
      }

      & .item {
        box-sizing: border-box;
        border-top: 1px solid #d9d9d9;
        height: 60px;
        display: flex;
        align-items: center;

        > div {
          display: inline-flex;
          align-items: center;
          font-weight: 400;
          font-size: 16px;
          line-height: 20px;

          color: #333333;

          & img {
            width: 40px;
            height: 40px;
            margin-right: 10px;
            border-radius: 4px;
          }

          & span {
            font-weight: 700;
            font-size: 16px;
            line-height: 20px;
            color: #333333;
          }

          & button {
            & img {
              width: 18px;
              height: 18px;
            }
          }
        }
      }
    }
  }
  & button {
  }
`;
