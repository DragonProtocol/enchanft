import styled from 'styled-components';

import AddSvg from './imgs/add.svg';

export function AddCard({ addAction }: { addAction: () => void }) {
  return (
    <AddBox onClick={addAction}>
      <img src={AddSvg} alt="" />
      <p>Create Project</p>
    </AddBox>
  );
}

export function ItemCard() {
  return <ItemBox>Item</ItemBox>;
}

const AddBox = styled.div`
  cursor: pointer;
  background: #ebeee4;
  border: 2px dashed #333333;
  border-radius: 10px;
  height: 342px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & p {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    color: #333333;
  }
`;

const ItemBox = styled.div`
  background: #f7f9f1;
  border: 2px solid #333333;
  border-radius: 10px;
  height: 342px;
`;
