import { useEffect, useRef, useState } from "react"

export const useWebSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<string | null>(null)
  const ws = useRef<WebSocket | null>(null)

  const connect = () => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(url)

    ws.current.onopen = () => setIsConnected(true)
    ws.current.onclose = () => setIsConnected(false)
    ws.current.onmessage = (event) => setLastMessage(event.data)
    ws.current.onerror = (error) => console.error('WebSocket Error:', error)
  }

  const disconnect = () => {
    ws.current?.close()
  }

  useEffect(() => {
    return () => ws.current?.close()
  }, [])

  return { isConnected, lastMessage, connect, disconnect }
}
