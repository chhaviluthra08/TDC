import type { ClientStatus } from '@/lib/data'

const STYLES: Record<ClientStatus, string> = {
  Active: 'bg-success/15 text-success',
  Matched: 'bg-primary/15 text-primary',
  Pending: 'bg-warning/20 text-warning',
  Paused: 'bg-muted text-muted-foreground',
}

export function StatusBadge({ status }: { status: ClientStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  )
}
