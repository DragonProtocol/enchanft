/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-18 14:39:29
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-19 15:45:26
 * @Description: file description
 */
import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { checkValidNFT } from '../utils/metadata'

export default (mint: string | undefined) => {
  const { connection } = useConnection()

  const [valid, setValid] = useState(true)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    ;(async () => {
      setChecking(true)
      if (!mint) {
        return
      }

      const mintKey = new PublicKey(mint)
      const result = await checkValidNFT(mintKey, connection)
      setValid(result)
      setChecking(false)
    })()
  }, [mint])

  return { valid, checking }
}
