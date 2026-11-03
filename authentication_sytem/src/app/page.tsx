import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-zinc-955 text-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Header / Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-gray-800/60">
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-600/30">
            A
          </div>
          <span className="font-semibold text-lg tracking-wide">AuthSystem</span>
        </div>
        <nav className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-gray-800/50"
          >
            Login
          </Link>
          <Link
            href="/Signup"
            className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all px-4 py-2 rounded-lg shadow-md shadow-indigo-600/20"
          >
            Get Started
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
          Secure Authentication Module
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Next.js Full-Stack <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Auth System</span>
        </h1>
        
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mb-10 leading-relaxed">
          Robust, token-based authentication workflow featuring secure login, user registration, encrypted HTTP-only cookies, profile verification, and session management.
        </p>

    
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          {/* <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-600/25 text-center"
          >
            Sign In to Account
          </Link> */}
          <Link
            href="/Profile"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium text-sm transition-all border border-gray-700/60 text-center"
          >
            View Profile Dashboard
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-gray-800/60 text-center text-xs text-gray-500">
        Built with Next.js App Router, Tailwind CSS, and MongoDB.
      </footer>
    </main>
  );
}