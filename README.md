# TDC Matchmaker Studio

An internal dashboard for The Date Crew's matchmakers to manage clients, view profiles, and assign curated matches — built as part of a Full Stack Developer Internship assignment.

## Live Demo

**URL:** _[Add your Vercel link here]_  
**Login:** `admin` / `tdc2024`

---

## What it does

Most matchmaking platforms fail users because matches feel arbitrary and checklist-driven. This tool is built for the humans doing the matching — giving them full context on each client and transparent, explainable suggestions so every match decision is informed, not just algorithmic.

### Features

**Dashboard**
- 18 pre-loaded client profiles with real Indian matrimonial data
- Stats overview: Total Clients, Active, Matched, Pending Review
- Search by name, city, or profession
- Filter by status: Active, Pending, Matched, Paused

**Client Detail View**
- Full biodata including Indian-specific fields: caste, religion, Manglik status, mother tongue, diet, family type, smoking/drinking habits
- Phone number masked by default, revealed on click

**Journey Timeline**
- 5-stage visual tracker: Onboarded → Profile Verified → Matches Sent → In Conversation → Matched
- Clickable — matchmaker can update the stage, persisted in localStorage

**Call Log & Notes**
- Timestamped notes per client, stored in reverse chronological order
- Each entry shows the note text and date/time of the call
- Persisted in localStorage per client

**AI-Powered Match Suggestions**
- Gender-specific matching logic (see below)
- Compatibility score (0–100%) with visual progress bar
- Tier labels: High Potential / Good Match / Low Match
- Reason tags on every card showing *why* the match was suggested (e.g. "✓ aligned on children", "✓ same religion (Sikh)", "✓ same city")
- Profiles similar to past unmatches are flagged with a warning tag

**Match History**
- Every sent match is logged per client with date, score, and outcome
- Matchmaker can update outcome: Pending / Connected / Unmatched
- Unmatched profiles' attributes (caste, religion, city) are fed back into the algorithm to deprioritise similar candidates in future suggestions

**Email Preview Modal**
- Clicking Send Match opens a pre-drafted email with subject line and warm AI-generated intro
- Key candidate details pulled directly from the match data
- One-click copy to clipboard

---

## Matching Logic

### For male clients (matched against female pool)
| Signal | Score |
|---|---|
| Candidate is younger | +20 |
| Candidate earns less | +15 |
| Candidate is shorter | +10 |
| Kids preference aligned | +25 |
| Same religion | +15 |
| Same caste | +10 |
| Same city | +10 |
| Same diet | +7 |
| Same family type | +8 |

### For female clients (matched against male pool)
| Signal | Score |
|---|---|
| Profession compatibility | +20 |
| Income parity (within 12 LPA) | +15 |
| Relocation preference aligned | +15 |
| Kids preference aligned | +25 |
| Same religion | +15 |
| Same caste | +10 |
| Same city | +10 |
| Same family type | +8 |

**Unmatch penalty:** If a candidate shares caste, religion, or city with someone the client previously unmatched, their score is reduced by 20 points and flagged in the UI.

---

## AI Integration

The email preview uses the `/api/intro` route, which calls the Gemini API (`gemini-pro`) to generate a warm, 2-sentence matchmaker-voice introduction for each suggested match. The prompt focuses on shared values and life goals rather than demographics.

If no API key is configured, the app falls back to a template intro built from the match data — the UI remains fully functional either way.

To enable AI intros, add your Gemini API key to Vercel environment variables:
```
GEMINI_API_KEY=your_key_here
```

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | File-based routing, seamless Vercel deployment |
| Language | TypeScript | Type safety across data and components |
| Styling | Tailwind CSS | Consistent design tokens, rapid iteration |
| Data | In-memory (lib/data.ts) | Deterministic seeded PRNG — same profiles every render |
| Persistence | localStorage | Notes, history, and journey stage survive page refresh |
| AI | Gemini API | Used in Myntra project — consistent with existing experience |
| Hosting | Vercel | Zero-config deployment from GitHub |

---

## Running Locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with `admin` / `tdc2024`.

---

## Assumptions Made

- All client data is dummy/generated — no real personal information
- The matchmaker manages male clients by default in this demo; the logic handles female clients symmetrically
- "Send Match" is a mock action — no actual email is sent
- Match history and notes are device-local (localStorage), not synced across sessions
- The Gemini API key is optional — the app degrades gracefully without it

---

## Research Behind the Build

Before writing a line of code, I spent time reading real user reviews from Shaadi.com, Jeevansathi, Hinge, and Reddit communities on Indian arranged marriage. The core insight: people don't feel their matchmaker actually understood what they wanted — matches feel arbitrary.

That's why the reason tags on every match card are the hero feature of this dashboard. They make the logic transparent, human, and auditable — not just a number.

I also researched Knot.dating (India's first AI matchmaker, VC-backed, profitable in 6 months) and M4Marry to understand what gender-specific filtering actually looks like in the Indian matrimonial space, and incorporated those signals into the scoring engine.
