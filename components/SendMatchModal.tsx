'use client'

import { useEffect, useState } from 'react'
import {
  type Client,
  type MatchResult,
  fullName,
  cmToFeet,
} from '@/lib/data'
import { Avatar } from './Avatar'

export function SendMatchModal({
  client,
  match,
  onClose,
}: {
  client: Client
  match: MatchResult
  onClose: () => void
}) {
  const c = match.candidate
  const [intro, setIntro] = useState('')
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<'ai' | 'fallback'>('fallback')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetch('/api/intro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: client.firstName,
        candidateName: fullName(c),
        candidateAge: c.age,
        candidateProfession: c.profession,
        candidateCity: c.city,
        sharedValue: client.sharedValue,
      }),
    })
      .then((r) => r.json())
      .then((data: { intro: string; source: 'ai' | 'fallback' }) => {
        if (!active) return
        setIntro(data.intro)
        setSource(data.source)
      })
      .catch(() => {
        if (!active) return
        setIntro(
          `Meet ${fullName(c)} — a ${c.age}-year-old ${c.profession} from ${c.city} who shares your views on ${client.sharedValue}.`,
        )
        setSource('fallback')
      })
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [client, c])

  // close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Send match: ${fullName(c)}`}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-[0_40px_90px_-40px_rgba(80,60,50,0.7)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Suggested for {client.firstName}
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-foreground">
              Send this match
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-secondary"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          {/* candidate snapshot */}
          <div className="flex items-center gap-3.5 rounded-xl bg-secondary/60 p-4">
            <Avatar person={c} size={52} />
            <div className="min-w-0">
              <p className="font-serif text-lg font-semibold leading-tight text-foreground">
                {fullName(c)}
              </p>
              <p className="text-sm text-muted-foreground">
                {c.age} · {c.profession} · {c.city}
              </p>
              <p className="text-xs text-muted-foreground/80">
                {cmToFeet(c.heightCm)} · {c.incomeLpa} LPA · {c.religion} · {c.diet}
              </p>
            </div>
            <span className="ml-auto self-start rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary">
              {match.score}%
            </span>
          </div>

          {/* intro */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Warm intro
              </p>
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70">
                {source === 'ai' ? 'AI-assisted' : 'Template'}
              </span>
            </div>
            <div className="mt-2 min-h-[88px] rounded-xl border border-border bg-background px-4 py-3">
              {loading ? (
                <div className="space-y-2 py-1">
                  <div className="h-3 w-full animate-pulse rounded bg-secondary" />
                  <div className="h-3 w-11/12 animate-pulse rounded bg-secondary" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-secondary" />
                </div>
              ) : (
                <p className="font-serif text-lg leading-relaxed text-foreground text-pretty">
                  {intro}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-secondary-foreground transition hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setSent(true)
                setTimeout(onClose, 900)
              }}
              disabled={loading || sent}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
            >
              {sent ? 'Sent ✓' : 'Send to ' + client.firstName}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
