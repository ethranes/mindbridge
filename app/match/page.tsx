"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const QUESTIONS = [
  {
    id: "mood",
    section: "Mood & Emotions",
    question: "How would you describe your overall mood recently?",
    options: [
      { label: "Very low — I feel empty or hopeless most of the time", value: "mood_very_low" },
      { label: "Low — I've been feeling down more often than not", value: "mood_low" },
      { label: "Moderate — I have good and bad days", value: "mood_moderate" },
      { label: "Good — I'm generally feeling okay", value: "mood_good" },
      { label: "Great — I feel positive and balanced", value: "mood_great" },
    ],
  },
  {
    id: "sleep",
    section: "Sleep & Energy",
    question: "How has your sleep and energy been lately?",
    options: [
      { label: "Very poor — I'm exhausted and barely sleeping", value: "sleep_very_poor" },
      { label: "Poor — I struggle to sleep and feel drained", value: "sleep_poor" },
      { label: "Moderate — Some nights are difficult", value: "sleep_moderate" },
      { label: "Good — I mostly sleep and rest well", value: "sleep_good" },
      { label: "Great — I feel well-rested and energised", value: "sleep_great" },
    ],
  },
  {
    id: "anxiety",
    section: "Anxiety Levels",
    question: "How much anxiety or worry have you been experiencing?",
    options: [
      { label: "Severe — I feel anxious almost constantly and it's overwhelming", value: "anxiety_severe" },
      { label: "High — I worry a lot and it affects my daily life", value: "anxiety_high" },
      { label: "Moderate — I have anxious periods but can manage", value: "anxiety_moderate" },
      { label: "Mild — I occasionally feel anxious but it's manageable", value: "anxiety_mild" },
      { label: "None — I rarely feel anxious", value: "anxiety_none" },
    ],
  },
  {
    id: "trauma",
    section: "Past Trauma",
    question: "Have you experienced any traumatic events that still affect you?",
    options: [
      { label: "Yes, severely — I think about it often and it significantly impacts my life", value: "trauma_severe" },
      { label: "Yes, moderately — It still affects me but I manage day to day", value: "trauma_moderate" },
      { label: "Yes, mildly — I've experienced trauma but it doesn't heavily affect me now", value: "trauma_mild" },
      { label: "No — I haven't experienced significant trauma", value: "trauma_none" },
    ],
  },
  {
    id: "relationships",
    section: "Relationships",
    question: "How would you describe your relationships with others?",
    options: [
      { label: "Very poor — I feel isolated and my relationships are causing me serious distress", value: "relationships_very_poor" },
      { label: "Poor — I'm struggling with conflict or loneliness", value: "relationships_poor" },
      { label: "Moderate — Some strain but I have some support", value: "relationships_moderate" },
      { label: "Good — My relationships are generally healthy", value: "relationships_good" },
      { label: "Great — I feel well connected and supported", value: "relationships_great" },
    ],
  },
  {
    id: "life_events",
    section: "Life Events",
    question: "Have any significant life events happened recently?",
    options: [
      { label: "Bereavement — I've lost someone close to me", value: "life_events_bereavement" },
      { label: "Separation or divorce", value: "life_events_separation" },
      { label: "Job loss or major financial stress", value: "life_events_job_loss" },
      { label: "Other major life change (moving, health diagnosis, etc.)", value: "life_events_major_change" },
      { label: "Nothing significant recently", value: "life_events_none" },
    ],
  },
]

interface Professional {
  id: string
  name: string
  username: string
  bio: string
  score: number
  specialtyLabel: string
}

export default function MatchPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [results, setResults] = useState<Professional[] | null>(null)
  const [loading, setLoading] = useState(false)

  const question = QUESTIONS[currentQuestion]
  const progress = ((currentQuestion) / QUESTIONS.length) * 100

  const handleAnswer = async (value: string) => {
    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Submit
      setLoading(true)
      try {
        const res = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: Object.values(newAnswers) }),
        })
        const data = await res.json()
        setResults(data.ranked)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion(currentQuestion - 1)
  }

  const handleRestart = () => {
    setAnswers({})
    setResults(null)
    setCurrentQuestion(0)
  }

  const SPECIALTY_AVATAR: Record<string, { bg: string; ring: string }> = {
    dr_sarah_heals:       { bg: 'bg-emerald-600', ring: 'ring-emerald-100' },
    dr_james_grief:       { bg: 'bg-amber-500',   ring: 'ring-amber-100'  },
    dr_rachel_cbt:        { bg: 'bg-violet-600',  ring: 'ring-violet-100' },
    dr_priya_anxiety:     { bg: 'bg-sky-600',     ring: 'ring-sky-100'    },
    dr_marcus_depression: { bg: 'bg-blue-600',    ring: 'ring-blue-100'   },
    dr_olivia_relate:     { bg: 'bg-rose-500',    ring: 'ring-rose-100'   },
    dr_viktor_psych:      { bg: 'bg-slate-700',   ring: 'ring-slate-200'  },
  }

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const getMatchStrength = (score: number, index: number) => {
    if (index === 0) return { label: "Best Match", color: "bg-emerald-100 text-emerald-700 border-emerald-200", border: "border-emerald-300" }
    if (index === 1) return { label: "Strong Match", color: "bg-blue-100 text-blue-700 border-blue-200", border: "border-blue-200" }
    if (index === 2) return { label: "Good Match", color: "bg-violet-100 text-violet-700 border-violet-200", border: "border-violet-200" }
    return { label: "Match", color: "bg-gray-100 text-gray-600 border-gray-200", border: "border-gray-200" }
  }

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Finding your best matches...</p>
        </div>
      </div>
    )
  }

  // Results screen
  if (results) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-sky-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Your Recommended Professionals</h1>
            <p className="text-slate-500 text-sm">Based on your answers, here are the specialists best suited to support you</p>
          </div>

          <div className="space-y-4">
            {results.map((pro, index) => {
              const match = getMatchStrength(pro.score, index)
              return (
                <div
                  key={pro.id}
                  className={`bg-white rounded-2xl p-6 border-2 ${match.border} shadow-sm`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-lg font-semibold text-slate-900">{pro.name}</h2>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${match.color}`}>
                          {match.label}
                        </span>
                      </div>
                      <p className="text-sm text-sky-700 font-medium">{pro.specialtyLabel}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white ring-4 ${SPECIALTY_AVATAR[pro.username]?.bg ?? 'bg-sky-600'} ${SPECIALTY_AVATAR[pro.username]?.ring ?? 'ring-sky-100'}`}>
                      {getInitials(pro.name)}
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm mb-4 leading-relaxed">{pro.bio}</p>
                  <button
                    onClick={() => router.push(`/messages/${pro.id}`)}
                    className="w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
                  >
                    Start Conversation
                  </button>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-8 space-y-3">
            <button
              onClick={handleRestart}
              className="text-slate-400 hover:text-slate-600 text-sm underline"
            >
              Retake questionnaire
            </button>
            <p className="text-xs text-slate-400 block">
              In crisis? Call Samaritans free on <strong className="text-slate-600">116 123</strong> (UK) or <strong className="text-slate-600">988</strong> (US)
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Questionnaire screen
  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col">

      {/* Nav */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-sky-700 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-base">MindBridge</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">Therapist Matching</span>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-slate-400 font-medium mb-2">
              <span className="uppercase tracking-wide">{question.section}</span>
              <span>{currentQuestion + 1} of {QUESTIONS.length}</span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-6 leading-snug">{question.question}</h2>

            <div className="space-y-2.5">
              {question.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full text-left px-4 py-3.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50 text-slate-700 text-sm transition-all duration-150"
                >
                  {option.label}
                </button>
              ))}
            </div>

            {currentQuestion > 0 && (
              <button
                onClick={handleBack}
                className="mt-6 flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}
          </div>

          <p className="text-center text-xs text-slate-400 mt-5">
            🔒 Your answers are confidential and only used to find your best match
          </p>
        </div>
      </div>
    </div>
  )
}
