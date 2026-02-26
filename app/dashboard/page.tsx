"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { signOut } from "next-auth/react"

interface Reflection {
  id: string
  summary: string
  themes: string[]
  reflectionQ: string
  messageCount: number
  generatedAt: string
}

// How long after a refresh before the user can refresh again (1 hour)
const REFRESH_COOLDOWN_MS = 60 * 60 * 1000

function JourneySection({ userId }: { userId: string }) {
  const [reflection, setReflection] = useState<Reflection | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [reason, setReason] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<number>(0)

  const load = useCallback(async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const url = forceRefresh ? '/api/reflection?refresh=true' : '/api/reflection'
      const res = await fetch(url)
      const data = await res.json()

      if (data.reflection) {
        setReflection(data.reflection)
        setReason(null)
      } else {
        setReason(data.reason ?? 'unknown')
      }

      if (forceRefresh) setLastRefresh(Date.now())
    } catch (e) {
      console.error('Failed to load reflection:', e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const canRefresh = Date.now() - lastRefresh > REFRESH_COOLDOWN_MS

  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-lg">🌿</div>
          <h2 className="text-sm font-semibold text-slate-700">Your Journey</h2>
        </div>
        <div className="space-y-2.5">
          <div className="h-3.5 bg-slate-100 rounded-full w-full animate-pulse" />
          <div className="h-3.5 bg-slate-100 rounded-full w-5/6 animate-pulse" />
          <div className="h-3.5 bg-slate-100 rounded-full w-4/6 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!reflection) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-lg">🌿</div>
          <h2 className="text-sm font-semibold text-slate-700">Your Journey</h2>
        </div>
        <p className="text-sm text-slate-500 leading-relaxed">
          {reason === 'not_enough_data'
            ? "Once you've had a few exchanges with one of the therapists, a personal reflection of your journey will appear here — themes you've explored, patterns you've touched on, and a question to sit with."
            : "Start a conversation with any of the therapists in Messages to begin building your personal journal."}
        </p>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <span className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
          Reflections are generated privately and only visible to you
        </div>
      </div>
    )
  }

  const generatedDate = new Date(reflection.generatedAt)
  const daysAgo = Math.floor((Date.now() - generatedDate.getTime()) / (1000 * 60 * 60 * 24))
  const dateLabel = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 overflow-hidden">

      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-lg">🌿</div>
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Your Journey</h2>
            <p className="text-xs text-slate-400 mt-0.5">Personal reflection — only visible to you</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">{dateLabel}</span>
          <button
            onClick={() => load(true)}
            disabled={refreshing || !canRefresh}
            title={canRefresh ? 'Refresh reflection' : 'You can refresh once per hour'}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
              canRefresh && !refreshing
                ? 'border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
                : 'border-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="px-6 py-5">
        <p className="text-sm text-slate-700 leading-7 font-light italic">
          "{reflection.summary}"
        </p>
      </div>

      {/* Themes */}
      {reflection.themes && reflection.themes.length > 0 && (
        <div className="px-6 pb-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Themes you've explored</p>
          <div className="flex flex-wrap gap-2">
            {(reflection.themes as string[]).map((theme, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 font-medium"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reflection question */}
      <div className="mx-6 mb-6 bg-slate-50 border border-slate-200 rounded-xl px-5 py-4">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Something to sit with</p>
        <p className="text-sm text-slate-600 leading-relaxed">
          {reflection.reflectionQ}
        </p>
      </div>

      {/* Footer */}
      <div className="px-6 pb-4 flex items-center gap-1.5 text-xs text-slate-400">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Based on {reflection.messageCount} messages across your sessions · Updates automatically every week
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login")
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-sky-200 border-t-sky-600 mx-auto"></div>
          <p className="mt-4 text-slate-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!session?.user) return null

  const user = session.user

  return (
    <div className="min-h-screen bg-[#f0f4f8]">

      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-sky-700 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-base">MindBridge</span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm text-slate-500 hover:text-slate-700 font-medium"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back{user.username ? `, ${user.username}` : ""}
          </h1>
          <p className="text-slate-500 text-sm mt-1">What would you like to do today?</p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          <button
            onClick={() => router.push("/match")}
            className="group bg-sky-700 text-white rounded-2xl p-6 text-left hover:bg-sky-800 transition-colors shadow-sm"
          >
            <div className="text-3xl mb-4">🧠</div>
            <div className="font-semibold text-base">Find a Therapist</div>
            <div className="text-sky-200 text-sm mt-1">Answer a short questionnaire and get matched</div>
          </button>

          <button
            onClick={() => router.push("/messages")}
            className="group bg-white border border-slate-200 rounded-2xl p-6 text-left hover:border-sky-300 hover:shadow-sm transition-all"
          >
            <div className="text-3xl mb-4">💬</div>
            <div className="font-semibold text-slate-800 text-base">My Conversations</div>
            <div className="text-slate-500 text-sm mt-1">Continue chatting with your therapist</div>
          </button>

          <button
            onClick={() => router.push("/feed")}
            className="group bg-white border border-slate-200 rounded-2xl p-6 text-left hover:border-sky-300 hover:shadow-sm transition-all"
          >
            <div className="text-3xl mb-4">📋</div>
            <div className="font-semibold text-slate-800 text-base">Wellbeing Feed</div>
            <div className="text-slate-500 text-sm mt-1">Tips and support from our community</div>
          </button>
        </div>

        {/* Your Journey */}
        <JourneySection userId={user.id ?? ''} />

        {/* Account info */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">Account Details</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Email</span>
              <span className="text-slate-800 font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Username</span>
              <span className="text-slate-800 font-medium">@{user.username}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Subscription</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200 capitalize">
                {user.subscriptionTier}
              </span>
            </div>
          </div>
        </div>

        {/* Crisis line */}
        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700 text-center">
          <strong>Need immediate help?</strong> Call Samaritans free on <strong>116 123</strong> (UK) or <strong>988</strong> (US) — available 24/7.
        </div>
      </div>
    </div>
  )
}
