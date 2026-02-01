export interface ConversationEntry { role: 'user' | 'assistant'; content: string; timestamp: string }

export interface ChatRequest {
  message: string
  conversation_history?: ConversationEntry[]
  collected_data?: Record<string, any>
  session_id?: string
}

export interface ChatResponse {
  response: string
  collected_data: Record<string, any>
  completion_percentage: number
  is_complete: boolean
  next_expected_field?: string
  conversation_history: ConversationEntry[]
  processing_time: number
  medical_flags: string[]
  model_used?: string
  session_id?: string
}

const API_BASE = '/api'

export async function startConversation(): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/start-conversation`, { method: 'POST' })
  if (!res.ok) throw new Error(`Start failed: ${res.status} ${res.statusText}`)
  return res.json()
}

export async function sendChat(payload: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Chat failed: ${res.status} ${res.statusText} - ${text}`)
  }

  return res.json()
}
