import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

import { getMetadataFromMint } from '../features/info/infoOps'

export default (mintKeys: PublicKey[], connection: Connection) => {
  const [status, setStatus] = useState('idle')
  // TODO: any 解决
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setStatus('fetching')
      // TODO: cache
      const fetches = mintKeys.map(async (item) => {
        const metadata = await getMetadataFromMint(connection, item)
        const response = await fetch(metadata.data.data.uri)
        const jsonData = await response.json()
        return jsonData
      })
      const results = await Promise.all(fetches)
      setData(results)
      setStatus('fetched')
    }
    if (status !== 'fetching') fetchData()
  }, [connection, mintKeys])

  return { status, data }
}
