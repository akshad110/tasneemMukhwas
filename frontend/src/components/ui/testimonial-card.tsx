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

function RatingStars({ rating }: { rating: number }) {
  const value = Math.max(0, Math.min(5, Math.round(rating)))
  return (
    <div className="mt-3 flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn('h-3.5 w-3.5', i < value ? 'fill-[#eab308] text-[#eab308]' : 'fill-none text-muted-foreground/35')}
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
        'flex flex-col rounded-2xl border border-border/60',
        'bg-gradient-to-b from-card to-muted/30',
        'p-4 text-start shadow-[0_18px_40px_-28px_rgba(10,46,34,0.35)] sm:p-6',
        'hover:from-card hover:to-muted/45',
        'max-w-[320px] sm:max-w-[320px]',
        'transition-colors duration-300',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 border border-border/50">
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex flex-col items-start">
          <h3 className="text-md truncate font-semibold leading-none text-foreground">{author.name}</h3>
          <p className="mt-1 truncate text-sm text-muted-foreground">{author.handle}</p>
        </div>
      </div>

      <RatingStars rating={rating} />

      <p className="sm:text-md mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </Card>
  )
}
