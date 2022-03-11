import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
interface NFTShowerData {
  uri: string
  mint: string
  addr: string
}
interface Props {
  data: NFTShowerData
}
export default function NFTShower({ data }: Props) {
  const { uri, mint, addr } = data
  const [info, setInfo] = useState<any>({})
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
    // <div style={{ display: 'flex', margin: '10px' }}>
    //   <img style={{ width: '200px' }} src={info.image} alt={info.name} />
    //   <div>
    //     <p>name: {info.name}</p>
    //     <p>description: {info.description}</p>
    //     <p>uri: {uri}</p>
    //     <p>collection: {JSON.stringify(info.collection)}</p>
    //     <p>addr: {addr}</p>
    //     <Link style={{ display: 'block', margin: '1rem 0' }} to={`/info/${mint}/${addr}`}>
    //       {mint}
    //     </Link>
    //   </div>
    // </div>
    <NFTShowerWrapper>
      <div className="img-box">
        <img src={info.image} alt={info.image} />
      </div>
      <div className="info-box">
        <Accordion className="info-item">
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header" className="info-title">
            Accordion 1
          </AccordionSummary>
          <AccordionDetails className="info-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit
            leo lobortis eget.
          </AccordionDetails>
        </Accordion>
        <Accordion className="info-item">
          <AccordionSummary aria-controls="panel1a-content" id="panel1a-header-2" className="info-title">
            Accordion 1
          </AccordionSummary>
          <AccordionDetails className="info-content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit
            leo lobortis eget.
          </AccordionDetails>
        </Accordion>
      </div>
    </NFTShowerWrapper>
  )
}
const NFTShowerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  .img-box {
    img {
      width: 500px;
      height: 500px;
    }
  }
  .info-box {
    width: 500px;
    .info-item {
      
    }
    .info-title {
      background: #F0F0F0;
    }
    .info-content{
      background: #ffffff;
      border: 2px solid #222222;
      box-sizing: border-box;
    }
  }
`
