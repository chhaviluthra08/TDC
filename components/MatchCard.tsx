'use client'

import { type MatchResult, fullName, cmToFeet } from '@/lib/data'
import { Avatar } from './Avatar'

const TIER_STYLES: Record<MatchResult['tier'], { bar: string; chip: string }> = {
  'High Potential': {
    bar: 'bg-success',
    chip: 'bg-success/15 text-success',
  },
  'Good Match': {
    bar: 'bg-primary',
    chip: 'bg-primary/15 text-primary',
  },
  'Low Match': {
    bar: 'bg-muted-foreground/50',
    chip: 'bg-muted text-muted-foreground',
  },
}

export function MatchCard({
  match,
  onSend,
}: {
  match: MatchResult
  onSend: (match: MatchResult) => void
}) {
  const { candidate: c, score, tier, reasons } = match
  const styles = TIER_STYLES[tier]

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-[0_12px_40px_-34px_rgba(80,60,50,0.6)]">
      <div className="flex items-start gap-3.5">
        <Avatar person={c} size={48} />
        <div className="min-w-0 flex-1">
          <p className="font-serif text-lg font-semibold leading-tight text-foreground">
            {fullName(c)}
          </p>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {c.age} · {c.profession} · {c.city}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground/80">
            {cmToFeet(c.heightCm)} · {c.incomeLpa} LPA · {c.religion}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles.chip}`}
        >
          {tier}
        </span>
      </div>

      {/* Score bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">Compatibility</span>
          <span className="font-serif text-base font-semibold text-foreground">
            {score}%
          </span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full rounded-full transition-all ${styles.bar}`}
            style={{ width: `${score}%` }}
            role="progressbar"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Reason tags — the hero feature */}
      {reasons.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {reasons.map((r) => (
            <li
              key={r.label}
              className="rounded-full border border-accent bg-accent/40 px-2.5 py-1 text-[11px] font-medium text-accent-foreground"
            >
              {r.label}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => onSend(match)}
        className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.99]"
      >
        Send Match
      </button>
    </article>
  )
}
