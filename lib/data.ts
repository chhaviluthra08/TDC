// ── The Date Crew — data + matching engine ───────────────────────────────
// All profiles are generated deterministically with a seeded PRNG so the
// pools are identical across renders, reloads and server/client boundaries.

export type Gender = 'Male' | 'Female'
export type ClientStatus = 'Active' | 'Pending' | 'Matched' | 'Paused'
export type Diet = 'Veg' | 'Non-Veg' | 'Eggetarian'
export type FamilyType = 'Joint' | 'Nuclear'
export type Habit = 'Never' | 'Occasionally' | 'Regularly'
export type Manglik = 'Yes' | 'No' | "Don't Know"

export interface Person {
  id: string
  firstName: string
  lastName: string
  gender: Gender
  dob: string // ISO
  age: number
  city: string
  country: string
  heightCm: number
  email: string
  phone: string
  college: string
  degree: string
  incomeLpa: number
  company: string
  designation: string
  profession: string
  maritalStatus: string
  languages: string[]
  motherTongue: string
  siblings: number
  caste: string
  religion: string
  manglik: Manglik
  wantKids: boolean
  openToRelocate: boolean
  openToPets: boolean
  diet: Diet
  familyType: FamilyType
  smoking: Habit
  drinking: Habit
  avatarHue: number
}

export interface Client extends Person {
  status: ClientStatus
  sharedValue: string
}

// ── Seeded PRNG (mulberry32) ──────────────────────────────────────────────
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeRng(seed: number) {
  const r = mulberry32(seed)
  return {
    next: r,
    pick: <T,>(arr: T[]): T => arr[Math.floor(r() * arr.length)],
    int: (min: number, max: number) => Math.floor(r() * (max - min + 1)) + min,
    bool: (p = 0.5) => r() < p,
  }
}

// ── Source vocab (Indian matrimonial context) ─────────────────────────────
const MALE_FIRST = [
  'Aarav', 'Vivaan', 'Aditya', 'Arjun', 'Reyansh', 'Krishna', 'Ishaan', 'Kabir',
  'Rohan', 'Karthik', 'Siddharth', 'Aryan', 'Dhruv', 'Rahul', 'Nikhil', 'Varun',
  'Yash', 'Aman', 'Harsh', 'Pranav', 'Sahil', 'Manish', 'Tarun', 'Vikram',
  'Anirudh', 'Gautam', 'Naveen', 'Rishabh', 'Sandeep', 'Akash',
]
const FEMALE_FIRST = [
  'Aanya', 'Diya', 'Saanvi', 'Ananya', 'Aadhya', 'Pari', 'Anika', 'Navya',
  'Ira', 'Myra', 'Sara', 'Kiara', 'Riya', 'Ishita', 'Meera', 'Tanvi',
  'Nisha', 'Pooja', 'Sneha', 'Divya', 'Kavya', 'Shreya', 'Aditi', 'Neha',
  'Priya', 'Sakshi', 'Ritika', 'Vaishnavi', 'Lakshmi', 'Bhavya',
]
const LAST = [
  'Sharma', 'Verma', 'Gupta', 'Iyer', 'Reddy', 'Nair', 'Menon', 'Patel',
  'Desai', 'Mehta', 'Kapoor', 'Malhotra', 'Chopra', 'Bose', 'Banerjee',
  'Rao', 'Pillai', 'Joshi', 'Kulkarni', 'Deshpande', 'Naidu', 'Shetty',
  'Agarwal', 'Bhat', 'Chauhan', 'Sinha', 'Mukherjee', 'Pandey',
]
const CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata',
  'Ahmedabad', 'Jaipur', 'Chandigarh', 'Kochi', 'Indore', 'Gurgaon', 'Noida',
]
const COLLEGES = [
  'IIT Bombay', 'IIT Delhi', 'BITS Pilani', 'IIM Ahmedabad', 'NIT Trichy',
  'Delhi University', 'VIT Vellore', 'Christ University', 'SRCC',
  'Manipal Institute of Technology', 'IIIT Hyderabad', 'St. Xaviers',
]
const DEGREES = [
  'B.Tech', 'B.E.', 'MBBS', 'MBA', 'CA', 'M.Tech', 'B.Com', 'B.Arch',
  'LLB', 'M.Sc', 'B.Des', 'PhD',
]
const COMPANIES = [
  'Infosys', 'TCS', 'Google', 'Microsoft', 'Flipkart', 'Razorpay', 'Zomato',
  'Deloitte', 'Goldman Sachs', 'Apollo Hospitals', 'Self-employed', 'Swiggy',
  'McKinsey & Co.', 'Adobe', 'Freshworks',
]
const PROFESSIONS = [
  'Software Engineer', 'Doctor', 'Product Manager', 'Chartered Accountant',
  'Architect', 'Lawyer', 'Data Scientist', 'Entrepreneur', 'Consultant',
  'Investment Banker', 'Designer', 'Professor', 'Marketing Lead', 'Dentist',
]
const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist']
const CASTES_BY_RELIGION: Record<string, string[]> = {
  Hindu: ['Brahmin', 'Kshatriya', 'Vaishya', 'Kayastha', 'Maratha', 'Reddy', 'Nair'],
  Muslim: ['Sunni', 'Shia'],
  Christian: ['Roman Catholic', 'Protestant', 'Syrian'],
  Sikh: ['Jat', 'Khatri', 'Ramgarhia'],
  Jain: ['Digambar', 'Shwetambar'],
  Buddhist: ['Theravada', 'Mahayana'],
}
const LANGUAGES = [
  'Hindi', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Marathi',
  'Bengali', 'Gujarati', 'Punjabi',
]
const SHARED_VALUES = [
  'building a home rooted in shared ambition',
  'balancing career growth with family time',
  'travelling the world before settling roots',
  'raising a close-knit, values-first family',
  'financial partnership and long-term planning',
  'creative pursuits and lifelong learning',
  'faith, tradition and a modern outlook',
  'health, fitness and an active lifestyle',
]

function makePerson(seed: number, gender: Gender, idPrefix: string): Person {
  const r = makeRng(seed)
  const first = gender === 'Male' ? r.pick(MALE_FIRST) : r.pick(FEMALE_FIRST)
  const last = r.pick(LAST)
  const age = gender === 'Male' ? r.int(27, 38) : r.int(24, 34)
  const year = 2026 - age
  const month = r.int(1, 12)
  const day = r.int(1, 28)
  const dob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const religion = r.pick(RELIGIONS)
  const caste = r.pick(CASTES_BY_RELIGION[religion])
  const motherTongue = r.pick(LANGUAGES)
  const langs = Array.from(
    new Set([motherTongue, 'English', r.pick(LANGUAGES)]),
  )
  const heightCm =
    gender === 'Male' ? r.int(165, 188) : r.int(150, 173)
  const incomeLpa =
    gender === 'Male' ? r.int(8, 60) : r.int(6, 45)
  const profession = r.pick(PROFESSIONS)

  return {
    id: `${idPrefix}-${seed}`,
    firstName: first,
    lastName: last,
    gender,
    dob,
    age,
    city: r.pick(CITIES),
    country: 'India',
    heightCm,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@email.com`,
    phone: `+91 ${r.int(70, 99)}${r.int(10, 99)}${r.int(100, 999)}${r.int(100, 999)}`,
    college: r.pick(COLLEGES),
    degree: r.pick(DEGREES),
    incomeLpa,
    company: r.pick(COMPANIES),
    designation: profession,
    profession,
    maritalStatus: r.bool(0.82)
      ? 'Never Married'
      : r.bool(0.6)
        ? 'Divorced'
        : 'Widowed',
    languages: langs,
    motherTongue,
    siblings: r.int(0, 3),
    caste,
    religion,
    manglik: religion === 'Hindu'
      ? (r.pick(['Yes', 'No', "Don't Know"]) as Manglik)
      : 'No',
    wantKids: r.bool(0.78),
    openToRelocate: r.bool(0.55),
    openToPets: r.bool(0.5),
    diet: r.pick(['Veg', 'Non-Veg', 'Eggetarian']) as Diet,
    familyType: r.pick(['Joint', 'Nuclear']) as FamilyType,
    smoking: r.pick(['Never', 'Never', 'Never', 'Occasionally', 'Regularly']) as Habit,
    drinking: r.pick(['Never', 'Never', 'Occasionally', 'Occasionally', 'Regularly']) as Habit,
    avatarHue: r.int(0, 359),
  }
}

// ── Candidate pools ───────────────────────────────────────────────────────
export const FEMALE_POOL: Person[] = Array.from({ length: 120 }, (_, i) =>
  makePerson(1000 + i, 'Female', 'f'),
)
export const MALE_POOL: Person[] = Array.from({ length: 90 }, (_, i) =>
  makePerson(5000 + i, 'Male', 'm'),
)

// ── Managed clients (the people the matchmaker works with) ────────────────
const CLIENT_STATUSES: ClientStatus[] = [
  'Active', 'Active', 'Active', 'Pending', 'Matched', 'Paused',
]

export const CLIENTS: Client[] = Array.from({ length: 18 }, (_, i) => {
  const r = makeRng(9000 + i)
  const gender: Gender = r.bool(0.5) ? 'Male' : 'Female'
  const base = makePerson(9000 + i, gender, 'c')
  return {
    ...base,
    status: r.pick(CLIENT_STATUSES),
    sharedValue: r.pick(SHARED_VALUES),
  }
})

// ── Matching engine ───────────────────────────────────────────────────────
export interface MatchReason {
  label: string
  weight: number
}

export interface MatchResult {
  candidate: Person
  score: number // 0..100
  rawScore: number
  maxScore: number
  reasons: MatchReason[]
  tier: 'High Potential' | 'Good Match' | 'Low Match'
}

function tierFor(score: number): MatchResult['tier'] {
  if (score >= 70) return 'High Potential'
  if (score >= 45) return 'Good Match'
  return 'Low Match'
}

// MALE client → female candidates
function scoreForMaleClient(client: Person, c: Person) {
  const reasons: MatchReason[] = []
  let raw = 0
  const max = 20 + 15 + 10 + 25 + 15 + 10 + 10 + 7 + 8

  if (c.age < client.age) {
    raw += 20
    reasons.push({ label: `✓ ${client.age - c.age} yrs younger`, weight: 20 })
  }
  if (c.incomeLpa <= client.incomeLpa) {
    raw += 15
    reasons.push({ label: '✓ income alignment', weight: 15 })
  }
  if (c.heightCm < client.heightCm) {
    raw += 10
    reasons.push({ label: '✓ height preference', weight: 10 })
  }
  if (c.wantKids === client.wantKids) {
    raw += 25
    reasons.push({
      label: client.wantKids ? '✓ aligned on children' : '✓ aligned: no kids',
      weight: 25,
    })
  }
  if (c.religion === client.religion) {
    raw += 15
    reasons.push({ label: `✓ same religion (${c.religion})`, weight: 15 })
  }
  if (c.caste === client.caste) {
    raw += 10
    reasons.push({ label: '✓ same community', weight: 10 })
  }
  if (c.city === client.city) {
    raw += 10
    reasons.push({ label: `✓ same city (${c.city})`, weight: 10 })
  }
  if (c.diet === client.diet) {
    raw += 7
    reasons.push({ label: `✓ same diet (${c.diet})`, weight: 7 })
  }
  if (c.familyType === client.familyType) {
    raw += 8
    reasons.push({ label: `✓ ${c.familyType.toLowerCase()} family fit`, weight: 8 })
  }
  return { raw, max, reasons }
}

// FEMALE client → male candidates
function scoreForFemaleClient(client: Person, c: Person) {
  const reasons: MatchReason[] = []
  let raw = 0
  const max = 20 + 15 + 15 + 25 + 15 + 10 + 10 + 8

  if (c.profession === client.profession || c.incomeLpa >= client.incomeLpa) {
    raw += 20
    reasons.push({ label: '✓ profession compatibility', weight: 20 })
  }
  if (Math.abs(c.incomeLpa - client.incomeLpa) <= 12) {
    raw += 15
    reasons.push({ label: '✓ income parity', weight: 15 })
  }
  if (c.openToRelocate === client.openToRelocate || c.openToRelocate) {
    raw += 15
    reasons.push({ label: '✓ relocation alignment', weight: 15 })
  }
  if (c.wantKids === client.wantKids) {
    raw += 25
    reasons.push({
      label: client.wantKids ? '✓ aligned on children' : '✓ aligned: no kids',
      weight: 25,
    })
  }
  if (c.religion === client.religion) {
    raw += 15
    reasons.push({ label: `✓ same religion (${c.religion})`, weight: 15 })
  }
  if (c.caste === client.caste) {
    raw += 10
    reasons.push({ label: '✓ same community', weight: 10 })
  }
  if (c.city === client.city) {
    raw += 10
    reasons.push({ label: `✓ same city (${c.city})`, weight: 10 })
  }
  if (c.familyType === client.familyType) {
    raw += 8
    reasons.push({ label: `✓ ${c.familyType.toLowerCase()} family fit`, weight: 8 })
  }
  return { raw, max, reasons }
}

export function getMatches(client: Client, limit = 12): MatchResult[] {
  const pool = client.gender === 'Male' ? FEMALE_POOL : MALE_POOL
  const scorer =
    client.gender === 'Male' ? scoreForMaleClient : scoreForFemaleClient

  const results: MatchResult[] = pool.map((candidate) => {
    const { raw, max, reasons } = scorer(client, candidate)
    const score = Math.round((raw / max) * 100)
    return {
      candidate,
      rawScore: raw,
      maxScore: max,
      score,
      reasons: reasons.sort((a, b) => b.weight - a.weight),
      tier: tierFor(score),
    }
  })

  return results.sort((a, b) => b.score - a.score).slice(0, limit)
}

// ── helpers ───────────────────────────────────────────────────────────────
export function cmToFeet(cm: number) {
  const totalInches = cm / 2.54
  const feet = Math.floor(totalInches / 12)
  const inches = Math.round(totalInches % 12)
  return `${feet}'${inches}" (${cm} cm)`
}

export function fullName(p: Person) {
  return `${p.firstName} ${p.lastName}`
}

export function initials(p: Person) {
  return `${p.firstName[0]}${p.lastName[0]}`
}
