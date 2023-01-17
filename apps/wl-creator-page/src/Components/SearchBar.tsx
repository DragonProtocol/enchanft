import { useState } from 'react';
import styled from 'styled-components';
import SearchPng from './imgs/search.png';

export function SearchBar({ search }: { search?: (arg0: string) => void }) {
  const [searchText, setSearchText] = useState('');
  return (
    <SearchBarBox className="search-bar">
      <button
        title="search-btn"
        onClick={() => search && search(searchText.trim())}
      >
        <img src={SearchPng} alt="" />
      </button>
      <input
        title="search-input"
        type="text"
        placeholder="Search Keywords or Community Name"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
    </SearchBarBox>
  );
}

const SearchBarBox = styled.div`
  display: inline-flex;
  align-items: center;
  width: 500px;
  height: 50px;

  background: #ebeee4;
  border-radius: 10px;
  padding: 0px 20px;
  & img {
    width: 20px;
    height: 20px;
  }
  & input {
    outline: none;
    border: none;
    background: inherit;
    width: 100%;
    padding-left: 10px;
    font-weight: 400;
    font-size: 18px;
    line-height: 27px;
    font-family: inherit;
  }
`;
