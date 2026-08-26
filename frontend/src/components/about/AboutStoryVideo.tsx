import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  BRAND_CREAM_DEEP,
  BRAND_DISPLAY,
  BRAND_GOLD,
  BRAND_INK,
  BRAND_MUTED,
  BRAND_SANS,
  BRAND_SERIF,
} from '../../lib/brand'

const ABOUT_VIDEO_SRC = '/videos/about-brand.mp4'

export default function AboutStoryVideo() {
  const sectionRef = useRef<HTMLElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current
        if (!video) return

        if (!entry?.isIntersecting) {
          video.pause()
          setPlaying(false)
          return
        }

        video.muted = muted
        video
          .play()
          .then(() => setPlaying(true))
          .catch(() => {
            video.muted = true
            setMuted(true)
            video.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
          })
      },
      { threshold: 0.45 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [muted])

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === playerRef.current)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      try {
        await video.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
      return
    }

    video.pause()
    setPlaying(false)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  const toggleFullscreen = async () => {
    const node = playerRef.current
    if (!node) return

    try {
      if (document.fullscreenElement === node) {
        await document.exitFullscreen()
        return
      }
      await node.requestFullscreen()
    } catch {
      /* browser blocked or unsupported */
    }
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full px-5 py-12 sm:px-8 sm:py-14 md:py-16 lg:px-10"
      aria-label="Our story"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <p
          className="m-0 text-[0.62rem] font-semibold tracking-[0.22em] uppercase sm:text-[0.68rem]"
          style={{ color: BRAND_GOLD, fontFamily: BRAND_SANS }}
        >
          Our roots
        </p>
        <h2
          className="mt-3 m-0 text-[clamp(2rem,6vw,3.25rem)] leading-none tracking-[0.03em]"
          style={{ color: BRAND_INK, fontFamily: BRAND_DISPLAY, fontWeight: 400 }}
        >
          Our Story
        </h2>
        <p
          className="mx-auto mt-4 max-w-xl text-[0.92rem] leading-relaxed sm:text-[1rem]"
          style={{ color: BRAND_MUTED, fontFamily: BRAND_SERIF }}
        >
          Freshness, tradition, and trust — mukhwas crafted in Chhapi under Tasneem Mukhwas.
        </p>

        <div
          ref={playerRef}
          className={`relative mt-8 w-full max-w-[min(100%,680px)] overflow-hidden rounded-2xl border-2 shadow-[0_24px_56px_-32px_rgba(10,46,34,0.35)] sm:mt-10 ${
            isFullscreen ? 'flex max-w-none items-center justify-center bg-[#0a2e22]' : ''
          }`}
          style={{ borderColor: BRAND_CREAM_DEEP, backgroundColor: isFullscreen ? '#0a2e22' : BRAND_INK }}
        >
          <video
            ref={videoRef}
            className={`block w-full bg-[#0a2e22] object-cover ${
              isFullscreen ? 'max-h-[100vh] flex-1' : 'aspect-video'
            }`}
            src={ABOUT_VIDEO_SRC}
            playsInline
            preload="auto"
            muted={muted}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />

          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-[rgba(10,46,34,0.82)] to-transparent px-3 pb-3 pt-10 sm:px-4 sm:pb-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void togglePlay()}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 transition hover:brightness-110"
                style={{ backgroundColor: '#FFFEF2', color: BRAND_INK }}
                aria-label={playing ? 'Pause video' : 'Play video'}
              >
                {playing ? <Pause size={18} strokeWidth={2.2} /> : <Play size={18} strokeWidth={2.2} className="ml-0.5" />}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 transition hover:brightness-110"
                style={{ backgroundColor: 'rgba(255,254,242,0.92)', color: BRAND_INK }}
                aria-label={muted ? 'Unmute video' : 'Mute video'}
              >
                {muted ? <VolumeX size={18} strokeWidth={2.2} /> : <Volume2 size={18} strokeWidth={2.2} />}
              </button>
              <button
                type="button"
                onClick={() => void toggleFullscreen()}
                className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-0 transition hover:brightness-110"
                style={{ backgroundColor: 'rgba(255,254,242,0.92)', color: BRAND_INK }}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullscreen ? <Minimize size={18} strokeWidth={2.2} /> : <Maximize size={18} strokeWidth={2.2} />}
              </button>
            </div>
            <p className="m-0 hidden text-[0.72rem] font-medium sm:block" style={{ color: 'rgba(255,254,242,0.82)', fontFamily: BRAND_SANS }}>
              Tasneem Mukhwas — our story
            </p>
          </div>
        </div>

        <p
          className="mx-auto mt-6 max-w-2xl text-[0.88rem] leading-relaxed sm:mt-8 sm:text-[0.95rem]"
          style={{ color: BRAND_MUTED, fontFamily: BRAND_SANS }}
        >
          From our family in Chhapi to partners across India and beyond — watch how Tasneem Mukhwas blends
          tradition, quality, and everyday freshness in every pack we craft.
        </p>
      </div>
    </section>
  )
}
