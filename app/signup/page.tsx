"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    ageConfirmation: false
  })
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setValidationErrors([])
    setLoading(true)

    try {
      console.log("Submitting signup with data:", { ...formData, password: "***" })

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      console.log("Signup response:", data)

      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          console.log("Validation errors:", data.details)
          setValidationErrors(data.details)
          setError("Please fix the errors below:")
        } else {
          console.error("Signup error:", data.error)
          setError(data.error || "Sign up failed")
        }
        setLoading(false)
        return
      }

      console.log("Signup successful, attempting auto-login...")

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false
      })

      console.log("Login result:", result)

      if (result?.error) {
        setError("Account created but login failed. Please try logging in manually.")
        setLoading(false)
      } else if (result?.ok) {
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 500)
      }
    } catch (err: any) {
      console.error("Exception during signup:", err)
      setError(err.message || "An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col">

      {/* Nav */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-sky-700 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-base">MindBridge</span>
          </Link>
        </div>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
              <p className="mt-1 text-slate-500 text-sm">Get matched with a mental health professional today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    {error}
                    {validationErrors.length > 0 && (
                      <ul className="mt-1 space-y-0.5">
                        {validationErrors.map((err, idx) => (
                          <li key={idx}>• {err.path?.join('.')}: {err.message}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="healthcare-input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  className="healthcare-input"
                  placeholder="e.g. john_smith"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
                <p className="mt-1.5 text-xs text-slate-400">3–20 characters, letters, numbers, and underscores only</p>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  className="healthcare-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <p className="mt-1.5 text-xs text-slate-400">Min 8 characters, include uppercase, lowercase, and number</p>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <input
                  id="age"
                  type="checkbox"
                  required
                  className="mt-0.5 h-4 w-4 text-sky-700 border-slate-300 rounded focus:ring-sky-600"
                  checked={formData.ageConfirmation}
                  onChange={(e) => setFormData({ ...formData, ageConfirmation: e.target.checked })}
                />
                <label htmlFor="age" className="text-sm text-slate-600">
                  I confirm I am 18 years of age or older
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full healthcare-btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-sky-700 hover:text-sky-800">
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            In crisis? Call Samaritans free on <strong className="text-slate-600">116 123</strong>
          </p>
        </div>
      </div>
    </div>
  )
}
