"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface Persona {
  id: string
  name: string
  username: string
  bio: string
  avatarUrl: string | null
}

const SPECIALTY_META: Record<string, { label: string; bg: string; text: string; ring: string; badge: string }> = {
  dr_sarah_heals:       { label: "Trauma Counsellor",        bg: "bg-emerald-600", text: "text-white", ring: "ring-emerald-100", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  dr_james_grief:       { label: "Grief Counsellor",         bg: "bg-amber-500",   text: "text-white", ring: "ring-amber-100",   badge: "bg-amber-50 text-amber-700 border-amber-200" },
  dr_rachel_cbt:        { label: "CBT Therapist",            bg: "bg-violet-600",  text: "text-white", ring: "ring-violet-100",  badge: "bg-violet-50 text-violet-700 border-violet-200" },
  dr_priya_anxiety:     { label: "Anxiety & Stress",         bg: "bg-sky-600",     text: "text-white", ring: "ring-sky-100",     badge: "bg-sky-50 text-sky-700 border-sky-200" },
  dr_marcus_depression: { label: "Depression Specialist",    bg: "bg-blue-600",    text: "text-white", ring: "ring-blue-100",    badge: "bg-blue-50 text-blue-700 border-blue-200" },
  dr_olivia_relate:     { label: "Relationship Therapist",   bg: "bg-rose-500",    text: "text-white", ring: "ring-rose-100",    badge: "bg-rose-50 text-rose-700 border-rose-200" },
  dr_viktor_psych:      { label: "Psychoanalyst",            bg: "bg-slate-700",   text: "text-white", ring: "ring-slate-200",   badge: "bg-slate-100 text-slate-700 border-slate-300" },
}

function initials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function MessagesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  useEffect(() => {
    if (status === "authenticated") loadPersonas()
  }, [status])

  const loadPersonas = async () => {
    try {
      const response = await fetch("/api/personas")
      const data = await response.json()
      setPersonas(data.personas || [])
    } catch (error) {
      console.error("Failed to load personas:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-sky-200 border-t-sky-600 mx-auto"></div>
          <p className="mt-4 text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const therapists = personas.filter(p => SPECIALTY_META[p.username])
  const others = personas.filter(p => !SPECIALTY_META[p.username])

  return (
    <div className="min-h-screen bg-[#f0f4f8]">

      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/dashboard")} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Dashboard
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-sky-700 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="font-bold text-slate-800 text-base">MindBridge</span>
            </div>
          </div>
          <button
            onClick={() => router.push("/match")}
            className="text-sm font-medium bg-sky-700 text-white px-4 py-2 rounded-lg hover:bg-sky-800 transition-colors"
          >
            Find a Therapist
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Your Conversations</h1>
          <p className="text-slate-500 text-sm mt-1">Select a professional to start or continue a session</p>
        </div>

        {/* Therapists */}
        {therapists.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Mental Health Professionals</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {therapists.map((persona) => {
                const meta = SPECIALTY_META[persona.username]
                return (
                  <button
                    key={persona.id}
                    onClick={() => router.push(`/messages/${persona.id}`)}
                    className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-sky-300 hover:shadow-sm transition-all text-left flex items-start gap-4 group"
                  >
                    {/* Initial avatar */}
                    <div className={`w-12 h-12 rounded-xl ${meta.bg} ${meta.text} flex items-center justify-center text-sm font-bold flex-shrink-0 ring-4 ${meta.ring}`}>
                      {initials(persona.name)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-slate-900 text-sm">{persona.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${meta.badge}`}>{meta.label}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{persona.bio}</p>
                    </div>

                    <svg className="w-4 h-4 text-slate-300 group-hover:text-slate-400 flex-shrink-0 mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* General personas */}
        {others.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Community</h2>
            <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 shadow-sm">
              {others.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => router.push(`/messages/${persona.id}`)}
                  className="w-full p-5 hover:bg-slate-50 transition flex items-center gap-4 text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                    {persona.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-sm">{persona.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{persona.bio}</p>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
