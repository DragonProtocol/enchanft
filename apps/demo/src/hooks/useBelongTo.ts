/**
 *Author: ttang
 *Date: 2022-03-23 13:38:27
 *LastEditTime: 2022-03-23 13:59:41
 *LastEditors: ttang
 *Description: 获取当前 NFT 的所属情况
 *FilePath: /app/src/hooks/useBelongTo.ts
 */

import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useSynftContract } from '@ecnft/js-sdk-react'

import { BelongTo, Node as TreeNode } from '../synft'
import { checkBelongTo } from '../utils'

export default (mint: string | undefined, injectTree: TreeNode) => {
  const {synftContract} = useSynftContract()
  const {publicKey} = useWallet()
  const { connection } = useConnection()

  const [loading, setLoading] = useState(true)
  const [belong, setBelong] = useState<BelongTo>({
    me: false,
    program: false,
    parent: null,
  })

  useEffect(() => {
    ;(async () => {
      if (!mint || !publicKey) {
        return
      }
      const mintKey = new PublicKey(mint)
      const data: BelongTo = await checkBelongTo(synftContract, mintKey, publicKey, connection)
      setLoading(false)
      setBelong(data)
    })()
  }, [mint, publicKey, injectTree])

  return { belong, loading }
}
