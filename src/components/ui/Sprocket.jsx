// Decorative divider — a row of small squares evoking film sprocket holes.
export function Sprocket({ count = 20, className = '' }) {
  return (
    <div
      className={`flex items-center gap-[6px] opacity-60 ${className}`}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="block h-[7px] w-[11px] rounded-[1.5px] bg-ink-2"
        />
      ))}
    </div>
  )
}
