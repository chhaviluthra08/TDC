'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  type Client, type MatchResult, type MatchHistoryEntry, type NoteEntry, type MatchOutcome,
  getMatches, fullName, cmToFeet,
  getNotes, saveNotes, getMatchHistory, saveMatchHistory, getJourneyStage, saveJourneyStage,
} from '@/lib/data'
import { Avatar } from './Avatar'
import { StatusBadge } from './StatusBadge'
import { MatchCard } from './MatchCard'
import { SendMatchModal } from './SendMatchModal'

const JOURNEY_STAGES = ['Onboarded', 'Profile Verified', 'Matches Sent', 'In Conversation', 'Matched']

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="border-b border-border/70 py-2.5 last:border-0">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_12px_40px_-34px_rgba(80,60,50,0.6)]">
      <h3 className="font-serif text-lg font-semibold text-foreground">{title}</h3>
      <dl className="mt-2 grid grid-cols-1 gap-x-6 sm:grid-cols-2">{children}</dl>
    </div>
  )
}

function maskPhone(phone: string) {
  return phone.replace(/\d(?=\d{2})/g, (m, i) => (i < 4 ? m : '•'))
}

function JourneyTimeline({ clientId }: { clientId: string }) {
  const [stage, setStage] = useState(0)

  useEffect(() => { setStage(getJourneyStage(clientId)) }, [clientId])

  function updateStage(i: number) {
    setStage(i)
    saveJourneyStage(clientId, i)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_12px_40px_-34px_rgba(80,60,50,0.6)]">
      <h3 className="font-serif text-lg font-semibold text-foreground mb-4">Journey</h3>
      <div className="flex items-center gap-0">
        {JOURNEY_STAGES.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => updateStage(i)}
              title={s}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: i <= stage ? 'var(--primary, #B8695E)' : 'transparent',
                border: `2px solid ${i <= stage ? 'var(--primary, #B8695E)' : '#D1C4B8'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}>
                {i <= stage && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <span style={{ fontSize: 10, fontWeight: i === stage ? 700 : 400, color: i <= stage ? 'var(--primary, #B8695E)' : '#9C8E84', textAlign: 'center', lineHeight: 1.2, maxWidth: 56 }}>{s}</span>
            </button>
            {i < JOURNEY_STAGES.length - 1 && (
              <div style={{ flex: 1, height: 2, background: i < stage ? 'var(--primary, #B8695E)' : '#E2D8CE', marginBottom: 18, transition: 'background 0.2s' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function NotesLog({ clientId, clientFirstName }: { clientId: string; clientFirstName: string }) {
  const [notes, setNotes] = useState<NoteEntry[]>([])
  const [draft, setDraft] = useState('')

  useEffect(() => { setNotes(getNotes(clientId)) }, [clientId])

  function addNote() {
    if (!draft.trim()) return
    const entry: NoteEntry = { id: Date.now().toString(), text: draft.trim(), createdAt: new Date().toISOString() }
    const updated = [entry, ...notes]
    setNotes(updated)
    saveNotes(clientId, updated)
    setDraft('')
  }

  function formatDate(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' · ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_12px_40px_-34px_rgba(80,60,50,0.6)]">
      <h3 className="font-serif text-lg font-semibold text-foreground">Call Log & Notes</h3>
      <p className="mt-0.5 text-xs text-muted-foreground mb-3">Private observations about {clientFirstName} — saved on this device.</p>
      <div className="flex gap-2">
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote() }}
          rows={3}
          placeholder="What came up in today's call? Dealbreakers, new preferences, follow-ups…"
          className="flex-1 resize-none rounded-xl border border-input bg-background px-3.5 py-3 text-sm leading-relaxed text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/25"
        />
      </div>
      <button
        onClick={addNote}
        disabled={!draft.trim()}
        className="mt-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
      >
        Add Note
      </button>
      {notes.length > 0 && (
        <div className="mt-4 space-y-3">
          {notes.map(n => (
            <div key={n.id} style={{ borderLeft: '2px solid var(--primary, #B8695E)', paddingLeft: 12 }}>
              <p className="text-sm text-foreground leading-relaxed">{n.text}</p>
              <p className="text-[11px] text-muted-foreground mt-1">{formatDate(n.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
      {notes.length === 0 && (
        <p className="mt-4 text-xs text-muted-foreground italic">No notes yet. Add your first one above.</p>
      )}
    </div>
  )
}

function MatchHistory({ clientId }: { clientId: string }) {
  const [history, setHistory] = useState<MatchHistoryEntry[]>([])

  useEffect(() => { setHistory(getMatchHistory(clientId)) }, [clientId])

  function updateOutcome(candidateId: string, outcome: MatchOutcome) {
    const updated = history.map(h => h.candidateId === candidateId ? { ...h, outcome } : h)
    setHistory(updated)
    saveMatchHistory(clientId, updated)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (history.length === 0) return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_12px_40px_-34px_rgba(80,60,50,0.6)]">
      <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Match History</h3>
      <p className="text-xs text-muted-foreground italic">No matches sent yet. Send a match above to start tracking.</p>
    </div>
  )

  const outcomeColor: Record<MatchOutcome, string> = {
    Pending: '#854F0B',
    Connected: '#4A7C59',
    Unmatched: '#B8695E',
  }
  const outcomeBg: Record<MatchOutcome, string> = {
    Pending: '#FBF3E3',
    Connected: '#EBF4EE',
    Unmatched: '#FAF1EF',
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_12px_40px_-34px_rgba(80,60,50,0.6)]">
      <h3 className="font-serif text-lg font-semibold text-foreground mb-1">Match History</h3>
      <p className="text-xs text-muted-foreground mb-4">Unmatched profiles are deprioritised in future suggestions.</p>
      <div className="space-y-3">
        {history.map(h => (
          <div key={h.candidateId} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">{h.candidateName}</p>
              <p className="text-xs text-muted-foreground">{h.candidateProfession} · {h.candidateCity} · {h.incomeLpa} LPA</p>
              <p className="text-[11px] text-muted-foreground/70 mt-0.5">Sent {formatDate(h.sentAt)} · Score {h.score}%</p>
            </div>
            <select
              value={h.outcome}
              onChange={e => updateOutcome(h.candidateId, e.target.value as MatchOutcome)}
              style={{ fontSize: 12, fontWeight: 600, color: outcomeColor[h.outcome], background: outcomeBg[h.outcome], border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', outline: 'none' }}
            >
              <option value="Pending">Pending</option>
              <option value="Connected">Connected</option>
              <option value="Unmatched">Unmatched</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ClientDetail({ client, onBack }: { client: Client; onBack: () => void }) {
  const [phoneRevealed, setPhoneRevealed] = useState(false)
  const [active, setActive] = useState<MatchResult | null>(null)
  const [matchVersion, setMatchVersion] = useState(0)

  const matches = useMemo(() => getMatches(client, 12), [client, matchVersion]) // eslint-disable-line

  function handleSend(match: MatchResult) {
    setActive(match)
  }

  function handleMatchSent() {
    if (!active) return
    const history = getMatchHistory(client.id)
    const already = history.find(h => h.candidateId === active.candidate.id)
    if (!already) {
      const entry: MatchHistoryEntry = {
        candidateId: active.candidate.id,
        candidateName: fullName(active.candidate),
        candidateProfession: active.candidate.profession,
        candidateCity: active.candidate.city,
        candidateCaste: active.candidate.caste,
        candidateReligion: active.candidate.religion,
        incomeLpa: active.candidate.incomeLpa,
        score: active.score,
        sentAt: new Date().toISOString(),
        outcome: 'Pending',
      }
      saveMatchHistory(client.id, [entry, ...history])
      setMatchVersion(v => v + 1)
    }
    setActive(null)
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3.5 md:px-8">
          <button onClick={onBack} className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-secondary-foreground transition hover:bg-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            Clients
          </button>
          <p className="font-serif text-lg font-semibold text-foreground">{fullName(client)}</p>
          <div className="ml-auto"><StatusBadge status={client.status} /></div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-7 md:px-8">
        <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-[0_16px_50px_-36px_rgba(80,60,50,0.6)] sm:flex-row sm:items-center">
          <Avatar person={client} size={76} />
          <div className="flex-1">
            <h2 className="font-serif text-3xl font-semibold leading-tight text-foreground">{fullName(client)}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{client.age} years · {client.gender} · {client.city}, {client.country} · {client.maritalStatus}</p>
            <p className="mt-2 max-w-xl text-sm italic leading-relaxed text-secondary-foreground">Cares deeply about {client.sharedValue}.</p>
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
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
              <Field label="Phone" value={
                <span className="flex items-center gap-2">
                  <span className="tabular-nums">{phoneRevealed ? client.phone : maskPhone(client.phone)}</span>
                  <button onClick={() => setPhoneRevealed(v => !v)} className="rounded-md border border-border bg-secondary px-2 py-0.5 text-[11px] font-semibold text-secondary-foreground transition hover:bg-accent/50">
                    {phoneRevealed ? 'Hide' : 'Reveal'}
                  </button>
                </span>
              } />
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
              <Field label="Open to Relocate" value={client.openToRelocate ? 'Yes' : 'No'} />
              <Field label="Open to Pets" value={client.openToPets ? 'Yes' : 'No'} />
            </Section>

            <JourneyTimeline clientId={client.id} />
            <NotesLog clientId={client.id} clientFirstName={client.firstName} />
            <MatchHistory clientId={client.id} />
          </div>

          <div>
            <div className="sticky top-20">
              <div className="mb-3 flex items-baseline justify-between">
                <h3 className="font-serif text-2xl font-semibold text-foreground">Suggested Matches</h3>
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{client.gender === 'Male' ? 'Female pool' : 'Male pool'}</span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                Ranked transparently — every tag shows <span className="font-medium text-foreground">why</span> we believe this is a fit. Profiles similar to past unmatches are flagged.
              </p>
              <div className="grid max-h-[calc(100dvh-12rem)] gap-3 overflow-y-auto pr-1">
                {matches.map(m => (
                  <MatchCard key={m.candidate.id} match={m} onSend={handleSend} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {active && (
        <SendMatchModal client={client} match={active} onClose={handleMatchSent} />
      )}
    </div>
  )
}