import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f0f4f8]">

      {/* Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-sky-700 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-slate-800">MindBridge</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm font-semibold bg-sky-700 text-white px-4 py-2 rounded-lg hover:bg-sky-800 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-200 text-sky-700 text-sm font-medium px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
          Confidential &amp; Safe
        </div>
        <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
          Mental health support,<br />
          <span className="text-sky-700">whenever you need it</span>
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Connect with specialist AI therapists tailored to your needs. Answer a short questionnaire and get matched with the right professional for you.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/signup" className="bg-sky-700 text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-sky-800 transition-colors text-base">
            Find Your Therapist
          </Link>
          <Link href="/login" className="text-slate-600 font-medium px-8 py-3.5 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors text-base">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🔒",
              title: "Private & Confidential",
              desc: "Your conversations are private. We never share your data with third parties.",
            },
            {
              icon: "🧠",
              title: "Specialist Matching",
              desc: "Answer a short questionnaire and get matched to the specialist best suited to your needs.",
            },
            {
              icon: "💬",
              title: "Available 24/7",
              desc: "Support is available around the clock, whenever you need someone to talk to.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Crisis banner */}
      <div className="bg-red-50 border-t border-red-200 py-4 px-6 text-center text-sm text-red-700">
        <strong>In crisis?</strong> Call Samaritans free on <strong>116 123</strong> (UK) or <strong>988</strong> (US) — available 24/7.
      </div>
    </div>
  );
}
