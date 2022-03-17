import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { NftDataItem } from './NFTList'
interface Props {
  data: NftDataItem
}
const NFTCard: React.FC<Props> = ({ data }: Props) => {
  const { uri } = data
  const [info, setInfo] = useState<any>(data)
  const aliveRef = useRef(true)
  useEffect(() => {
    if (!uri) return
    ;(async () => {
      try {
        const response = await fetch(uri)
        const jsonData = await response.json()
        if (aliveRef.current) setInfo(jsonData)
      } catch (error) {
        if (aliveRef.current) console.error(error)
      }
    })()
  }, [uri])
  useEffect(() => {
    return () => {
      aliveRef.current = false
    }
  }, [])
  return (
    <NFTCardWrapper>
      <div className="img-box">
        {data.hasCopied && <span className="tag tag-synthesized">Synthesized</span>}
        {/* {data.hasInjected && <span className="tag tag-enchanted">Enchanted</span>} */}
        <img src={info.image} alt={info.image} className="img" />
      </div>
      <div className="name">{info.name}</div>
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
    .tag-synthesized {
      background: #fffbdb;
    }
    .tag-enchanted {
      background: #e4ffdb;
    }
    .img {
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
