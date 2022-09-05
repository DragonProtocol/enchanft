import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { useAppConfig } from '../AppProvider';

export default function AsideNav() {
  const { phantomValid, metaMaskValid } = useAppConfig();
  return (
    <AsideBox>
      <div>LeftNav</div>
      {(phantomValid && <button>Connect Phantom</button>) || (
        <button>installPhantom</button>
      )}
      {(metaMaskValid && <button>Connect MetaMask</button>) || (
        <button>installMetaMask</button>
      )}
    </AsideBox>
  );
}

const AsideBox = styled.aside`
  width: 200px;
  background: #f7f9f1;
`;
