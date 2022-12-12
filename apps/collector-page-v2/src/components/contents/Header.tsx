import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';
import { DropDown } from './DropDown';
import { OrderBy, ContentType } from '../../services/types/contents';

export default function Header({
  filterAction,
  changeOriginalAction,
  changeReaderViewAction,
}: {
  filterAction: (keywords: string, type: string, orderBy: string) => void;
  changeOriginalAction: () => void;
  changeReaderViewAction: () => void;
}) {
  const [orderBy, setOrderBy] = useState('For U');
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = useCallback(debounce(filterAction, 100), []);

  useEffect(() => {
    fetchData('', type, orderBy);
  }, [orderBy, type]);

  return (
    <HeaderBox>
      <div className="classify">
        <DropDown
          items={Object.values(OrderBy)}
          title="For U"
          selectAction={(item) => {
            setOrderBy(item);
          }}
        />
        <DropDown
          items={Object.values(ContentType)}
          defaultSelect="All"
          selectAction={(item) => {
            setType(item);
          }}
        />

        <input
          title="content-search"
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button
          type="button"
          onClick={() => {
            filterAction(search, type, orderBy);
          }}
        >
          search
        </button>
      </div>
      <div className="search">
        <button type="button" onClick={changeOriginalAction}>
          Original
        </button>
        <button type="button" onClick={changeReaderViewAction}>
          ReaderView
        </button>
      </div>
    </HeaderBox>
  );
}

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  .classify {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .search {
    display: flex;
    justify-content: end;
    width: 300px;
    > input {
      width: 100%;
    }
  }
`;
