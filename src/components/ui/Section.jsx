export function Section({ label, kicker, children, className = '' }) {
  return (
    <section className={`relative ${className}`}>
      <div className="relative">
        {label && (
          <div className="absolute -top-3 left-4 z-10">
            <span className="tape-label">{label}</span>
          </div>
        )}
        <div className="border border-ink-2 bg-ink-1/90 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset,0_20px_40px_-30px_rgba(0,0,0,0.9)]">
          {kicker && (
            <div className="border-b border-ink-2 px-5 pt-6 pb-3">
              <p className="label-tiny text-paper-mute">{kicker}</p>
            </div>
          )}
          <div className="px-5 pt-6 pb-5">{children}</div>
        </div>
      </div>
    </section>
  )
}
