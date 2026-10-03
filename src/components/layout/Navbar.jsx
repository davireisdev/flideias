const navLinks = [
  { href: '#intro', label: 'Início' },
  { href: '#formulario', label: 'Sua ideia' },
  { href: '#encerramento', label: 'Pronto' },
]

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto mt-4 flex w-[calc(100%-2rem)] max-w-3xl items-center justify-between rounded-full border border-white/10 bg-base-900/70 px-5 py-3 backdrop-blur-lg sm:w-full">
        <a
          href="#intro"
          className="flex items-center rounded-full px-1.5 py-2 font-display text-sm font-semibold tracking-tight text-white"
        >
          fl<span className="text-accent-400">ideias</span>
        </a>
        <ul className="flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="flex items-center rounded-full px-3 py-2 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:text-sm"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
