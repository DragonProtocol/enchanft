import React from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

import NFTHandler from '../components/NFTHandler'

import NFTShower from '../components/NFTShower'
import useInjectTree from '../hooks/useInjectTree'
import LoadingIcon from '../components/imgs/Loading.gif'
import { MOBILE_BREAK_POINT } from '../utils/constants'

import { useInfoFromMint, useValidNFT } from '../hooks'

const Info: React.FC = () => {
  const params = useParams()

  const { info, loading: infoLoading } = useInfoFromMint(params.mint)
  const { valid: validNFT, checking: validChecking } = useValidNFT(params.mint)
  const { injectTree, loading: injectTreeLoading, refresh: reloadInjectTree } = useInjectTree(params.mint)

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
              <div className="img-box">
                <img src={info?.externalMetadata?.image} alt={info?.externalMetadata?.image || ''} />
              </div>
              {/* <NFTShower
                data={{
                  jsonData: info?.externalMetadata,
                  injectTree: {
                    data: injectTree,
                    loading: injectTreeLoading,
                  },
                }}
              /> */}
            </div>
            <div className="right">
              {metadata && (
                <NFTHandler
                  metadata={metadata}
                  externalMetadata={info?.externalMetadata}
                  injectTree={{
                    data: injectTree,
                    loading: injectTreeLoading,
                  }}
                  refreshInject={reloadInjectTree}
                />
              )}
              <NFTShower
                data={{
                  externalMetadata: info?.externalMetadata,
                  injectTree: {
                    data: injectTree,
                    loading: injectTreeLoading,
                  },
                }}
              />
            </div>
          </>
        )) || <div className="tip">invalid NFT</div>}
      {/* {!injectTreeLoading && <ReactJson src={injectTree} />} */}
    </InfoWrapper>
  )
}
export default Info
const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  @media (max-width: ${MOBILE_BREAK_POINT}px) {
    flex-direction: column-reverse;
  }
  .left,
  .right {
    width: 50%;
    @media (max-width: ${MOBILE_BREAK_POINT}px) {
      width: 100%;
    }
  }
  .left {
    .img-box {
      box-sizing: border-box;
      border: 4px solid #222222;
      img {
        width: 100%;
      }
    }
  }
  .right {
    padding-left: 24px;
    box-sizing: border-box;
    @media (max-width: ${MOBILE_BREAK_POINT}px) {
      padding: 12px;
      background: #fff;
      margin-bottom: 12px;
      box-sizing: border-box;
    }
  }

  .tip {
    margin: 0 auto;
    margin-top: 40%;
  }
`
