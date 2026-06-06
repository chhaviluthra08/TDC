import { type Person, initials } from '@/lib/data'

export function Avatar({
  person,
  size = 44,
}: {
  person: Person
  size?: number
}) {
  const hue = person.avatarHue
  const bg = `hsl(${hue} 38% 88%)`
  const fg = `hsl(${hue} 42% 32%)`
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize: size * 0.36,
      }}
      className="flex shrink-0 items-center justify-center rounded-full font-semibold tracking-wide"
    >
      {initials(person)}
    </span>
  )
}
