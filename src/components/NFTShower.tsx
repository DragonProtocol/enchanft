import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import expandMoreIcon from './icons/expandMore.svg'
interface NFTShowerData {
  uri: string
  mint: string
  addr: string
}
interface Props {
  data: NFTShowerData
}
const ExpandMoreIcon = () => (
  <>
    <img src={expandMoreIcon}></img>
  </>
)
export default function NFTShower({ data }: Props) {
  const { uri, mint, addr } = data
  const [info, setInfo] = useState<any>({})
  const aliveRef = useRef(true)
  const [currentAccordion, setCurrentAccordion] = useState('')
  const handleAccordionChange = (accordion: string, isExpanded: boolean) => {
    if (isExpanded) {
      setCurrentAccordion(accordion)
    } else {
      setCurrentAccordion('')
    }
  }
  useEffect(() => {
    if (!uri) return
    ;(async () => {
      try {
        const response = await fetch(uri)
        const jsonData = await response.json()
        console.log('jsonData', jsonData)

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
        <Accordion
          className="info-item"
          expanded={currentAccordion === 'description'}
          onChange={(event, isExpanded) => handleAccordionChange('description', isExpanded)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" className="info-title">
            description
          </AccordionSummary>
          <AccordionDetails className="info-content">{info.description}</AccordionDetails>
        </Accordion>
        <Accordion
          className="info-item"
          expanded={currentAccordion === 'properties'}
          onChange={(event, isExpanded) => handleAccordionChange('properties', isExpanded)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" className="info-title">
            properties
          </AccordionSummary>
          <AccordionDetails className="info-content properties-content">
            {info?.attributes?.map((item: any) => (
              <div className="properties-item">
                <div className="properties-key">{item.trait_type}</div>
                <div className="properties-value">{item.value}</div>
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
        {/* <Accordion
          className="info-item"
          expanded={currentAccordion === 'details'}
          onChange={(event, isExpanded) => handleAccordionChange('details', isExpanded)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" className="info-title">
            details
          </AccordionSummary>
          <AccordionDetails className="info-content">

          </AccordionDetails>
        </Accordion> */}
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
      margin: 0;
    }
    .info-title {
      background: #f0f0f0;
      box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.25), inset 0px 4px 0px rgba(255, 255, 255, 0.25);
      text-transform: uppercase;
    }
    .info-content {
      background: #ffffff;
      border: 2px solid #222222;
      box-sizing: border-box;
      border-top: none;
      padding: 24px;
      color: rgba(34, 34, 34, 0.5);
    }
    .properties-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .properties-item {
      display: flex;
      .properties-key {
        color: rgba(34, 34, 34, 0.5);
      }
      .properties-value {
        color: #222222;
        flex: 1;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
`
