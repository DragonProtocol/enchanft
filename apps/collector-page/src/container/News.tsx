import React from 'react'
import styled from 'styled-components'
import CardBox from '../components/common/card/CardBox'
import { ORBIS_GROUP_ID } from '../constants'
import { OrbisChannelComponent, OrbisGroupComponent } from '@ecnft/orbis-component/'
import { useParams } from 'react-router-dom'

export default function Guide() {
  const { orbis_channel_id } = useParams()
  return (
    <NewsContainer>
      {orbis_channel_id ?
       <OrbisChannelComponent group_id={ORBIS_GROUP_ID} channel_id={orbis_channel_id} routePrefix={'/news'} showNav={false} /> 
       :
       <OrbisGroupComponent group_id={ORBIS_GROUP_ID} routePrefix={'/news'} showNav={false} />
      }
    </NewsContainer>
  )
}

const NewsContainer = styled(CardBox)`
  height: calc(100vh - 72px - 40px - 72px);
`
