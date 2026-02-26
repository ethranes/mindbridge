"use client"

import { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { PHASE_ORDER, getProgressPercent, CBT_PHASES, type CBTPhase } from "@/lib/ai/cbt-framework"
import { PSYCHO_PHASE_ORDER, getPsychoProgressPercent, PSYCHO_PHASES, type PsychoPhase } from "@/lib/ai/psychoanalytic-framework"

interface Message {
  id: string
  content: string
  createdAt: string
  senderPersonaId: string
  sender: { id: string; name: string; username: string }
}

interface Persona {
  id: string
  name: string
  username: string
  bio: string
}

interface SessionState {
  frameworkType: string
  currentPhase: string
  completedAt: string | null
}

const SPECIALTY_META: Record<string, { label: string; bg: string; text: string; ring: string }> = {
  dr_sarah_heals:       { label: "Trauma Counsellor",        bg: "bg-emerald-600", text: "text-white", ring: "ring-emerald-100" },
  dr_james_grief:       { label: "Grief Counsellor",         bg: "bg-amber-500",   text: "text-white", ring: "ring-amber-100"   },
  dr_rachel_cbt:        { label: "CBT Therapist",            bg: "bg-violet-600",  text: "text-white", ring: "ring-violet-100"  },
  dr_priya_anxiety:     { label: "Anxiety & Stress",         bg: "bg-sky-600",     text: "text-white", ring: "ring-sky-100"     },
  dr_marcus_depression: { label: "Depression Specialist",    bg: "bg-blue-600",    text: "text-white", ring: "ring-blue-100"    },
  dr_olivia_relate:     { label: "Relationship Therapist",   bg: "bg-rose-500",    text: "text-white", ring: "ring-rose-100"    },
  dr_viktor_psych:      { label: "Psychoanalyst",            bg: "bg-slate-700",   text: "text-white", ring: "ring-slate-200"   },
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// --- CBT progress bar --------------------------------------------------------

function CBTProgressBar({ currentPhase, completedAt }: { currentPhase: string; completedAt: string | null }) {
  const currentIdx = PHASE_ORDER.indexOf(currentPhase as CBTPhase)
  const isComplete = !!completedAt || currentPhase === 'complete'
  const progressPct = getProgressPercent(currentPhase as CBTPhase)

  return (
    <div className="bg-sky-50 border-b border-sky-200 px-5 py-3">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-sky-700 uppercase tracking-wide">
            CBT Thought Record
          </span>
          <span className="text-xs text-sky-600 font-medium">
            {isComplete ? '✓ Complete' : `Step ${Math.max(currentIdx, 0) + 1} of ${PHASE_ORDER.length}`}
          </span>
        </div>
        <div className="h-1.5 bg-sky-200 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-sky-600 rounded-full transition-all duration-700"
            style={{ width: `${isComplete ? 100 : progressPct}%` }}
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {CBT_PHASES.map((phase, idx) => {
            const done = idx < currentIdx
            const active = idx === currentIdx && !isComplete
            return (
              <div
                key={phase.id}
                className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                  isComplete
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : done
                    ? 'bg-sky-100 text-sky-700 border border-sky-200'
                    : active
                    ? 'bg-sky-600 text-white border border-sky-600'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                {done && !isComplete ? '✓ ' : ''}{phase.label}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// --- Psychoanalytic progress bar ---------------------------------------------

function PsychoProgressBar({ currentPhase }: { currentPhase: string }) {
  const currentIdx = PSYCHO_PHASE_ORDER.indexOf(currentPhase as PsychoPhase)
  const isClosing = currentPhase === 'closing'
  const progressPct = getPsychoProgressPercent(currentPhase as PsychoPhase)

  return (
    <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Analytic Session
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {PSYCHO_PHASES[currentIdx]?.description ?? 'Session in progress'}
          </span>
        </div>
        <div className="h-1 bg-slate-200 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-slate-500 rounded-full transition-all duration-1000"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex gap-1 flex-wrap">
          {PSYCHO_PHASES.map((phase, idx) => {
            const past = idx < currentIdx
            const active = idx === currentIdx
            return (
              <div
                key={phase.id}
                className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                  past
                    ? 'bg-slate-200 text-slate-500 border border-slate-200'
                    : active
                    ? 'bg-slate-700 text-white border border-slate-700'
                    : 'bg-white text-slate-300 border border-slate-200'
                }`}
              >
                {phase.label}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// --- Main chat page ----------------------------------------------------------

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const personaId = params.personaId as string

  const [persona, setPersona] = useState<Persona | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [userPersonaId, setUserPersonaId] = useState<string>("")
  const [sessionState, setSessionState] = useState<SessionState | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated" && personaId) loadConversation()
  }, [status, personaId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const loadConversation = async () => {
    try {
      const response = await fetch(`/api/conversations/${personaId}`)
      const data = await response.json()
      if (data.error) { console.error(data.error); return }
      setPersona(data.persona)
      setMessages(data.messages || [])
      setUserPersonaId(data.userPersonaId)
      setSessionState(data.sessionState || null)
    } catch (error) {
      console.error("Failed to load conversation:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    setSending(true)
    const messageContent = newMessage
    setNewMessage("")

    try {
      const response = await fetch(`/api/conversations/${personaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageContent }),
      })
      const data = await response.json()
      if (data.error) { console.error(data.error); setNewMessage(messageContent); return }
      setMessages(prev => [...prev, data.userMessage, data.aiMessage])
      if (data.sessionState) setSessionState(data.sessionState)
    } catch (error) {
      console.error("Failed to send message:", error)
      setNewMessage(messageContent)
    } finally {
      setSending(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-sky-200 border-t-sky-600 mx-auto"></div>
          <p className="mt-4 text-slate-500 text-sm">Loading your session...</p>
        </div>
      </div>
    )
  }

  if (!session || !persona) return null

  const meta = SPECIALTY_META[persona.username]
  const isCBT = sessionState?.frameworkType === 'cbt_thought_record'
  const isPsycho = sessionState?.frameworkType === 'psychoanalytic_session'

  return (
    <div className="h-screen flex flex-col bg-[#f0f4f8]">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 py-3.5 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => router.push("/messages")}
          className="text-slate-400 hover:text-slate-700 transition-colors"
          aria-label="Back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ring-4 ${meta ? `${meta.bg} ${meta.text} ${meta.ring}` : 'bg-sky-600 text-white ring-sky-100'}`}>
          {initials(persona.name)}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-slate-900 text-sm leading-tight">{persona.name}</h2>
          <p className="text-xs text-sky-600 font-medium">{meta ? meta.label : `@${persona.username}`}</p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          Online
        </div>
      </div>

      {/* Framework progress bars */}
      {isCBT && sessionState && (
        <CBTProgressBar
          currentPhase={sessionState.currentPhase}
          completedAt={sessionState.completedAt}
        />
      )}
      {isPsycho && sessionState && (
        <PsychoProgressBar currentPhase={sessionState.currentPhase} />
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 px-5 py-2 text-center">
        <p className="text-xs text-amber-700">
          AI-assisted support -- not a replacement for clinical care.
          {" "}<strong>In crisis?</strong> Call <strong>116 123</strong> (UK) or <strong>988</strong> (US)
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold mb-5 ring-4 ${meta ? `${meta.bg} ${meta.text} ${meta.ring}` : 'bg-sky-600 text-white ring-sky-100'}`}>
              {initials(persona.name)}
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {isCBT
                ? "Begin your CBT session"
                : isPsycho
                ? "Begin your analytic session"
                : `Start your session with ${persona.name}`}
            </h3>
            <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
              {isCBT
                ? "Dr. Rachel will guide you through a structured thought record -- a powerful CBT technique for examining unhelpful thinking."
                : isPsycho
                ? "Dr. Adler will invite you into free association -- say whatever comes to mind, without censorship or selection."
                : persona.bio}
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isUser = message.senderPersonaId === userPersonaId
            return (
              <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[72%] ${isUser ? "order-2" : "order-1"}`}>
                  {!isUser && (
                    <p className="text-xs text-slate-400 mb-1 px-1 font-medium">{message.sender.name}</p>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      isUser
                        ? "bg-sky-700 text-white rounded-br-sm"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 px-1">
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            )
          })
        )}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-slate-200 px-5 py-4">
        <form onSubmit={sendMessage} className="flex gap-3 items-end">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={
              isCBT
                ? "Share your thoughts..."
                : isPsycho
                ? "Say whatever comes to mind..."
                : `Message ${persona.name}...`
            }
            disabled={sending}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent disabled:opacity-50 text-sm bg-slate-50"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-5 py-3 bg-sky-700 text-white rounded-xl hover:bg-sky-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
