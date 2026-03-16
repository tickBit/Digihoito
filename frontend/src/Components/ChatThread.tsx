import { useEffect, useState } from "react"
import { useChatThread } from "../hooks/useChatThread"

interface Props {
  caseId: string
}

export default function ChatThread({ caseId }: Props) {

  const { caseData, loading, error, fetchCase, sendMessage } = useChatThread(caseId)

  const [message, setMessage] = useState("")

  useEffect(() => {

    fetchCase(caseId)

    const interval = setInterval(() => {
        fetchCase(caseId)
    }, 5000)

    return () => clearInterval(interval)

  }, [caseId, fetchCase])

  const handleSend = async () => {

    if (!message.trim()) return

    await sendMessage(message)

    setMessage("")
  }
  
  if (loading) return <div>Loading...</div>

  if (error) return <div>Error: {error}</div>

  return (
    <div>

      <h2>Chat</h2>

      <div style={{border: "1px solid #ccc", padding: 10}}>

        {caseData?.messages.map(m => (
          <div key={m.id}>
            <b>{m.senderRole}</b>: {m.content}
          </div>
        ))}

      </div>

      <div style={{marginTop: 10}}>

        <input
          value={message}
          onChange={e => setMessage(e.target.value)}
        />

        <button onClick={handleSend}>
          Send
        </button>

      </div>

    </div>
  )
}