'use client'

import { useMemo, useState } from 'react'
import { CLIENTS, type Client, type ClientStatus, fullName } from '@/lib/data'
import { Avatar } from './Avatar'
import { StatusBadge } from './StatusBadge'

const FILTERS: ('All' | ClientStatus)[] = [
  'All',
  'Active',
  'Pending',
  'Matched',
  'Paused',
]

function StatCard({
  label,
  value,
  accent,
}: {
  label: string
  value: number
  accent?: boolean
}) {
  return (
    <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-[0_12px_40px_-32px_rgba(80,60,50,0.6)]">
      <p
        className={`font-serif text-3xl font-semibold leading-none ${
          accent ? 'text-primary' : 'text-foreground'
        }`}
      >
        {value}
      </p>
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

export function Dashboard({
  onSelect,
  onLogout,
}: {
  onSelect: (client: Client) => void
  onLogout: () => void
}) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<'All' | ClientStatus>('All')

  const stats = useMemo(() => {
    return {
      total: CLIENTS.length,
      active: CLIENTS.filter((c) => c.status === 'Active').length,
      matched: CLIENTS.filter((c) => c.status === 'Matched').length,
      pending: CLIENTS.filter((c) => c.status === 'Pending').length,
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return CLIENTS.filter((c) => {
      const matchesFilter = filter === 'All' || c.status === filter
      const matchesQuery =
        !q ||
        fullName(c).toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.profession.toLowerCase().includes(q)
      return matchesFilter && matchesQuery
    })
  }, [query, filter])

  return (
    <div className="min-h-dvh">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-primary">
              The Date Crew
            </p>
            <h1 className="font-serif text-2xl font-semibold leading-tight text-foreground">
              Matchmaker Studio
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="rounded-lg border border-border bg-background px-3.5 py-2 text-sm font-medium text-secondary-foreground transition hover:bg-secondary"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-7 md:px-8">
        {/* Stats */}
        <section
          aria-label="Overview"
          className="grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          <StatCard label="Total Clients" value={stats.total} />
          <StatCard label="Active" value={stats.active} accent />
          <StatCard label="Matched" value={stats.matched} />
          <StatCard label="Pending Review" value={stats.pending} />
        </section>

        {/* Controls */}
        <section className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, city or profession…"
              aria-label="Search clients"
              className="w-full rounded-lg border border-input bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  filter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border bg-card text-secondary-foreground hover:bg-secondary'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        {/* Client list */}
        <section className="mt-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {filtered.length} client{filtered.length === 1 ? '' : 's'}
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => onSelect(c)}
                  className="group flex w-full items-center gap-3.5 rounded-2xl border border-border bg-card p-4 text-left shadow-[0_12px_40px_-34px_rgba(80,60,50,0.6)] transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_22px_50px_-30px_rgba(184,105,94,0.55)]"
                >
                  <Avatar person={c} size={52} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-serif text-lg font-semibold leading-tight text-foreground">
                        {fullName(c)}
                      </p>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {c.age} · {c.city} · {c.maritalStatus}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground/80">
                      {c.profession}
                    </p>
                    <div className="mt-2">
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
              <p className="font-serif text-xl text-foreground">No clients found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search or filter.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
