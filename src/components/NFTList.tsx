import React from 'react'
import styled from 'styled-components'
import NFTCard from './NFTCard'
const NFTList: React.FC = () => {
  return (
    <NFTListWrapper>
      <div className="list-item">
        <NFTCard></NFTCard>
      </div>
      <div className="list-item">
        <NFTCard></NFTCard>
      </div>
      <div className="list-item">
        <NFTCard></NFTCard>
      </div>
      <div className="list-item">
        <NFTCard></NFTCard>
      </div>
      <div className="list-item">
        <NFTCard></NFTCard>
      </div>
      <div className="list-item">
        <NFTCard></NFTCard>
      </div>
      <div className="list-item">
        <NFTCard></NFTCard>
      </div>
      <div className="list-item">
        <NFTCard></NFTCard>
      </div>
      <div className="list-item">
        <NFTCard></NFTCard>
      </div>
    </NFTListWrapper>
  )
}
export default NFTList
const NFTListWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  .list-item {
    flex: 1;
    margin: 0 8px 8px 0; // 间隙为8px
    width: calc((100% - 32px) / 4); // 这里的32px = (分布个数3-1)*间隙4px, 可以根据实际的分布个数和间隙区调整
    min-width: calc((100% - 32px) / 4); // 加入这两个后每个item的宽度就生效了
    max-width: calc((100% - 32px) / 4); // 加入这两个后每个item的宽度就生效了
  }
`
