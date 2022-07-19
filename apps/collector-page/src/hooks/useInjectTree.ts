/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-18 14:39:28
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-07-19 15:45:11
 * @Description: file description
 */
import { useSynftContract } from '@ecnft/js-sdk-react'
import { PublicKey } from '@solana/web3.js'
import log from 'loglevel'
import { useEffect, useState } from 'react'

import { Node } from '../types/synft'
import { getInjectTree } from '../utils/metadata'

/**
 * 获取注入的 NFT tree 列表
 */
export default (mint: string | undefined) => {
  const { synftContract } = useSynftContract()
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
