'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  type Client,
  type MatchResult,
  getMatches,
  fullName,
  cmToFeet,
} from '@/lib/data'
import { Avatar } from './Avatar'
import { StatusBadge } from './StatusBadge'
import { MatchCard } from './MatchCard'
import { SendMatchModal } from './SendMatchModal'

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-border/70 py-2.5 last:border-0">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_12px_40px_-34px_rgba(80,60,50,0.6)]">
      <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
      <dl className="mt-2 grid grid-cols-1 gap-x-6 sm:grid-cols-2">{children}</dl>
    </div>
  )
}

function maskPhone(phone: string) {
  // keep country code + last 2 digits visible
  return phone.replace(/\d(?=\d{2})/g, (m, i) => (i < 4 ? m : '•'))
}

export function ClientDetail({
  client,
  onBack,
}: {
  client: Client
  onBack: () => void
}) {
  const [phoneRevealed, setPhoneRevealed] = useState(false)
  const [notes, setNotes] = useState('')
  const [saved, setSaved] = useState(false)
  const [active, setActive] = useState<MatchResult | null>(null)

  const matches = useMemo(() => getMatches(client, 12), [client])
  const notesKey = `tdc-notes-${client.id}`

  // load notes
  useEffect(() => {
    try {
      setNotes(localStorage.getItem(notesKey) ?? '')
    } catch {
      setNotes('')
    }
    setPhoneRevealed(false)
  }, [notesKey])

  function saveNotes() {
    try {
      localStorage.setItem(notesKey, notes)
      setSaved(true)
      setTimeout(() => setSaved(false), 1600)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3.5 md:px-8">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-secondary-foreground transition hover:bg-secondary"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Clients
          </button>
          <p className="font-serif text-lg font-semibold text-foreground">
            {fullName(client)}
          </p>
          <div className="ml-auto">
            <StatusBadge status={client.status} />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-7 md:px-8">
        {/* Profile hero */}
        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-[0_16px_50px_-36px_rgba(80,60,50,0.6)] sm:flex-row sm:items-center">
          <Avatar person={client} size={76} />
          <div className="flex-1">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-foreground text-balance">
              {fullName(client)}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {client.age} years · {client.gender} · {client.city}, {client.country} · {client.maritalStatus}
            </p>
            <p className="mt-2 max-w-xl text-sm italic leading-relaxed text-secondary-foreground text-pretty">
              Cares deeply about {client.sharedValue}.
            </p>
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Biodata */}
          <div className="space-y-5">
            <Section title="Personal">
              <Field label="First Name" value={client.firstName} />
              <Field label="Last Name" value={client.lastName} />
              <Field label="Gender" value={client.gender} />
              <Field label="Date of Birth" value={client.dob} />
              <Field label="Age" value={`${client.age} years`} />
              <Field label="Height" value={cmToFeet(client.heightCm)} />
              <Field label="City" value={client.city} />
              <Field label="Country" value={client.country} />
            </Section>

            <Section title="Contact">
              <Field label="Email" value={client.email} />
              <Field
                label="Phone"
                value={
                  <span className="flex items-center gap-2">
                    <span className="tabular-nums">
                      {phoneRevealed ? client.phone : maskPhone(client.phone)}
                    </span>
                    <button
                      onClick={() => setPhoneRevealed((v) => !v)}
                      className="rounded-md border border-border bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground transition hover:bg-accent/50"
                    >
                      {phoneRevealed ? 'Hide' : 'Reveal'}
                    </button>
                  </span>
                }
              />
            </Section>

            <Section title="Education & Career">
              <Field label="College" value={client.college} />
              <Field label="Degree" value={client.degree} />
              <Field label="Income" value={`${client.incomeLpa} LPA`} />
              <Field label="Company" value={client.company} />
              <Field label="Designation" value={client.designation} />
              <Field label="Profession" value={client.profession} />
            </Section>

            <Section title="Family & Background">
              <Field label="Marital Status" value={client.maritalStatus} />
              <Field label="Mother Tongue" value={client.motherTongue} />
              <Field label="Languages" value={client.languages.join(', ')} />
              <Field label="Siblings" value={client.siblings} />
              <Field label="Religion" value={client.religion} />
              <Field label="Caste" value={client.caste} />
              <Field label="Manglik" value={client.manglik} />
              <Field label="Family Type" value={client.familyType} />
            </Section>

            <Section title="Lifestyle & Preferences">
              <Field label="Diet" value={client.diet} />
              <Field label="Smoking" value={client.smoking} />
              <Field label="Drinking" value={client.drinking} />
              <Field label="Want Kids" value={client.wantKids ? 'Yes' : 'No'} />
              <Field
                label="Open to Relocate"
                value={client.openToRelocate ? 'Yes' : 'No'}
              />
              <Field label="Open to Pets" value={client.openToPets ? 'Yes' : 'No'} />
            </Section>

            {/* Notes */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_12px_40px_-34px_rgba(80,60,50,0.6)]">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  Matchmaker Notes
                </h3>
                {saved && (
                  <span className="text-xs font-medium text-success">Saved ✓</span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Private observations about {client.firstName} — saved on this device.
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                placeholder="What matters most to this client? Dealbreakers, what they're really looking for, conversations so far…"
                className="mt-3 w-full resize-y rounded-xl border border-input bg-background px-3.5 py-3 text-sm leading-relaxed text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
              />
              <button
                onClick={saveNotes}
                className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.99]"
              >
                Save notes
              </button>
            </div>
          </div>

          {/* Matches */}
          <div>
            <div className="sticky top-20">
              <div className="mb-3 flex items-baseline justify-between">
                <h3 className="font-serif text-2xl font-semibold text-foreground">
                  Suggested Matches
                </h3>
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {client.gender === 'Male' ? 'Female pool' : 'Male pool'}
                </span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground text-pretty">
                Ranked transparently — every tag below shows{' '}
                <span className="font-medium text-foreground">why</span> we believe
                this is a fit, not just a number.
              </p>
              <div className="grid max-h-[calc(100dvh-12rem)] gap-3 overflow-y-auto pr-1">
                {matches.map((m) => (
                  <MatchCard
                    key={m.candidate.id}
                    match={m}
                    onSend={setActive}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {active && (
        <SendMatchModal
          client={client}
          match={active}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  )
}
