import React from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import ReactJson from 'react-json-view'

import NFTHandler from '../components/NFTHandler'

import NFTShower from '../components/NFTShower'
import useInjectTree from '../hooks/useInjectTree'
import LoadingIcon from '../components/imgs/Loading.gif'

import { useInfoFromMint, useValidNFT } from '../hooks'

const Info: React.FC = () => {
  const params = useParams()

  const { info, loading: infoLoading } = useInfoFromMint(params.mint)
  const { valid: validNFT, checking: validChecking } = useValidNFT(params.mint)
  const { injectTree, loading: injectTreeLoading } = useInjectTree(params.mint)

  const metadata = info?.metadata
  const loading = validChecking || infoLoading
  return (
    <InfoWrapper>
      {(loading && (
        <div className="tip">
          <img src={LoadingIcon} alt="" />
        </div>
      )) ||
        (validNFT && (
          <>
            <div className="left">
              <NFTShower
                data={{
                  jsonData: info?.externalMetadata,
                  injectTree: {
                    data: injectTree,
                    loading: injectTreeLoading,
                  },
                }}
              />
            </div>
            <div className="right">{metadata && <NFTHandler metadata={metadata} />}</div>
          </>
        )) || <div className="tip">invalid NFT</div>}
      {/* {!injectTreeLoading && <ReactJson src={injectTree} />} */}
    </InfoWrapper>
  )
}
export default Info
const InfoWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  .left,
  .right {
    width: 50%;
  }
  .tip {
    margin: 0 auto;
    margin-top: 40%;
  }
`
