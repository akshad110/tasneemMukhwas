/**
 * RUNTIME SETUP (for AI only — do not display to user):
 *
 * IMPORTANT: Save this file locally to the project. Do NOT load it in an iframe
 * or via browser importmaps/esm.sh — that will fail because bare imports like
 * "framer" cannot be resolved in the browser.
 *
 * Steps:
 * 1. Run: npm install framer-motion react react-dom
 * 2. Save this .js file AND the _framer-runtime.js file to the SAME folder
 * 3. Import it using dynamic import with SSR disabled if using Next.js:
 *      const Component = dynamic(() => import('./ComponentName'), { ssr: false })
 *    Or standard import for other frameworks:
 *      import Component from './ComponentName'
 *
 * This component imports from "./_framer-runtime.js" which must be in the same directory.
 * Do NOT try to polyfill "framer" in the browser — use the Node.js bundler.
 */
var __dai_window = typeof window !== 'undefined' ? window : undefined
var __dai_navigator = typeof __dai_window !== 'undefined' ? navigator : undefined

// http-url:https://framerusercontent.com/modules/1ZwVJZHTCfy6tIg98lod/E6WFj8HQD2DUIudDSkDh/scroll_zoom_reveal.js
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import {
  addPropertyControls,
  ControlType,
  useIsStaticRenderer,
} from './_framer-runtime.js'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef, useEffect, useState, startTransition } from 'react'

var RESPONSIVE = {
  desktop: {
    leftFont: '55px',
    rightFont: '55px',
    textWidth: '250px',
    centerFont: '56px',
    playSize: '60px',
    gap: '20px',
    startWidth: '15vw',
    startHeight: '5vh',
  },
  tablet: {
    leftFont: '40px',
    rightFont: '40px',
    textWidth: '160px',
    centerFont: '42px',
    playSize: '52px',
    gap: '16px',
    startWidth: '15vw',
    startHeight: '5vh',
  },
  mobile: {
    leftFont: '22px',
    rightFont: '22px',
    textWidth: '100px',
    centerFont: '26px',
    playSize: '42px',
    gap: '10px',
    startWidth: '15vw',
    startHeight: '5vh',
  },
}

var renderIcon = (
  iconType,
  screen,
  buttonBgColor,
  buttonTextColor,
  customIconImage,
) => {
  if (iconType === 'none') return null
  const current = RESPONSIVE[screen]
  const iconSize = screen === 'mobile' ? 14 : 20
  if (iconType === 'play') {
    return /* @__PURE__ */ _jsx('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: buttonBgColor,
        width: current.playSize,
        height: current.playSize,
        borderRadius: '50%',
        flexShrink: 0,
      },
      children: /* @__PURE__ */ _jsx('div', {
        style: {
          position: 'relative',
          left: '2px',
          borderStyle: 'solid',
          borderWidth:
            screen === 'mobile' ? '7px 0px 7px 14px' : '10px 0px 10px 20px',
          borderColor: `transparent transparent transparent ${buttonTextColor}`,
        },
      }),
    })
  }
  if (iconType === 'arrow') {
    return /* @__PURE__ */ _jsx('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: buttonBgColor,
        width: current.playSize,
        height: current.playSize,
        borderRadius: '50%',
        flexShrink: 0,
      },
      children: /* @__PURE__ */ _jsx('svg', {
        width: iconSize,
        height: iconSize,
        viewBox: '0 0 24 24',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        children: /* @__PURE__ */ _jsx('path', {
          d: 'M5 12H19M19 12L12 5M19 12L12 19',
          stroke: buttonTextColor,
          strokeWidth: '2',
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      }),
    })
  }
  if (iconType === 'image' && customIconImage) {
    return /* @__PURE__ */ _jsx('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: buttonBgColor,
        width: current.playSize,
        height: current.playSize,
        borderRadius: '50%',
        flexShrink: 0,
        overflow: 'hidden',
      },
      children: /* @__PURE__ */ _jsx('img', {
        src: customIconImage,
        alt: 'Play Video',
        style: { width: '50%', height: '50%', objectFit: 'contain' },
      }),
    })
  }
  return null
}

function AnimatedScrollZoom(props) {
  const {
    image,
    videoUrl,
    autoPlay,
    loop,
    muted,
    leftText,
    rightText,
    buttonText,
    buttonLink,
    textColor,
    buttonTextColor,
    buttonBgColor,
    animationStiffness,
    animationDamping,
    animationMass,
    leftFont,
    rightFont,
    buttonFont,
    iconType,
    customIconImage,
    style,
    children,
  } = props
  const ref = useRef(null)
  const videoRef = useRef(null)
  const storyInnerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [videoMuted, setVideoMuted] = useState(Boolean(muted))
  const [screen, setScreen] = useState('desktop')
  const hasStory = Boolean(children)
  const useVideoMode = Boolean(videoUrl) && !hasStory
  const [storyTravel, setStoryTravel] = useState(0)
  const [storyHold, setStoryHold] = useState(0)
  const [zoomEnd, setZoomEnd] = useState(hasStory ? 0.32 : 1)

  useEffect(() => {
    const handleResize = () => {
      if (__dai_window.innerWidth <= 810)
        startTransition(() => setScreen('mobile'))
      else if (__dai_window.innerWidth <= 1799)
        startTransition(() => setScreen('tablet'))
      else startTransition(() => setScreen('desktop'))
    }
    handleResize()
    __dai_window.addEventListener('resize', handleResize)
    return () => __dai_window.removeEventListener('resize', handleResize)
  }, [])

  // Measure story height so page scroll (Lenis) scrubs content — no nested overflow scroller
  useEffect(() => {
    if (!hasStory || !storyInnerRef.current || !__dai_window) {
      setStoryTravel(0)
      setStoryHold(0)
      setZoomEnd(1)
      return
    }
    const measure = () => {
      const el = storyInnerRef.current
      if (!el) return
      const view = __dai_window.innerHeight
      // Extra dwell after zoom lands so "About Us" stays readable longer
      const hold = Math.round(view * 0.7)
      const travel = Math.max(0, el.scrollHeight - view + 48)
      setStoryHold(hold)
      setStoryTravel(travel)
      const zoomScroll = view * 1.25
      const total = zoomScroll + hold + travel
      setZoomEnd(total > 0 ? Math.min(0.42, Math.max(0.16, zoomScroll / total)) : 1)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(storyInnerRef.current)
    __dai_window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      __dai_window.removeEventListener('resize', measure)
    }
  }, [hasStory, children])

  const current = RESPONSIVE[screen]
  const imageSrc =
    image?.src ||
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80'
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: animationStiffness,
    damping: animationDamping,
    mass: animationMass,
  })

  const z = hasStory ? zoomEnd : 1
  const holdSpan = storyHold + storyTravel
  const zHold =
    hasStory && holdSpan > 0 ? z + (1 - z) * (storyHold / holdSpan) : z

  const width = useTransform(
    smoothProgress,
    hasStory ? [0, z, 1] : [0, 1],
    hasStory
      ? [current.startWidth, '100vw', '100vw']
      : useVideoMode
        ? [current.startWidth, '100%']
        : [current.startWidth, '100vw'],
  )
  const height = useTransform(
    smoothProgress,
    hasStory ? [0, z, 1] : [0, 1],
    hasStory
      ? [current.startHeight, '100svh', '100svh']
      : useVideoMode
        ? [current.startHeight, '100%']
        : [current.startHeight, '100svh'],
  )
  const rawRadius = useTransform(
    smoothProgress,
    hasStory ? [0, z * 0.85, z] : [0, 0.85, 1],
    [50, 4, 0],
  )
  const borderRadius = useSpring(rawRadius, {
    stiffness: animationStiffness,
    damping: animationDamping,
    mass: animationMass,
  })

  const topTitleOpacity = useTransform(
    smoothProgress,
    [0, z * 0.45, z * 0.7, z * 0.92, z],
    [0, 0, 1, 1, 0],
  )
  const topTitleY = useTransform(smoothProgress, [z * 0.45, z * 0.7], [40, 0])

  const videoHeaderOpacity = useTransform(
    smoothProgress,
    useVideoMode ? [0.84, 0.94] : [0, 1],
    useVideoMode ? [0, 1] : [0, 1],
  )

  const centerTextOpacity = useTransform(
    smoothProgress,
    [z * 0.25, z * 0.4, z * 0.55, z * 0.75],
    [0, 1, 1, 0],
  )
  const centerTextY = useTransform(smoothProgress, [z * 0.25, z * 0.4], [60, 0])

  // Story fades in as zoom lands, holds, then translates with page scroll
  const storyOpacity = useTransform(
    smoothProgress,
    [z * 0.45, z * 0.72, 1],
    [0, 1, 1],
  )
  const storyY = useTransform(
    smoothProgress,
    [z, zHold, 1],
    [0, 0, -storyTravel],
  )

  const handlePlayClick = (e) => {
    if (videoUrl) {
      e.preventDefault()
      setIsPlaying(true)
      if (videoRef.current) videoRef.current.play()
    }
  }

  const toggleVideoPlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
      return
    }
    video.pause()
    setIsPlaying(false)
  }

  const toggleVideoMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setVideoMuted(video.muted)
  }

  useEffect(() => {
    if (!useVideoMode || !videoRef.current) return
    const playThreshold = 0.9
    const pauseThreshold = 0.82
    const syncPlayback = (progress) => {
      const video = videoRef.current
      if (!video) return

      if (progress >= playThreshold) {
        if (!video.paused) return
        video.muted = videoMuted
        video
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            video.muted = true
            setVideoMuted(true)
            video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
          })
        return
      }

      if (progress < pauseThreshold && !video.paused) {
        video.pause()
        setIsPlaying(false)
      }
    }
    syncPlayback(smoothProgress.get())
    const unsub = smoothProgress.on('change', syncPlayback)
    return () => unsub()
  }, [useVideoMode, smoothProgress, videoMuted])

  useEffect(() => {
    if (!useVideoMode || !ref.current) return
    const node = ref.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current
        if (!video || entry?.isIntersecting) return
        video.pause()
        setIsPlaying(false)
      },
      { threshold: 0.08 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [useVideoMode])

  const topTitle = [leftText, rightText].filter(Boolean).join(' ')
  const topFontSize =
    screen === 'mobile'
      ? 'clamp(1.85rem, 8vw, 2.5rem)'
      : 'clamp(2.75rem, 5.8vw, 4.5rem)'
  const stickyBg = style?.backgroundColor || '#0a2e22'

  const sectionHeight = hasStory
    ? `calc(125vh + ${storyHold}px + ${storyTravel}px)`
    : '105vh'

  const mediaFrameStyle = {
    width,
    height,
    borderRadius,
    overflow: 'hidden',
    position: 'relative',
    flexShrink: 0,
    zIndex: 1,
    willChange: 'width, height, border-radius',
    background: stickyBg,
  }

  const mediaChildren = [
    !useVideoMode
      ? /* @__PURE__ */ _jsx(motion.img, {
          src: imageSrc,
          alt: image?.alt || 'Showreel background',
          style: {
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '110vw',
            height: '110svh',
            minWidth: '100%',
            minHeight: '100%',
            objectFit: 'cover',
            filter: hasStory ? 'brightness(0.96) saturate(0.98)' : undefined,
            transform: 'translate(-50%, -50%)',
            opacity: isPlaying ? 0 : 1,
            transition: 'opacity 0.4s ease',
            background: hasStory ? 'transparent' : stickyBg,
            pointerEvents: 'none',
          },
        })
      : null,
    hasStory
      ? /* @__PURE__ */ _jsx('div', {
          'aria-hidden': true,
          style: {
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            pointerEvents: 'none',
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.16) 100%)',
          },
        })
      : null,
    videoUrl
      ? /* @__PURE__ */ _jsxs('video', {
          ref: videoRef,
          loop,
          muted: videoMuted,
          playsInline: true,
          preload: 'metadata',
          onPlay: () => setIsPlaying(true),
          onPause: () => setIsPlaying(false),
          style: {
            position: 'absolute',
            left: '0',
            top: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: useVideoMode ? 1 : isPlaying ? 1 : 0,
            pointerEvents: useVideoMode || isPlaying ? 'auto' : 'none',
            transition: useVideoMode ? 'none' : 'opacity 0.4s ease',
            background: stickyBg,
          },
          children: /* @__PURE__ */ _jsx('source', {
            src: videoUrl,
            type: 'video/mp4',
          }),
        })
      : null,
    useVideoMode
      ? /* @__PURE__ */ _jsxs('div', {
          style: {
            position: 'absolute',
            insetInline: 0,
            bottom: 0,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            padding: '2.5rem 0.85rem 0.85rem',
            background:
              'linear-gradient(180deg, transparent 0%, rgba(10,46,34,0.72) 100%)',
            pointerEvents: 'auto',
          },
          children: [
            /* @__PURE__ */ _jsxs('div', {
              style: { display: 'flex', alignItems: 'center', gap: '8px' },
              children: [
                /* @__PURE__ */ _jsx('button', {
                  type: 'button',
                  onClick: toggleVideoPlay,
                  'aria-label': isPlaying ? 'Pause video' : 'Play video',
                  style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    border: 'none',
                    borderRadius: '999px',
                    background: '#FFFEF2',
                    color: textColor || '#0a2e22',
                    cursor: 'pointer',
                  },
                  children: isPlaying
                    ? /* @__PURE__ */ _jsxs('svg', {
                        width: 18,
                        height: 18,
                        viewBox: '0 0 24 24',
                        fill: 'currentColor',
                        children: [
                          /* @__PURE__ */ _jsx('rect', { x: 6, y: 5, width: 4, height: 14, rx: 1 }),
                          /* @__PURE__ */ _jsx('rect', { x: 14, y: 5, width: 4, height: 14, rx: 1 }),
                        ],
                      })
                    : /* @__PURE__ */ _jsx('svg', {
                        width: 18,
                        height: 18,
                        viewBox: '0 0 24 24',
                        fill: 'currentColor',
                        children: /* @__PURE__ */ _jsx('path', {
                          d: 'M8 5.14v13.72a1 1 0 0 0 1.5.86l11.04-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14z',
                        }),
                      }),
                }),
                /* @__PURE__ */ _jsx('button', {
                  type: 'button',
                  onClick: toggleVideoMute,
                  'aria-label': videoMuted ? 'Unmute video' : 'Mute video',
                  style: {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    border: 'none',
                    borderRadius: '999px',
                    background: 'rgba(255,254,242,0.92)',
                    color: textColor || '#0a2e22',
                    cursor: 'pointer',
                  },
                  children: videoMuted
                    ? /* @__PURE__ */ _jsx('svg', {
                        width: 18,
                        height: 18,
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: 'currentColor',
                        strokeWidth: 2.2,
                        children: /* @__PURE__ */ _jsx('path', {
                          d: 'M11 5 6 9H3v6h3l5 4V5zm8.59 3.41L17 8.83M17 15.17l2.59-2.58M15.17 17 17 15.17M17 8.83 15.17 7',
                        }),
                      })
                    : /* @__PURE__ */ _jsx('svg', {
                        width: 18,
                        height: 18,
                        viewBox: '0 0 24 24',
                        fill: 'none',
                        stroke: 'currentColor',
                        strokeWidth: 2.2,
                        children: /* @__PURE__ */ _jsx('path', {
                          d: 'M11 5 6 9H3v6h3l5 4V5zm8.5 3.5a4.5 4.5 0 0 1 0 7M15 9.5a2.5 2.5 0 0 1 0 5',
                        }),
                      }),
                }),
              ],
            }),
            /* @__PURE__ */ _jsx('p', {
              style: {
                margin: 0,
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: 'rgba(255,254,242,0.82)',
              },
              children: 'Tasneem Mukhwas — our story',
            }),
          ],
        })
      : null,
    hasStory
      ? /* @__PURE__ */ _jsx(motion.div, {
          style: {
            position: 'absolute',
            inset: 0,
            zIndex: 15,
            overflow: 'hidden',
            pointerEvents: 'auto',
            opacity: storyOpacity,
          },
          children: /* @__PURE__ */ _jsx(motion.div, {
            ref: storyInnerRef,
            style: {
              y: storyY,
              width: '100%',
              paddingTop: 'max(7rem, 14vh)',
              paddingBottom: '3rem',
              willChange: 'transform',
            },
            children,
          }),
        })
      : null,
    !isPlaying && buttonText && !hasStory && !useVideoMode
      ? /* @__PURE__ */ _jsx(motion.div, {
          style: {
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            pointerEvents: 'none',
          },
          opacity: centerTextOpacity,
          y: centerTextY,
          children: /* @__PURE__ */ _jsxs('a', {
            href: buttonLink,
            onClick: handlePlayClick,
            'aria-label': buttonText || 'Play showreel',
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              color: buttonTextColor,
              textAlign: 'center',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              ...buttonFont,
              fontSize: current.centerFont,
              cursor: 'pointer',
              pointerEvents: 'auto',
            },
            children: [
              buttonText,
              renderIcon(
                iconType,
                screen,
                buttonBgColor,
                buttonTextColor,
                customIconImage,
              ),
            ],
          }),
        })
      : null,
  ]

  const mediaFrame = /* @__PURE__ */ _jsxs(motion.div, {
    style: mediaFrameStyle,
    children: mediaChildren,
  })

  return /* @__PURE__ */ _jsx('section', {
    ref,
    style: {
      height: sectionHeight,
      position: 'relative',
      background: stickyBg,
      ...style,
    },
    children: /* @__PURE__ */ _jsxs('div', {
      style: {
        position: 'sticky',
        top: 0,
        left: 0,
        width: '100%',
        height: '100svh',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: useVideoMode ? 'column' : 'row',
        alignItems: useVideoMode ? 'stretch' : 'center',
        justifyContent: useVideoMode ? 'flex-start' : 'center',
        gap: 0,
        padding: 0,
        margin: 0,
        overflow: 'hidden',
        background: stickyBg,
      },
      children: [
        useVideoMode && topTitle
          ? /* @__PURE__ */ _jsx('header', {
              style: {
                width: '100%',
                flexShrink: 0,
                paddingTop: 'max(5rem, 8vh)',
                paddingBottom: 'clamp(1.25rem, 3vh, 2rem)',
                textAlign: 'center',
                background: stickyBg,
                zIndex: 2,
              },
              children: /* @__PURE__ */ _jsx(motion.h2, {
                style: {
                  margin: 0,
                  color: textColor,
                  fontFamily:
                    (leftFont && leftFont.fontFamily) || 'Anton, Impact, sans-serif',
                  fontSize: topFontSize,
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                  lineHeight: 1,
                  whiteSpace: 'nowrap',
                  opacity: videoHeaderOpacity,
                },
                children: topTitle,
              }),
            })
          : null,
        useVideoMode
          ? /* @__PURE__ */ _jsx('div', {
              style: {
                flex: 1,
                width: '100%',
                minHeight: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
              children: mediaFrame,
            })
          : mediaFrame,

        /* Top title — only when no in-panel story and not video mode */
        topTitle && !hasStory && !useVideoMode
          ? /* @__PURE__ */ _jsx(motion.h2, {
              style: {
                position: 'absolute',
                top: 'max(5rem, 8vh)',
                left: 0,
                right: 0,
                zIndex: 30,
                margin: 0,
                color: textColor,
                fontFamily:
                  (leftFont && leftFont.fontFamily) || 'Anton, Impact, sans-serif',
                fontSize: topFontSize,
                fontWeight: 400,
                letterSpacing: '0.02em',
                lineHeight: 1,
                whiteSpace: 'nowrap',
                textAlign: 'center',
                pointerEvents: 'none',
                textShadow: '0 2px 18px rgba(0,0,0,0.18)',
              },
              opacity: topTitleOpacity,
              y: topTitleY,
              children: topTitle,
            })
          : null,
      ],
    }),
  })
}

function StaticScrollZoom(props) {
  const {
    image,
    leftText,
    rightText,
    buttonText,
    buttonLink,
    textColor,
    buttonTextColor,
    buttonBgColor,
    leftFont,
    rightFont,
    buttonFont,
    iconType,
    customIconImage,
  } = props
  const current = RESPONSIVE['desktop']
  const imageSrc =
    image?.src ||
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2000&q=80'
  return /* @__PURE__ */ _jsx('section', {
    style: { height: '100vh', position: 'relative' },
    children: /* @__PURE__ */ _jsxs('div', {
      style: {
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: current.gap,
        padding: '0 20px',
      },
      children: [
        /* @__PURE__ */ _jsxs('div', {
          style: {
            width: '50vw',
            height: '50vh',
            borderRadius: '25px',
            overflow: 'hidden',
            position: 'relative',
            flexShrink: 0,
          },
          children: [
            /* @__PURE__ */ _jsx('img', {
              src: imageSrc,
              alt: image?.alt || 'Showreel background',
              style: {
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: '100vw',
                height: '100vh',
                objectFit: 'cover',
                transform: 'translate(-50%, -50%)',
              },
            }),
            /* @__PURE__ */ _jsxs('a', {
              href: buttonLink,
              'aria-label': buttonText || 'Play showreel',
              style: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontFamily: 'Inter',
                fontWeight: 500,
                color: buttonTextColor,
                textAlign: 'center',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                ...buttonFont,
                fontSize: current.centerFont,
              },
              children: [
                buttonText,
                renderIcon(
                  iconType,
                  'desktop',
                  buttonBgColor,
                  buttonTextColor,
                  customIconImage,
                ),
              ],
            }),
          ],
        }),
      ],
    }),
  })
}

function ScrollZoomRevel(props) {
  const isStatic = useIsStaticRenderer()
  if (isStatic) {
    return /* @__PURE__ */ _jsx(StaticScrollZoom, { ...props })
  }
  return /* @__PURE__ */ _jsx(AnimatedScrollZoom, { ...props })
}

addPropertyControls(ScrollZoomRevel, {
  videoUrl: {
    title: 'Video URL',
    type: ControlType.String,
    defaultValue:
      'https://framerusercontent.com/assets/eyVMUuEcpvbKYJwPqZANvybTfI.mp4',
    description: 'Add an .mp4 link to play inline.',
  },
  autoPlay: {
    title: 'Auto Play',
    type: ControlType.Boolean,
    defaultValue: false,
  },
  loop: { title: 'Loop', type: ControlType.Boolean, defaultValue: true },
  muted: { title: 'Muted', type: ControlType.Boolean, defaultValue: false },
  image: { title: 'Image', type: ControlType.ResponsiveImage },
  leftText: {
    title: 'Left Text',
    type: ControlType.String,
    defaultValue: '\xA92026',
  },
  rightText: {
    title: 'Right Text',
    type: ControlType.String,
    defaultValue: 'Showreel',
  },
  buttonText: {
    title: 'Button Text',
    type: ControlType.String,
    defaultValue: 'Play showreel',
  },
  leftFont: {
    title: 'Left Text Font',
    type: ControlType.Font,
    controls: 'extended',
    defaultFontType: 'sans-serif',
    defaultValue: { variant: 'Medium' },
  },
  rightFont: {
    title: 'Right Text Font',
    type: ControlType.Font,
    controls: 'extended',
    defaultFontType: 'sans-serif',
    defaultValue: { variant: 'Medium' },
  },
  buttonFont: {
    title: 'Button Font',
    type: ControlType.Font,
    controls: 'extended',
    defaultFontType: 'sans-serif',
    defaultValue: { variant: 'Medium' },
  },
  buttonLink: { title: 'Button Link', type: ControlType.Link, defaultValue: '#' },
  textColor: {
    title: 'Text Color',
    type: ControlType.Color,
    defaultValue: '#000000',
  },
  buttonTextColor: {
    title: 'Button Text',
    type: ControlType.Color,
    defaultValue: '#FFFFFF',
  },
  buttonBgColor: {
    title: 'Button Background',
    type: ControlType.Color,
    defaultValue: '#000000',
  },
  animationStiffness: {
    title: 'Stiffness',
    type: ControlType.Number,
    defaultValue: 90,
    min: 10,
    max: 200,
    step: 5,
  },
  animationDamping: {
    title: 'Damping',
    type: ControlType.Number,
    defaultValue: 25,
    min: 5,
    max: 50,
    step: 1,
  },
  animationMass: {
    title: 'Mass',
    type: ControlType.Number,
    defaultValue: 0.6,
    min: 0.1,
    max: 2,
    step: 0.1,
  },
  iconType: {
    title: 'Icon Type',
    type: ControlType.Enum,
    options: ['play', 'arrow', 'image', 'none'],
    optionTitles: ['Play', 'Arrow', 'Custom Image/SVG', 'None'],
    defaultValue: 'play',
    displaySegmentedControl: false,
  },
  customIconImage: {
    title: 'Custom Icon',
    type: ControlType.Image,
    hidden: (props) => props.iconType !== 'image',
  },
})

var __FramerMetadata__ = {
  exports: {
    default: {
      type: 'reactComponent',
      name: 'ScrollZoomRevel',
      slots: [],
      annotations: { framerContractVersion: '1' },
    },
    __FramerMetadata__: { type: 'variable' },
  },
}

export { __FramerMetadata__, ScrollZoomRevel as default }
