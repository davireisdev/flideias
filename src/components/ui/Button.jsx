const variants = {
  primary:
    'bg-accent-600 text-white hover:bg-accent-700 shadow-lg shadow-accent-600/25',
  ghost:
    'bg-white/5 text-white hover:bg-white/10 border border-white/10',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
