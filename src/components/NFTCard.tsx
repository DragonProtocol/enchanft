import React from 'react'
import { useRoutes } from 'react-router-dom'
import styled from 'styled-components'
import Home from '../container/Home'
import Info from '../container/Info'
const NFTCard: React.FC = () => {
  return (
    <NFTCardWrapper>
      <div className="img-box">
        <span className="tag">syn thesized</span>
        <img src="https://img.syt5.com/2021/0712/20210712063814861.jpg.420.420.jpg" alt="" className='img'/>
      </div>
      <div className="name">NFTNameNFTName</div>
    </NFTCardWrapper>
  )
}
export default NFTCard
const NFTCardWrapper = styled.div`
  .img-box {
    width: 250px;
    height: 250px;
    border: 2px solid #222222;
    box-sizing: border-box;
    box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
    margin-bottom: 15px;
    position: relative;
    .tag {
      position: absolute;
      top: 0;
      left: 0;
      padding: 8px;
      background: #e4ffdb;
      border: 2px solid #222222;
      border-top: none;
      border-left: none;
      box-sizing: border-box;
    }
    .img{
        width: 100%;
        height: 100%;
    }
  }
  .name {
    font-size: 14px;
    line-height: 14px;
    color: #222222;
  }
`
