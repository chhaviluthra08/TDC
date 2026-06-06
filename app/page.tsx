'use client'

import { useState } from 'react'
import type { Client } from '@/lib/data'
import { Login } from '@/components/Login'
import { Dashboard } from '@/components/Dashboard'
import { ClientDetail } from '@/components/ClientDetail'

export default function Page() {
  const [authed, setAuthed] = useState(false)
  const [selected, setSelected] = useState<Client | null>(null)

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />
  }

  if (selected) {
    return <ClientDetail client={selected} onBack={() => setSelected(null)} />
  }

  return (
    <Dashboard
      onSelect={setSelected}
      onLogout={() => {
        setSelected(null)
        setAuthed(false)
      }}
    />
  )
}
