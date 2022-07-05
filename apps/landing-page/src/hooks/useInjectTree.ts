import { useSynftContract } from '@ecnft/js-sdk-react'
import { PublicKey } from '@solana/web3.js'
import log from 'loglevel'
import { useEffect, useState } from 'react'

import { Node } from '../synft'
import { getInjectTree } from '../utils'

/**
 * 获取注入的 NFT tree 列表
 */
export default (mint: string | undefined) => {
  const {synftContract} = useSynftContract()
  const [loading, setLoading] = useState(false)
  const [injectTree, setInjectTree] = useState<Node>({
    curr: {
      mint,
      rootPDA: undefined,
      sol: null,
      children: [],
    },
    parent: null,
  })
  useEffect(() => {
    refresh()
  }, [mint])

  const refresh = async () => {
    setLoading(true)
    if (!mint) return
    const mintKey = new PublicKey(mint)
    const tree = await getInjectTree(synftContract, mintKey)
    log.info('getInjectTree', tree)
    if (tree) setInjectTree(tree)
    setLoading(false)
  }

  return { injectTree, loading, refresh }
}
