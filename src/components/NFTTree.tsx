import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Graphin, { GraphinData, IG6GraphEvent, IUserEdge } from '@antv/graphin'
import { Node } from '../synft'
import { useNavigate } from 'react-router-dom'
import { NftDataItem } from './NFTList'
import { PublicKey } from '@solana/web3.js'
import LoadingIcon from './imgs/Loading.gif'
import { getMetadataInfoWithMint, lamportsToSol } from '../utils'
import { VIEW_LAMPORTS_DECIMAL } from '../utils/constants'
import { useConnection } from '@solana/wallet-adapter-react'
interface TreeNodeCustomData extends Node, NftDataItem {
  image: string
  name: string
}
interface TreeNode {
  id: string
  label?: any
  style?: any
  size?: any
  type?: string
  labelCfg?: any
  badges?: any
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
      curr: { mint, children, sol },
    } = injectNode
    if (!mint) return
    // 追加节点数据
    const node: TreeNode = {
      customData: injectNode,
      id: mint,
      size: 60,
      labelCfg: {
        position: 'bottom',
      },
      style: {
        label: {
          value: '',
        },
        keyshape: {
          size: 80,
          stroke: '#ccc',
          fill: '#fff',
        },
        icon: {
          type: 'image',
          value: LoadingIcon,
          size: [80, 80],
          clip: {
            r: 40,
          },
        },
        badges: [],
      },
    }
    if (sol?.lamports) {
      node.style = {
        ...node.style,
        badges: [
          {
            position: 'RT',
            type: 'text',
            value: lamportsToSol(sol.lamports).toFixed(VIEW_LAMPORTS_DECIMAL) + ' SOL',
            fill: '#fff',
            stroke: 'red',
            color: 'red',
            size: [70, 25],
            offset: [-62, 0],
          },
        ],
      }
    }
    nodes.push(node)
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
  height?: number // 画布高度 (最好是根据上层盒子进行调整)
}
const NFTTree: React.FC<Props> = (props: Props) => {
  const navigate = useNavigate()
  const { data: injectTree, height = 500 } = props
  const { nodes, edges } = injectTreeToGraphinDagreTree(injectTree)
  console.log('nodes', nodes)

  const graphinRef = React.createRef<Graphin>()
  const [treeData, setTreeData] = useState({ nodes, edges })
  const { connection } = useConnection()

  // 通过节点中源数据获取nft数据
  useEffect(() => {
    ;(async () => {
      const promises = nodes.map(async (item: TreeNode) => {
        const { mint } = item.customData.curr
        const mintKey = new PublicKey(mint as string)
        const data = await getMetadataInfoWithMint(mintKey, connection)
        // 将元信息添加到节点的自定义数据中
        const customData = { ...item.customData, curr: { ...item.customData.curr, ...data?.externalMetadata } }
        return { ...item, customData }
      })
      const nodesRes = await Promise.allSettled(promises)
      const newNodes = nodesRes.map((v: any) => {
        const newNode = v.value
        return {
          ...newNode,
          style: {
            ...newNode?.style,
            icon: { ...newNode.style?.icon, value: newNode.customData.curr?.image || newNode.img },
            label: { ...v.style?.label, value: newNode.customData.curr.name },
          },
        }
      })
      setTreeData({ nodes: newNodes, edges })
    })()
  }, [injectTree, connection])
  const treeDataJson = JSON.stringify(treeData)
  useEffect(() => {
    const handleClick = (evt: IG6GraphEvent) => {
      const node = evt.item
      const customData = node?._cfg?.model?.customData as TreeNodeCustomData
      navigate(`/info/${customData.curr.mint}`)
    }
    // 监听节点点击事件
    if (graphinRef.current) {
      console.log('treeDataJson', treeData)

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
        height={height}
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
