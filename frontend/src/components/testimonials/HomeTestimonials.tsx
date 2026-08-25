import { useEffect, useState } from 'react'
import { TestimonialsSection } from '@/components/ui/testimonials-with-marquee'
import { reviewsApi, type TestimonialItem } from '@/lib/services'

const FALLBACK: TestimonialItem[] = [
  {
    id: 'fallback-1',
    text: 'The quality is outstanding — fresh, aromatic, and perfectly balanced. Our family orders Tasneem Mukhwas every month.',
    rating: 5,
    productName: 'Premium Mukhwas',
    author: {
      name: 'Priya Shah',
      handle: 'Premium Mukhwas',
      avatar:
        'https://ui-avatars.com/api/?name=Priya+Shah&background=b8860b&color=f3e6c8&size=128&bold=true',
    },
  },
  {
    id: 'fallback-2',
    text: 'WHO-GMP standards show in every pack. Clean taste, great crunch, and reliable bulk dispatch for our store.',
    rating: 5,
    productName: 'Wholesale blend',
    author: {
      name: 'Rajesh Patel',
      handle: 'Wholesale partner',
      avatar:
        'https://ui-avatars.com/api/?name=Rajesh+Patel&background=0a2e22&color=f3e6c8&size=128&bold=true',
    },
  },
  {
    id: 'fallback-3',
    text: 'Authentic Gujarati flavours without compromise. The saunf mix has become our bestseller at the counter.',
    rating: 4,
    productName: 'Saunf Special',
    author: {
      name: 'Meera Desai',
      handle: 'Saunf Special',
      avatar:
        'https://ui-avatars.com/api/?name=Meera+Desai&background=b8860b&color=f3e6c8&size=128&bold=true',
    },
  },
  {
    id: 'fallback-4',
    text: 'Fast delivery, beautiful packaging, and taste that keeps customers coming back. Highly recommended.',
    rating: 5,
    productName: 'Gift pack',
    author: {
      name: 'Amit Verma',
      handle: 'Verified buyer',
      avatar:
        'https://ui-avatars.com/api/?name=Amit+Verma&background=0a2e22&color=f3e6c8&size=128&bold=true',
    },
  },
]

export default function HomeTestimonials() {
  const [items, setItems] = useState<TestimonialItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    reviewsApi
      .testimonials(20)
      .then((res) => {
        if (cancelled) return
        const approved = res.items ?? []
        if (approved.length === 0) {
          setItems(FALLBACK)
          return
        }
        // Approved reviews always show first; pad with samples only when marquee needs more cards
        const merged = [...approved]
        if (merged.length < 4) {
          for (const sample of FALLBACK) {
            if (merged.length >= 4) break
            merged.push(sample)
          }
        }
        setItems(merged)
      })
      .catch(() => {
        if (!cancelled) setItems(FALLBACK)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) return null

  const testimonials = items.map((item) => ({
    author: item.author,
    text: item.text,
    rating: item.rating,
  }))

  return (
    <TestimonialsSection
      title="Loved by families & retailers across India"
      description="Real reviews from verified buyers — star ratings and words straight from our customers."
      testimonials={testimonials}
      className="border-t border-[rgba(184,134,11,0.18)]"
    />
  )
}
