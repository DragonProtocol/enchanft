import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

export default function NFTShower({ uri, mint, addr }: { uri: string; mint: string; addr: string }) {
  const [info, setInfo] = useState<any>({})
  const aliveRef = useRef(true)
  useEffect(() => {
    if (!uri) return
    ;(async () => {
      try {
        const response = await fetch(uri)
        const jsonData = await response.json()
        if (aliveRef.current) setInfo(jsonData)
      } catch (error) {
        if (aliveRef.current) console.error(error)
      }
    })()
  }, [uri])
  useEffect(() => {
    return () => {
      aliveRef.current = false
    }
  }, [])
  return (
    <div style={{ display: 'flex', margin: '10px' }}>
      <img style={{ width: '200px' }} src={info.image} alt={info.name} />
      <div>
        <p>name: {info.name}</p>
        <p>description: {info.description}</p>
        <p>uri: {uri}</p>
        <p>collection: {JSON.stringify(info.collection)}</p>
        <p>addr: {addr}</p>
        <Link style={{ display: 'block', margin: '1rem 0' }} to={`/info/${mint}/${addr}`}>
          {mint}
        </Link>
      </div>
    </div>
  )
}
