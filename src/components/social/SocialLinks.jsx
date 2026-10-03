import { Mail, MessageCircle } from 'lucide-react'
import { socialLinks } from '../../data/socialLinks'
import { InstagramIcon } from './BrandIcons'

const icons = {
  MessageCircle,
  Mail,
  Instagram: InstagramIcon,
}

export default function SocialLinks() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-3">
      {socialLinks.map((link) => {
        const Icon = icons[link.icon]
        return (
          <li key={link.id}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white/70 transition-colors hover:border-accent-500/40 hover:bg-white/10 hover:text-white"
            >
              {Icon && <Icon className="h-4 w-4" />}
              {link.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}
