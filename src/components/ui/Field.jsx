// A labeled input group used throughout the Assumptions panel.
// Looks like a lab form: tiny uppercase label, monospaced value, dim helper.

export function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  helper,
  kind = 'input', // 'input' | 'calc' | 'manual'
  min,
  step,
  children, // for select
}) {
  const barColor =
    kind === 'calc'
      ? 'bg-grass/70'
      : kind === 'manual'
      ? 'bg-kodak/80'
      : 'bg-tape'

  return (
    <label className="group relative block">
      <div className="flex items-center gap-2">
        <span className={`h-[10px] w-[3px] ${barColor}`} aria-hidden="true" />
        <span className="label-tiny text-paper-mute group-focus-within:text-paper">{label}</span>
      </div>
      <div className="mt-1 pl-[11px]">
        {children ? (
          <div className="relative">
            {children}
          </div>
        ) : kind === 'calc' ? (
          <div className="tabular text-paper text-[15px] font-medium py-[6px] px-2 bg-ink-0/60 border border-ink-2">
            {value ?? <span className="text-paper-mute">—</span>}
          </div>
        ) : (
          <input
            type={type}
            value={value ?? ''}
            onChange={(e) => onChange?.(type === 'number' ? e.target.valueAsNumber : e.target.value)}
            placeholder={placeholder}
            min={min}
            step={step}
            className="tabular w-full bg-ink-0/60 border border-ink-2 text-paper px-2 py-[6px] text-[15px] placeholder:text-paper-mute/60 transition-colors hover:border-ink-3"
          />
        )}
      </div>
      {helper && (
        <p className="mt-1 pl-[11px] text-[10.5px] leading-snug text-paper-mute italic">{helper}</p>
      )}
    </label>
  )
}

// Select is a styled wrapper — the Field above passes its content into the children slot.
export function Select({ value, onChange, options }) {
  return (
    <>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="tabular w-full appearance-none bg-ink-0/60 border border-ink-2 text-paper pl-2 pr-8 py-[6px] text-[15px] hover:border-ink-3 focus:outline-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-ink-1">
            {o.label}
          </option>
        ))}
      </select>
      <span
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-paper-mute text-[10px]"
        aria-hidden="true"
      >
        ▼
      </span>
    </>
  )
}
