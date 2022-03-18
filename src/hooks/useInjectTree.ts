import { Connection, PublicKey } from '@solana/web3.js'
import log from 'loglevel'
import { useEffect, useState } from 'react'
import { useContract } from '../provider/ContractProvider'

import { Contract, Node } from '../synft'

export default (mint: string | undefined) => {
  const { contract } = useContract()
  const [loading, setLoading] = useState(false)
  const [injectTree, setInjectTree] = useState<Node>({
    curr: {
      mint,
      sol: null,
      children: [],
    },
    parent: null,
  })
  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (!mint) return
      const mintKey = new PublicKey(mint)
      const tree = await contract.getInjectTree(mintKey)
      log.info('getInjectTree', tree)
      setInjectTree(tree)
      setLoading(false)
    })()
  }, [mint])

  return { injectTree, loading }
}
