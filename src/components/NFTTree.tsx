import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Graphin, { GraphinData, IG6GraphEvent, IUserEdge } from '@antv/graphin'
import { Contract, Node } from '../synft'
import { useNavigate } from 'react-router-dom'
import { NftDataItem } from './NFTList'
import { PublicKey } from '@solana/web3.js'
import LoadingIcon from './imgs/Loading.gif'
interface TreeNodeCustomData extends Node, NftDataItem {
  image: string
  name: string
}
interface TreeNode {
  id: string
  label?: any
  style?: any
  size?: any
  type: string
  labelCfg?: any
  clipCfg?: any
  img?: any
  customData: TreeNodeCustomData
}
interface GraphinDagreTree extends GraphinData {
  nodes: TreeNode[]
  edges: IUserEdge[]
}
const injectTreeToGraphinDagreTree = (injectTree: Node): GraphinDagreTree => {
  const nodes: TreeNode[] = []
  const edges: IUserEdge[] = []
  const pushNodeEdge = (injectNode: any) => {
    const {
      curr: { mint, children },
    } = injectNode
    if (!mint) return
    // 追加节点数据
    nodes.push({
      customData: injectNode,
      id: mint,
      type: 'image',
      img: LoadingIcon,
      label: '',
      size: 60,
      labelCfg: {
        position: 'bottom',
      },
    })
    // 如果有子集，追加连线数据
    if (children.length) {
      for (const child of children) {
        if (!child.curr.mint) continue
        edges.push({
          source: mint,
          target: child.curr.mint,
        })
        pushNodeEdge(child)
      }
    }
    return
  }
  pushNodeEdge(injectTree)
  return { nodes, edges }
}
interface Props {
  data: Node
  height: number
}
const NFTTree: React.FC<Props> = (props: Props) => {
  const navigate = useNavigate()
  const { data: injectTree, height } = props
  const { nodes, edges } = injectTreeToGraphinDagreTree(injectTree)
  const graphinRef = React.createRef<Graphin>()
  const [treeData, setTreeData] = useState({ nodes, edges })
  const contract = Contract.getInstance()

  // 通过节点中源数据获取nft数据
  useEffect(() => {
    ;(async () => {
      const promises = nodes.map(async (item: TreeNode) => {
        const { mint } = item.customData.curr
        const mintKey = new PublicKey(mint as string)
        const data = await contract.getMetadataInfoWithMint(mintKey)
        // 将元信息添加到节点的自定义数据中
        const customData = { ...item.customData, curr: { ...item.customData.curr, ...data?.externalMetadata } }
        return { ...item, customData }
      })
      const nodesRes = await Promise.allSettled(promises)
      const newNodes = nodesRes.map((v: any) => ({
        ...v.value,
        label: v.value.customData.curr.name,
        img: v.value.customData.curr?.image || v.value.img,
      }))
      setTreeData({ nodes: newNodes, edges })
    })()
  }, [injectTree])
  useEffect(() => {
    const handleClick = (evt: IG6GraphEvent) => {
      const node = evt.item
      const customData = node?._cfg?.model?.customData as TreeNodeCustomData
      navigate(`/info/${customData.curr.mint}`)
    }
    // 监听节点点击事件
    if (graphinRef.current) {
      // 调用render强制执行一次渲染 （不加这个的话图片有时候会渲染不出来，可能是graphin内部数据检查机制的问题）
      graphinRef.current.graph.render()
      graphinRef.current.graph.on('node:click', handleClick)
    }
    return () => {
      if (graphinRef.current) {
        graphinRef.current.graph.off('node:click', handleClick)
      }
    }
  }, [graphinRef.current, treeData])
  return (
    <NFTTreeWrapper>
      <Graphin
        re
        height={height || 500}
        data={treeData}
        layout={{
          type: 'dagre',
          ranksep: 20,
        }}
        ref={graphinRef}
        fitView={true}
      ></Graphin>
    </NFTTreeWrapper>
  )
}
export default NFTTree
const NFTTreeWrapper = styled.div`
  width: 100%;
`
