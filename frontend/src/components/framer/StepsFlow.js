/**
 * RUNTIME SETUP (for AI only  do not display to user):
 *
 * This component imports from "./_framer-runtime.js" which must be in the same directory.
 */
var __dai_window = typeof window !== 'undefined' ? window : undefined
var __dai_navigator = typeof __dai_window !== 'undefined' ? navigator : undefined

// http-url:https://framerusercontent.com/modules/Bh1pYbL8YMFimHelfVV6/6lahIk3YSyL4zf6fOKn9/StepsFlow.js
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime'
import { useRef, useState, useEffect } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
} from 'framer-motion'
import {
  addPropertyControls,
  ControlType,
  useIsStaticRenderer,
} from './_framer-runtime.js'

const MOBILE_DOT_CENTER = 25
const IMAGE_HEIGHT_DESKTOP = 180
const IMAGE_HEIGHT_MOBILE = 140

const SPRING = { stiffness: 95, damping: 32, mass: 0.35 }

function useIsMobile(bp, containerRef) {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const check = (width) => setIsMobile(width < bp)
    check(el.offsetWidth)
    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width
      if (typeof width === 'number') check(width)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [bp, containerRef])
  return isMobile
}

function parseFontSize(font) {
  if (!font?.fontSize) return 16
  const value = String(font.fontSize)
  return parseFloat(value) || 16
}

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight auto
 */
export default function StepsFlow(props) {
  const {
    steps = [],
    accentColor,
    lineColor,
    cornerMaskColor,
    numberFont,
    numberColor,
    titleFont,
    titleColor,
    textFont,
    textColor,
    numberTitleGap,
    titleTextGap,
    gridGap,
    imageRadius,
    mobileBreakpoint,
    imageAnimation,
    mobileImageGap,
    lineWidth,
    dotSize,
    showDots,
    cornerRadius,
  } = props
  const lastIndex = steps.length - 1
  const lastReversed = lastIndex % 2 !== 0
  const containerRef = useRef(null)
  const isMobile = useIsMobile(mobileBreakpoint, containerRef)
  const mobileDotLeft = MOBILE_DOT_CENTER - dotSize / 2
  const mobileLineLeft = MOBILE_DOT_CENTER - lineWidth / 2
  const dotOffset = dotSize / 2 - lineWidth / 2

  return _jsx('div', {
    ref: containerRef,
    style: { width: '100%' },
    children: _jsxs('div', {
      style: {
        position: 'relative',
        width: '100%',
        maxWidth: isMobile ? '100%' : 'calc(100% - 60px)',
        margin: '0 auto',
        paddingLeft: isMobile ? 30 : 0,
        paddingRight: isMobile ? 15 : 0,
      },
      children: [
        steps.map((step, index) =>
          _jsx(
            StepRow,
            {
              step,
              index,
              isFirst: index === 0,
              isLast: index === lastIndex,
              accentColor,
              lineColor,
              cornerMaskColor,
              numberFont,
              numberColor,
              titleFont,
              titleColor,
              textFont,
              textColor,
              numberTitleGap,
              titleTextGap,
              gridGap,
              imageRadius,
              isMobile,
              imageAnimation,
              mobileImageGap,
              lineWidth,
              dotSize,
              showDots,
              cornerRadius,
            },
            `${index}-${lineWidth}-${cornerRadius}`,
          ),
        ),
        showDots &&
          _jsx('div', {
            style: {
              position: 'absolute',
              top: 0,
              left: isMobile ? mobileDotLeft : -dotOffset,
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              backgroundColor: accentColor,
              zIndex: 3,
            },
          }),
        showDots &&
          _jsx('div', {
            style: {
              position: 'absolute',
              bottom: 0,
              left: isMobile
                ? mobileDotLeft
                : lastReversed
                  ? `calc(50% - ${dotOffset}px)`
                  : -dotOffset,
              width: dotSize,
              height: dotSize,
              borderRadius: '50%',
              backgroundColor: accentColor,
              zIndex: 3,
            },
          }),
        isMobile &&
          _jsx('div', {
            style: {
              position: 'absolute',
              top: 0,
              left: mobileLineLeft,
              width: lineWidth,
              height: '100%',
              backgroundColor: lineColor,
              borderRadius: showDots ? 0 : lineWidth / 2,
              zIndex: 0,
            },
          }),
      ],
    }),
  })
}

function StepRow(props) {
  const isStatic = useIsStaticRenderer()
  return isStatic
    ? _jsx(StaticStepRow, { ...props })
    : _jsx(AnimatedStepRow, { ...props })
}

function StepImage({
  step,
  imageRadius,
  lineColor,
  isMobile,
  mobileImageGap,
  style,
}) {
  const h = isMobile ? IMAGE_HEIGHT_MOBILE : IMAGE_HEIGHT_DESKTOP
  const base = {
    width: '100%',
    height: h,
    borderRadius: imageRadius,
    display: 'block',
    marginBottom: isMobile ? mobileImageGap : 0,
  }

  if (!step.image) {
    return _jsx(motion.div, {
      style: {
        ...base,
        background: lineColor,
        opacity: style?.opacity,
        y: style?.y,
      },
    })
  }

  return _jsx(motion.img, {
    src: step.image,
    alt: '',
    loading: 'lazy',
    style: {
      ...base,
      objectFit: 'cover',
      opacity: style?.opacity,
      y: style?.y,
    },
  })
}

function StaticStepRow({
  step,
  index,
  isFirst,
  isLast,
  accentColor,
  lineColor,
  cornerMaskColor,
  numberFont,
  numberColor,
  titleFont,
  titleColor,
  textFont,
  textColor,
  numberTitleGap,
  titleTextGap,
  gridGap,
  imageRadius,
  isMobile,
  mobileImageGap,
  lineWidth,
  dotSize,
  showDots,
  cornerRadius,
}) {
  const reversed = !isMobile && index % 2 !== 0
  const numberValue = parseInt(step.number, 10) || 0
  const numFontSize = parseFontSize(numberFont)
  const numLH = Math.round(numFontSize * 0.93)
  const mobileNumSize = numFontSize * 0.7
  const mobileNumLH = Math.round(mobileNumSize * 0.93)
  const mobileTitleSize = parseFontSize(titleFont) * 0.85
  const rowLineOffset = MOBILE_DOT_CENTER - lineWidth / 2 - 30
  const safeCornerRadius = Math.max(cornerRadius, lineWidth)
  const curveSize = safeCornerRadius * 2
  const maskSize = safeCornerRadius
  const curveLeftReversed = `calc(50% - ${curveSize - lineWidth}px)`
  const maskLeftReversed = `calc(50% - ${maskSize - lineWidth}px)`
  const imgH = isMobile ? IMAGE_HEIGHT_MOBILE : IMAGE_HEIGHT_DESKTOP

  if (isMobile) {
    return _jsxs('div', {
      style: {
        position: 'relative',
        padding: '18px 0 18px 20px',
        zIndex: 1,
      },
      children: [
        _jsx('div', {
          style: {
            position: 'absolute',
            top: 0,
            left: rowLineOffset,
            width: lineWidth,
            backgroundColor: accentColor,
            height: '100%',
            borderRadius: `${isFirst && !showDots ? lineWidth / 2 : 0}px ${isFirst && !showDots ? lineWidth / 2 : 0}px ${isLast && !showDots ? lineWidth / 2 : 0}px ${isLast && !showDots ? lineWidth / 2 : 0}px`,
          },
        }),
        _jsxs('div', {
          children: [
            step.image
              ? _jsx('img', {
                  src: step.image,
                  alt: '',
                  style: {
                    width: '100%',
                    height: imgH,
                    objectFit: 'cover',
                    borderRadius: imageRadius,
                    display: 'block',
                    marginBottom: mobileImageGap,
                  },
                })
              : _jsx('div', {
                  style: {
                    width: '100%',
                    height: imgH,
                    borderRadius: imageRadius,
                    background: lineColor,
                    marginBottom: mobileImageGap,
                  },
                }),
            _jsx('div', {
              style: {
                position: 'relative',
                maxHeight: mobileNumLH,
                overflow: 'hidden',
                ...numberFont,
                fontSize: mobileNumSize,
                lineHeight: `${mobileNumLH}px`,
                color: numberColor,
              },
              children: String(numberValue).padStart(2, '0'),
            }),
            _jsx('div', {
              style: {
                marginTop: numberTitleGap,
                ...titleFont,
                fontSize: mobileTitleSize,
                color: titleColor,
              },
              children: step.title,
            }),
            _jsx('div', {
              style: {
                marginTop: titleTextGap,
                ...textFont,
                color: textColor,
              },
              children: step.text,
            }),
          ],
        }),
      ],
    })
  }

  return _jsxs('div', {
    style: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      paddingTop: 28,
      paddingBottom: isLast ? 28 : 28 + lineWidth,
      gap: gridGap,
      alignItems: 'center',
    },
    children: [
      _jsx('div', {
        style: {
          position: 'absolute',
          top: isFirst ? (showDots ? dotSize / 2 : 0) : 0,
          bottom: isLast ? (showDots ? dotSize / 2 : 0) : 0,
          left: reversed ? '50%' : 0,
          width: lineWidth,
          backgroundColor: lineColor,
        },
      }),
      !isLast &&
        _jsx('div', {
          style: {
            position: 'absolute',
            bottom: 0,
            left: reversed ? 'auto' : 0,
            right: reversed ? '50%' : 'auto',
            width: '50%',
            height: lineWidth,
            backgroundColor: lineColor,
          },
        }),
      !isFirst &&
        _jsx('div', {
          style: {
            position: 'absolute',
            zIndex: 1,
            left: reversed ? maskLeftReversed : 0,
            top: -lineWidth,
            width: maskSize,
            height: maskSize,
            backgroundColor: cornerMaskColor,
          },
        }),
      !isLast &&
        _jsx('div', {
          style: {
            position: 'absolute',
            zIndex: 1,
            left: reversed ? maskLeftReversed : 0,
            bottom: 0,
            width: maskSize,
            height: maskSize,
            backgroundColor: cornerMaskColor,
          },
        }),
      !isFirst &&
        _jsx('div', {
          style: {
            position: 'absolute',
            zIndex: 2,
            left: reversed ? curveLeftReversed : 0,
            top: -lineWidth,
            width: curveSize,
            height: curveSize,
            borderRadius: curveSize / 2,
            border: `${lineWidth}px solid transparent`,
            borderTopColor: lineColor,
            transform: reversed ? 'rotate(45deg)' : 'rotate(-45deg)',
          },
        }),
      !isLast &&
        _jsx('div', {
          style: {
            position: 'absolute',
            zIndex: 2,
            left: reversed ? curveLeftReversed : 0,
            bottom: 0,
            width: curveSize,
            height: curveSize,
            borderRadius: curveSize / 2,
            border: `${lineWidth}px solid transparent`,
            borderTopColor: lineColor,
            transform: reversed ? 'rotate(135deg)' : 'rotate(225deg)',
          },
        }),
      _jsxs('div', {
        style: {
          position: 'relative',
          zIndex: 3,
          padding: reversed ? '0 36px 0 0' : '0 0 0 36px',
          gridColumnStart: reversed ? 2 : 'auto',
          gridRowStart: reversed ? 1 : 'auto',
        },
        children: [
          _jsx('div', {
            style: {
              position: 'relative',
              maxHeight: numLH,
              overflow: 'hidden',
              ...numberFont,
              fontSize: numFontSize,
              lineHeight: `${numLH}px`,
              color: numberColor,
            },
            children: String(numberValue).padStart(2, '0'),
          }),
          _jsx('div', {
            style: { marginTop: numberTitleGap, ...titleFont, color: titleColor },
            children: step.title,
          }),
          _jsx('div', {
            style: { marginTop: titleTextGap, ...textFont, color: textColor },
            children: step.text,
          }),
        ],
      }),
      _jsx('div', {
        style: {
          position: 'relative',
          zIndex: 3,
          gridColumnStart: reversed ? 1 : 'auto',
          gridRowStart: reversed ? 1 : 'auto',
        },
        children: step.image
          ? _jsx('img', {
              src: step.image,
              alt: '',
              style: {
                width: '100%',
                height: imgH,
                objectFit: 'cover',
                borderRadius: imageRadius,
                display: 'block',
              },
            })
          : _jsx('div', {
              style: {
                width: '100%',
                height: imgH,
                borderRadius: imageRadius,
                background: lineColor,
              },
            }),
      }),
    ],
  })
}

function AnimatedStepRow({
  step,
  index,
  isFirst,
  isLast,
  accentColor,
  lineColor,
  cornerMaskColor,
  numberFont,
  numberColor,
  titleFont,
  titleColor,
  textFont,
  textColor,
  numberTitleGap,
  titleTextGap,
  gridGap,
  imageRadius,
  isMobile,
  mobileImageGap,
  lineWidth,
  dotSize,
  showDots,
  cornerRadius,
}) {
  const reversed = !isMobile && index % 2 !== 0
  const stepRef = useRef(null)
  const [isNumberTriggered, setIsNumberTriggered] = useState(false)

  // Longer scrub range = smoother pipeline with Lenis
  const { scrollYProgress } = useScroll({
    target: stepRef,
    offset: ['start 0.88', 'end 0.28'],
  })

  // Use scale (0?1), not % width/height  springs on "%" strings leave gaps
  // Vertical fills first, then horizontal starts early so gold stays continuous
  const rawLineY = useTransform(scrollYProgress, [0, 0.04, 0.5], [0, 0, 1])
  const lineScaleY = useSpring(rawLineY, SPRING)

  const rawLineX = useTransform(scrollYProgress, [0, 0.38, 0.58], [0, 0, 1])
  const lineScaleX = useSpring(rawLineX, SPRING)

  const rawOpacityTop = useTransform(scrollYProgress, [0, 0.08, 0.16], [0, 0, 1])
  const opacityTop = useSpring(rawOpacityTop, SPRING)
  const rawOpacityBottom = useTransform(
    scrollYProgress,
    [0, 0.52, 0.68],
    [0, 0, 1],
  )
  const opacityBottom = useSpring(rawOpacityBottom, SPRING)

  // Image scrolls in when pipeline reaches this step
  const rawImageOpacity = useTransform(
    scrollYProgress,
    [0.08, 0.16, 0.3],
    [0, 0, 1],
  )
  const rawImageY = useTransform(scrollYProgress, [0.16, 0.36], [56, 0])
  const imageOpacity = useSpring(rawImageOpacity, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  })
  const imageY = useSpring(rawImageY, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  })


  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    if (value >= 0.2) setIsNumberTriggered(true)
  })
  useEffect(() => {
    if (scrollYProgress.get() >= 0.2) setIsNumberTriggered(true)
  }, [scrollYProgress])

  const numberValue = parseInt(step.number, 10) || 0
  const numFontSize = parseFontSize(numberFont)
  const numLH = Math.round(numFontSize * 0.93)
  const mobileNumSize = numFontSize * 0.7
  const mobileNumLH = Math.round(mobileNumSize * 0.93)
  const mobileTitleSize = parseFontSize(titleFont) * 0.85
  const rowLineOffset = MOBILE_DOT_CENTER - lineWidth / 2 - 30
  const safeCornerRadius = Math.max(cornerRadius, lineWidth)
  const curveSize = safeCornerRadius * 2
  const maskSize = safeCornerRadius
  const curveLeftReversed = `calc(50% - ${curveSize - lineWidth}px)`
  const maskLeftReversed = `calc(50% - ${maskSize - lineWidth}px)`

  if (isMobile) {
    return _jsxs(motion.div, {
      ref: stepRef,
      style: {
        position: 'relative',
        padding: '18px 0 18px 20px',
        zIndex: 1,
      },
      children: [
        _jsx(motion.div, {
          style: {
            position: 'absolute',
            top: 0,
            left: rowLineOffset,
            width: lineWidth,
            height: '100%',
            originY: 0,
            scaleY: lineScaleY,
            backgroundColor: accentColor,
            borderRadius: `${isFirst && !showDots ? lineWidth / 2 : 0}px ${isFirst && !showDots ? lineWidth / 2 : 0}px ${isLast && !showDots ? lineWidth / 2 : 0}px ${isLast && !showDots ? lineWidth / 2 : 0}px`,
          },
        }),
        _jsxs('div', {
          children: [
            _jsx(StepImage, {
              step,
              imageRadius,
              lineColor,
              isMobile: true,
              mobileImageGap,
              style: { opacity: imageOpacity, y: imageY },
            }),
            _jsxs(motion.div, {
              onViewportEnter: () => setIsNumberTriggered(true),
              viewport: { once: true, amount: 0.1 },
              style: {
                position: 'relative',
                maxHeight: mobileNumLH,
                overflow: 'hidden',
                ...numberFont,
                fontSize: mobileNumSize,
                lineHeight: `${mobileNumLH}px`,
                color: numberColor,
                opacity: isNumberTriggered ? 1 : 0,
              },
              children: [
                '0',
                _jsx(motion.span, {
                  initial: { y: '0%' },
                  animate: {
                    y: isNumberTriggered
                      ? `-${10 * (numberValue % 10)}%`
                      : '0%',
                  },
                  transition: {
                    type: 'spring',
                    damping: 30,
                    stiffness: 100 + 20 * (numberValue % 10),
                  },
                  style: {
                    position: 'absolute',
                    top: 0,
                    width: Math.round(mobileNumSize * 0.68),
                    wordBreak: 'break-all',
                  },
                  children: '0123456789',
                }),
              ],
            }),
            _jsx(motion.div, {
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
              viewport: { once: true, amount: 0.1 },
              style: {
                marginTop: numberTitleGap,
                ...titleFont,
                fontSize: mobileTitleSize,
                color: titleColor,
              },
              children: step.title,
            }),
            _jsx(motion.div, {
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
              transition: { duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] },
              viewport: { once: true, amount: 0.1 },
              style: {
                marginTop: titleTextGap,
                ...textFont,
                color: textColor,
              },
              children: step.text,
            }),
          ],
        }),
      ],
    })
  }

  return _jsxs(motion.div, {
    ref: stepRef,
    style: {
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      paddingTop: 28,
      paddingBottom: isLast ? 28 : 28 + lineWidth,
      gap: gridGap,
      alignItems: 'center',
    },
    children: [
      _jsx('div', {
        style: {
          position: 'absolute',
          top: isFirst ? (showDots ? dotSize / 2 : 0) : 0,
          bottom: isLast ? (showDots ? dotSize / 2 : 0) : 0,
          left: reversed ? '50%' : 0,
          width: lineWidth,
          backgroundColor: lineColor,
          borderRadius: `${isFirst && !showDots ? lineWidth / 2 : 0}px ${isFirst && !showDots ? lineWidth / 2 : 0}px ${isLast && !showDots ? lineWidth / 2 : 0}px ${isLast && !showDots ? lineWidth / 2 : 0}px`,
        },
      }),
      !isLast &&
        _jsx('div', {
          style: {
            position: 'absolute',
            bottom: 0,
            left: reversed ? 'auto' : 0,
            right: reversed ? '50%' : 'auto',
            width: `calc(50% + ${lineWidth}px)`,
            height: lineWidth,
            backgroundColor: lineColor,
            zIndex: 0,
          },
        }),
      !isFirst &&
        _jsx('div', {
          style: {
            position: 'absolute',
            zIndex: 1,
            left: reversed ? maskLeftReversed : 0,
            top: -lineWidth,
            width: maskSize,
            height: maskSize,
            backgroundColor: cornerMaskColor,
          },
        }),
      !isLast &&
        _jsx('div', {
          style: {
            position: 'absolute',
            zIndex: 1,
            left: reversed ? maskLeftReversed : 0,
            bottom: 0,
            width: maskSize,
            height: maskSize,
            backgroundColor: cornerMaskColor,
          },
        }),
      !isFirst &&
        _jsx('div', {
          style: {
            position: 'absolute',
            zIndex: 2,
            left: reversed ? curveLeftReversed : 0,
            top: -lineWidth,
            width: curveSize,
            height: curveSize,
            borderRadius: curveSize / 2,
            border: `${lineWidth}px solid transparent`,
            borderTopColor: lineColor,
            transform: reversed ? 'rotate(45deg)' : 'rotate(-45deg)',
          },
        }),
      !isLast &&
        _jsx('div', {
          style: {
            position: 'absolute',
            zIndex: 2,
            left: reversed ? curveLeftReversed : 0,
            bottom: 0,
            width: curveSize,
            height: curveSize,
            borderRadius: curveSize / 2,
            border: `${lineWidth}px solid transparent`,
            borderTopColor: lineColor,
            transform: reversed ? 'rotate(135deg)' : 'rotate(225deg)',
          },
        }),
      !isFirst &&
        _jsx(motion.div, {
          style: {
            position: 'absolute',
            zIndex: 2,
            left: reversed ? curveLeftReversed : 0,
            top: -lineWidth,
            width: curveSize,
            height: curveSize,
            borderRadius: curveSize / 2,
            border: `${lineWidth}px solid transparent`,
            borderTopColor: accentColor,
            transform: reversed ? 'rotate(45deg)' : 'rotate(-45deg)',
            opacity: opacityTop,
          },
        }),
      !isLast &&
        _jsx(motion.div, {
          style: {
            position: 'absolute',
            zIndex: 2,
            left: reversed ? curveLeftReversed : 0,
            bottom: 0,
            width: curveSize,
            height: curveSize,
            borderRadius: curveSize / 2,
            border: `${lineWidth}px solid transparent`,
            borderTopColor: accentColor,
            transform: reversed ? 'rotate(135deg)' : 'rotate(225deg)',
            opacity: opacityBottom,
          },
        }),
      _jsx('div', {
        style: {
          position: 'absolute',
          top: isFirst ? (showDots ? dotSize / 2 : 0) : 0,
          bottom: isLast ? (showDots ? dotSize / 2 : 0) : 0,
          left: reversed ? '50%' : 0,
          width: lineWidth,
          overflow: 'hidden',
          borderRadius: `${isFirst && !showDots ? lineWidth / 2 : 0}px ${isFirst && !showDots ? lineWidth / 2 : 0}px ${isLast && !showDots ? lineWidth / 2 : 0}px ${isLast && !showDots ? lineWidth / 2 : 0}px`,
        },
        children: _jsx(motion.div, {
          style: {
            width: '100%',
            height: '100%',
            originY: 0,
            scaleY: lineScaleY,
            backgroundColor: accentColor,
          },
        }),
      }),
      !isLast &&
        _jsx(motion.div, {
          style: {
            position: 'absolute',
            bottom: 0,
            left: reversed ? 'auto' : 0,
            right: reversed ? '50%' : 'auto',
            width: `calc(50% + ${lineWidth}px)`,
            height: lineWidth,
            originX: reversed ? 1 : 0,
            scaleX: lineScaleX,
            backgroundColor: accentColor,
            zIndex: 2,
          },
        }),
      _jsxs('div', {
        style: {
          position: 'relative',
          zIndex: 3,
          padding: reversed ? '0 36px 0 0' : '0 0 0 36px',
          gridColumnStart: reversed ? 2 : 'auto',
          gridRowStart: reversed ? 1 : 'auto',
        },
        children: [
          _jsxs(motion.div, {
            onViewportEnter: () => setIsNumberTriggered(true),
            viewport: { once: true, amount: 0.1 },
            style: {
              position: 'relative',
              maxHeight: numLH,
              overflow: 'hidden',
              ...numberFont,
              fontSize: numFontSize,
              lineHeight: `${numLH}px`,
              color: numberColor,
              opacity: isNumberTriggered ? 1 : 0,
            },
            children: [
              '0',
              _jsx(motion.span, {
                initial: { y: '0%' },
                animate: {
                  y: isNumberTriggered
                    ? `-${10 * (numberValue % 10)}%`
                    : '0%',
                },
                transition: {
                  type: 'spring',
                  damping: 30,
                  stiffness: 100 + 20 * (numberValue % 10),
                },
                style: {
                  position: 'absolute',
                  top: 0,
                  width: Math.round(numFontSize * 0.68),
                  wordBreak: 'break-all',
                },
                children: '0123456789',
              }),
            ],
          }),
          _jsx(motion.div, {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.55, delay: 0.12, ease: [0.22, 1, 0.36, 1] },
            viewport: { once: true, amount: 0.1 },
            style: {
              marginTop: numberTitleGap,
              ...titleFont,
              color: titleColor,
            },
            children: step.title,
          }),
          _jsx(motion.div, {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            transition: { duration: 0.55, delay: 0.22, ease: [0.22, 1, 0.36, 1] },
            viewport: { once: true, amount: 0.1 },
            style: {
              marginTop: titleTextGap,
              ...textFont,
              color: textColor,
            },
            children: step.text,
          }),
        ],
      }),
      _jsx('div', {
        style: {
          position: 'relative',
          zIndex: 3,
          gridColumnStart: reversed ? 1 : 'auto',
          gridRowStart: reversed ? 1 : 'auto',
          overflow: 'hidden',
          borderRadius: imageRadius,
        },
        children: _jsx(StepImage, {
          step,
          imageRadius,
          lineColor,
          isMobile: false,
          mobileImageGap,
          style: { opacity: imageOpacity, y: imageY },
        }),
      }),
    ],
  })
}

StepsFlow.defaultProps = {
  accentColor: '#B8956A',
  lineColor: '#E8E0D4',
  cornerMaskColor: '#FFFFFF',
  numberFont: {
    fontSize: 96,
    fontWeight: 300,
    lineHeight: '1.1',
    letterSpacing: '-0.02em',
  },
  numberColor: '#B8956A',
  titleFont: {
    fontSize: 24,
    fontWeight: 600,
    lineHeight: '1.3',
    letterSpacing: '-0.01em',
  },
  titleColor: '#2C2418',
  textFont: { fontSize: 14, fontWeight: 400, lineHeight: '1.65em' },
  textColor: '#7A7060',
  numberTitleGap: 36,
  titleTextGap: 12,
  gridGap: 80,
  imageRadius: 24,
  mobileBreakpoint: 809,
  imageAnimation: 'fade',
  mobileImageGap: 16,
  lineWidth: 10,
  dotSize: 30,
  showDots: true,
  cornerRadius: 50,
  steps: [
    {
      number: '01',
      title: 'Concept',
      text: 'We start with your ideas and vision, shaping the concept that lays the foundation for your future space.',
      image: '',
    },
    {
      number: '02',
      title: 'Planning',
      text: 'We refine every detail with smart planning, ensuring functionality, aesthetics, and sustainability come together.',
      image: '',
    },
    {
      number: '03',
      title: 'Construction',
      text: 'Our trusted team brings the design to life with precision, quality materials, and exceptional craftsmanship.',
      image: '',
    },
    {
      number: '04',
      title: 'Interior',
      text: 'We create and craft interiors that reflect your style and enhance the way you live and work.',
      image: '',
    },
    {
      number: '05',
      title: 'Delivery',
      text: 'We complete every detail and deliver a space that\'s ready for you to enjoy.',
      image: '',
    },
  ],
}

addPropertyControls(StepsFlow, {
  steps: {
    type: ControlType.Array,
    title: 'Steps',
    control: {
      type: ControlType.Object,
      controls: {
        number: { type: ControlType.String, title: 'Number', defaultValue: '01' },
        title: {
          type: ControlType.String,
          title: 'Title',
          defaultValue: 'Step title',
        },
        text: {
          type: ControlType.String,
          title: 'Text',
          displayTextArea: true,
          defaultValue: 'Step description',
        },
        image: { type: ControlType.Image, title: 'Image' },
      },
    },
  },
  accentColor: {
    type: ControlType.Color,
    title: 'Line Progress Color',
    defaultValue: '#B8956A',
  },
  lineColor: {
    type: ControlType.Color,
    title: 'Line Color',
    defaultValue: '#E8E0D4',
  },
  cornerMaskColor: {
    type: ControlType.Color,
    title: 'Corner Mask',
    defaultValue: '#FFFFFF',
  },
})

export const __FramerMetadata__ = {
  exports: {
    default: {
      type: 'reactComponent',
      name: 'StepsFlow',
      slots: [],
      annotations: {
        framerSupportedLayoutWidth: 'any',
        framerSupportedLayoutHeight: 'auto',
        framerContractVersion: '1',
      },
    },
    __FramerMetadata__: { type: 'variable' },
  },
}
