'use client'

import { useState } from 'react'

export function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (username.trim() === 'admin' && password === 'tdc2024') {
      setError('')
      onLogin()
    } else {
      setError('Those credentials don\u2019t match our records. Please try again.')
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            The Date Crew
          </p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-foreground text-balance">
            Matchmaker Studio
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground text-pretty">
            A quiet, considered space for the humans behind every great match.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-7 shadow-[0_18px_50px_-30px_rgba(80,60,50,0.55)]"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
            />
          </div>

          <div className="mt-4 space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.99]"
          >
            Enter the Studio
          </button>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Demo access — <span className="font-medium text-foreground">admin</span> / <span className="font-medium text-foreground">tdc2024</span>
          </p>
        </form>
      </div>
    </main>
  )
}
