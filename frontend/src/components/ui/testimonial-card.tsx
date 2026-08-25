import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export interface TestimonialAuthor {
  name: string
  handle: string
  avatar: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  rating?: number
  href?: string
  className?: string
}

const CARD = '#FFFEF2'
const INK = '#0a2e22'
const MUTED = 'rgba(10,46,34,0.62)'
const OUTER_BORDER = '2px solid rgba(184,134,11,0.38)'
const INNER_BORDER = '1px solid rgba(184,134,11,0.22)'

function RatingStars({ rating }: { rating: number }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)))
  return (
    <div className="mt-3 flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn('h-3.5 w-3.5', i < value ? 'fill-[#b8860b] text-[#b8860b]' : 'fill-none')}
          style={i < value ? undefined : { color: 'rgba(10,46,34,0.18)' }}
          strokeWidth={1.75}
          aria-hidden
        />
      ))}
    </div>
  )
}

export function TestimonialCard({ author, text, rating = 5, href, className }: TestimonialCardProps) {
  const Card = href ? 'a' : 'div'
  const initial = (author.name?.trim()?.[0] || 'T').toUpperCase()

  return (
    <Card
      {...(href ? { href, target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={cn(
        'flex max-w-[320px] flex-col rounded-[1.05rem] p-[4px] text-start transition-shadow duration-300 sm:max-w-[320px] sm:rounded-[1.25rem] sm:p-[5px]',
        'hover:shadow-[0_22px_44px_-24px_rgba(10,46,34,0.28)]',
        className,
      )}
      style={{
        backgroundColor: CARD,
        border: OUTER_BORDER,
        boxShadow: '0 18px 40px -28px rgba(10,46,34,0.18)',
      }}
    >
      <div
        className="flex flex-1 flex-col rounded-[0.9rem] p-4 sm:rounded-[1rem] sm:p-5"
        style={{
          backgroundColor: CARD,
          border: INNER_BORDER,
        }}
      >
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border" style={{ borderColor: 'rgba(184,134,11,0.28)' }}>
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback
              className="text-sm font-semibold"
              style={{ backgroundColor: INK, color: '#FFFEF2' }}
            >
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col items-start">
            <h3
              className="text-md truncate font-semibold leading-none"
              style={{ color: INK, fontFamily: '"Playfair Display", Georgia, serif' }}
            >
              {author.name}
            </h3>
            <p
              className="mt-1 truncate text-sm"
              style={{ color: MUTED, fontFamily: 'Montserrat, system-ui, sans-serif' }}
            >
              {author.handle}
            </p>
          </div>
        </div>

        <RatingStars rating={rating} />

        <p
          className="sm:text-md mt-3 text-sm leading-relaxed"
          style={{ color: MUTED, fontFamily: 'Montserrat, system-ui, sans-serif' }}
        >
          {text}
        </p>
      </div>
    </Card>
  )
}
