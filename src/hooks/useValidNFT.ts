import { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

import type { Node as TreeNode } from '../synft'
import { Contract, BelongTo } from '../synft'
import { useContract } from '../provider/ContractProvider'

export default (mint: string | undefined) => {
  const { contract } = useContract()

  const [valid, setValid] = useState(true)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    ;(async () => {
      setChecking(true)
      if (!mint) {
        return
      }

      const mintKey = new PublicKey(mint)
      const result = await contract.checkValidNFT(mintKey)
      setValid(result)
      setChecking(false)
    })()
  }, [mint])

  return { valid, checking }
}
