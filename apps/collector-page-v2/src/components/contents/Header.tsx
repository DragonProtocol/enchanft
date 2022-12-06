import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';
import { DropDown } from './DropDown';
import { OrderBy, ContentType } from '../../services/types/contents';

export default function Header({
  filterAction,
}: {
  filterAction: (keywords: string, type: string, orderBy: string) => void;
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
      </div>
      <div className="search">
        <button
          type="button"
          onClick={() => {
            filterAction(search, type, orderBy);
          }}
        >
          search
        </button>
        <input
          title="content-search"
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      </div>
    </HeaderBox>
  );
}

const HeaderBox = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 100px;
  .classify {
    display: flex;
    gap: 10px;
    > div {
      width: 200px;
      border: 1px solid gray;
    }
  }
  .search {
    display: flex;
    width: 300px;
    > input {
      width: 100%;
    }
  }
`;