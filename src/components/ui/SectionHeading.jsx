export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  ...props
}) {
  const alignment = align === 'left' ? 'items-start text-left' : 'items-center text-center'

  return (
    <div className={`flex flex-col gap-4 ${alignment}`} {...props}>
      {eyebrow && (
        <span className="inline-flex w-fit items-center rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1 text-xs font-medium uppercase tracking-wider text-accent-300">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-lg text-base text-white/60 sm:text-lg">{subtitle}</p>
      )}
    </div>
  )
}
