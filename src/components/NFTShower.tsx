import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import expandMoreIcon from './icons/expandMore.svg'
import { CursorPointerUpCss } from '../GlobalStyle'
import NFTTree from './NFTTree'
import { Node } from '../synft'
interface NFTShowerData {
  jsonData: any
  injectTree: {
    data: Node
    loading: boolean
  }
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
  const { injectTree, jsonData: info } = data
  const [currentAccordion, setCurrentAccordion] = useState('enchantment')
  const handleAccordionChange = (accordion: string, isExpanded: boolean) => {
    if (isExpanded) {
      setCurrentAccordion(accordion)
    } else {
      setCurrentAccordion('')
    }
  }

  if (!info) {
    return null
  }
  return (
    <NFTShowerWrapper>
      {/* <div className="img-box">
        <img src={info.image} alt={info.image} />
      </div> */}
      <div className="info-box">
        {/* <Accordion
          className="info-item"
          style={{ display: injectTree.data.curr.children.length > 0 ? 'block' : 'none' }}
          expanded={currentAccordion === 'enchantment'}
          onChange={(event, isExpanded) => handleAccordionChange('enchantment', isExpanded)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" className="info-title">
            enchantment
          </AccordionSummary>
          <AccordionDetails className="info-content">
            {injectTree.loading ? <div>loading...</div> : <NFTTree data={injectTree.data} height={252} />}
          </AccordionDetails>
        </Accordion> */}
        {info.description && (
          <Accordion
            className="info-item"
            expanded={currentAccordion === 'description'}
            onChange={(event, isExpanded) => handleAccordionChange('description', isExpanded)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" className="info-title">
              about
              {/* TODO project name */}
            </AccordionSummary>
            <AccordionDetails className="info-content">{info.description}</AccordionDetails>
          </Accordion>
        )}

        {info?.attributes && (
          <Accordion
            className="info-item"
            expanded={currentAccordion === 'properties'}
            onChange={(event, isExpanded) => handleAccordionChange('properties', isExpanded)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" className="info-title">
              properties
            </AccordionSummary>
            <AccordionDetails className="info-content properties-content">
              {info?.attributes?.map((item: any, idx: number) => (
                <div key={idx} className="properties-item">
                  <div className="properties-key">{item.trait_type}</div>
                  <div className="properties-value">{item.value}</div>
                </div>
              ))}
            </AccordionDetails>
          </Accordion>
        )}

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
      width: 100%;
    }
  }
  .info-box {
    font-size: 12px;
    .info-item {
      margin: 0;
      margin-bottom: 12px;
      background: #ffffff;
      border: 2px solid #222222;
    }
    .info-title {
      /* background: #f0f0f0; */
      /* box-shadow: inset 0px -4px 0px rgba(0, 0, 0, 0.25), inset 0px 4px 0px rgba(255, 255, 255, 0.25); */
      /* text-transform: uppercase; */
      text-transform: capitalize;
      ${CursorPointerUpCss}
      font-size: 16px;
      line-height: 16px;
    }
    .info-content {
      background: #f8f8f8;
      box-sizing: border-box;
      border-top: none;
      padding: 24px;
      color: rgba(34, 34, 34, 0.5);
      overflow: hidden;
      max-height: 300px;
      font-size: 12px;
      line-height: 24px;
      color: rgba(34, 34, 34, 0.7);
    }
    .properties-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 300px;
      overflow-y: scroll;
    }
    .properties-item {
      .properties-key {
        color: rgba(34, 34, 34, 0.5);
        margin-bottom: 3px;
      }
      .properties-value {
        color: #222222;
      }
    }
  }
`
