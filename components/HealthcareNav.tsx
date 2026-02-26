"use client"

import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

interface NavProps {
  showBack?: boolean
  backLabel?: string
  backHref?: string
  title?: string
  actions?: React.ReactNode
}

export default function HealthcareNav({ showBack, backLabel, backHref, title, actions }: NavProps) {
  const router = useRouter()

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={() => backHref ? router.push(backHref) : router.back()}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {backLabel || "Back"}
            </button>
          )}
          <button onClick={() => router.push("/")} className="flex items-center gap-2">
            <div className="w-7 h-7 bg-sky-700 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-base">MindBridge</span>
          </button>
          {title && (
            <>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-medium text-sm">{title}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {actions}
        </div>
      </div>
    </nav>
  )
}
