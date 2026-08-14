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
var __dai_window=typeof window!=="undefined"?window:undefined;var __dai_navigator=typeof __dai_window!=="undefined"?navigator:undefined;

// http-url:https://framerusercontent.com/modules/WRoj1wIcUjdnHiMZIER9/ktklGrqIbe15MvO6nEre/Wave_typo_ver2.js
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback, startTransition } from "react";
import { motion } from "framer-motion";
import { addPropertyControls, ControlType, RenderTarget } from "./_framer-runtime.js";
var EASE_EXPO_OUT = [0.16, 1, 0.3, 1];
var TRANSITION_SMOOTH = { duration: 0.65, ease: EASE_EXPO_OUT };
function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    const mql = __dai_window.matchMedia("(hover: none)");
    startTransition(() => {
      setIsTouch(mql.matches);
    });
    const handler = (e) => {
      startTransition(() => {
        setIsTouch(e.matches);
      });
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return isTouch;
}
function useInView(ref, threshold) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el)
      return;
    const observer = new IntersectionObserver(([entry]) => {
      startTransition(() => {
        setInView(entry.isIntersecting);
      });
    }, { threshold: Math.max(0.05, Math.min(threshold, 1)) });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
  return inView;
}
function GooeyFilterDef({ id, blur, threshold }) {
  const alphaMultiplier = Math.max(10, Math.min(threshold, 100));
  const alphaShift = -(alphaMultiplier / 2 - 0.5);
  return /* @__PURE__ */ _jsx("svg", { style: { position: "absolute", width: 0, height: 0, overflow: "hidden", pointerEvents: "none" }, "aria-hidden": "true", children: /* @__PURE__ */ _jsx("defs", { children: /* @__PURE__ */ _jsxs("filter", { id, children: [/* @__PURE__ */ _jsx("feGaussianBlur", { in: "SourceGraphic", stdDeviation: blur, result: "blur" }), /* @__PURE__ */ _jsx("feColorMatrix", { in: "blur", type: "matrix", values: `
                            1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            0 0 0 ${alphaMultiplier} ${alphaShift}
                        `, result: "goo" }), /* @__PURE__ */ _jsx("feComposite", { in: "SourceGraphic", in2: "goo", operator: "atop" })] }) }) });
}
function TypographyHoverMetaball(props) {
  const { text = "TEXT HERE", initialColor = "#ffffff", hoverColor = "#ff3c5f", font, fontSize = 72, hoverScale = 1.08, metaballIntensity = 8, metaballThreshold = 35, transitionSpeed = 0.55, mobileThreshold = 0.45, style } = props;
  const filterIdRef = useRef(`gooey-${Math.random().toString(36).slice(2, 9)}`);
  const filterId = filterIdRef.current;
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    startTransition(() => {
      setIsClient(true);
    });
  }, []);
  const isOnCanvas = RenderTarget.current() === RenderTarget.canvas;
  const containerRef = useRef(null);
  const charRefsArray = useRef([]);
  const mouseXRef = useRef(null);
  const isHoveredRef = useRef(false);
  const rafId = useRef(0);
  const [isHovered, setIsHovered] = useState(false);
  const isTouchRaw = useIsTouchDevice();
  const isTouchDevice = isClient ? isTouchRaw : false;
  const isInView = useInView(containerRef, mobileThreshold);
  const isActive = isTouchDevice ? isInView : isHovered;
  const handlePointerMove = useCallback((e) => {
    if (isTouchDevice)
      return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseXRef.current = e.clientX - rect.left;
    }
  }, [isTouchDevice]);
  const handlePointerEnter = useCallback((e) => {
    if (isTouchDevice)
      return;
    isHoveredRef.current = true;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      mouseXRef.current = e.clientX - rect.left;
    }
    setIsHovered(true);
  }, [isTouchDevice]);
  const handlePointerLeave = useCallback(() => {
    if (isTouchDevice)
      return;
    isHoveredRef.current = false;
    mouseXRef.current = null;
    setIsHovered(false);
  }, [isTouchDevice]);
  useEffect(() => {
    if (!isClient || isTouchDevice)
      return;
    const LERP_SPEED = 0.12;
    const RADIUS = fontSize * 2.5;
    const extraScale = hoverScale - 1;
    const currentScales = new Array(text.length).fill(1);
    const tick = () => {
      const chars = charRefsArray.current;
      const mouseX = mouseXRef.current;
      const hovered = isHoveredRef.current;
      for (let i = 0; i < chars.length; i++) {
        const el = chars[i];
        if (!el)
          continue;
        let targetScale = 1;
        if (hovered && mouseX !== null) {
          const charRect = el.getBoundingClientRect();
          const containerRect = containerRef.current?.getBoundingClientRect();
          if (containerRect) {
            const charCenterX = charRect.left - containerRect.left + charRect.width / 2;
            const distance = Math.abs(mouseX - charCenterX);
            if (distance < RADIUS) {
              const t = 1 - distance / RADIUS;
              const influence = t * t * (3 - 2 * t);
              targetScale = 1 + extraScale * influence;
            }
          }
        }
        currentScales[i] += (targetScale - currentScales[i]) * LERP_SPEED;
        if (Math.abs(currentScales[i] - 1) < 1e-3) {
          currentScales[i] = 1;
        }
        el.style.transform = `scale(${currentScales[i]})`;
        el.style.color = currentScales[i] > 1.005 ? hoverColor : initialColor;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [isClient, isTouchDevice, text, fontSize, hoverScale, hoverColor, initialColor]);
  if (!isClient) {
    return /* @__PURE__ */ _jsx("div", { style: { ...style, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }, children: /* @__PURE__ */ _jsx("span", { style: { ...font || {}, fontSize, color: initialColor }, children: text }) });
  }
  if (isOnCanvas) {
    return /* @__PURE__ */ _jsxs("div", { style: { ...style, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }, children: [/* @__PURE__ */ _jsx("span", { style: { ...font || {}, fontSize, color: initialColor, whiteSpace: "nowrap" }, children: text }), /* @__PURE__ */ _jsx("div", { style: { position: "absolute", bottom: 6, right: 8, fontSize: 9, color: "rgba(255,255,255,0.35)", fontFamily: "Inter, sans-serif", letterSpacing: "0.06em", pointerEvents: "none" }, children: "METABALL \u2197" })] });
  }
  return /* @__PURE__ */ _jsxs(_Fragment, { children: [/* @__PURE__ */ _jsx(GooeyFilterDef, { id: filterId, blur: metaballIntensity, threshold: metaballThreshold }), /* @__PURE__ */ _jsxs(motion.div, { ref: containerRef, onPointerMove: handlePointerMove, onPointerEnter: handlePointerEnter, onPointerLeave: handlePointerLeave, style: { ...style, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "visible", transform: "translateZ(0)", backfaceVisibility: "hidden", WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }, children: [/* @__PURE__ */ _jsx("div", { "aria-label": text, style: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    overflow: "visible",
    // Apply the SVG gooey filter ONLY when hovered
    filter: isActive ? `url(#${filterId})` : "none",
    WebkitFilter: isActive ? `url(#${filterId})` : "none",
    // Smooth transition for filter on/off
    transition: "filter 0.3s ease, -webkit-filter 0.3s ease"
  }, children: text.split("").map((char, index) => /* @__PURE__ */ _jsx(motion.span, { ref: (el) => {
    charRefsArray.current[index] = el;
  }, "aria-hidden": "true", ...isTouchDevice ? { animate: isInView ? { scale: hoverScale, color: hoverColor } : { scale: 1, color: initialColor }, transition: { type: "spring", stiffness: 400, damping: 22, mass: 0.6, delay: index * 0.03 } } : {}, style: { ...font || {}, fontSize, color: initialColor, display: "inline-block", whiteSpace: "pre", willChange: "transform, color", transformOrigin: "center bottom", transition: isTouchDevice ? void 0 : "color 0.2s ease" }, children: char }, `${char}-${index}`)) }), /* @__PURE__ */ _jsx(motion.div, { animate: { opacity: isActive ? 0.35 : 0, scale: isActive ? 1.2 : 0.8 }, transition: TRANSITION_SMOOTH, style: { position: "absolute", width: "80%", height: "120%", borderRadius: "50%", background: `radial-gradient(ellipse at center, ${hoverColor}30, transparent 70%)`, filter: "blur(40px)", zIndex: 0, pointerEvents: "none", willChange: "transform, opacity" } })] })] });
}
TypographyHoverMetaball.displayName = "METABALLTEXT";
TypographyHoverMetaball.defaultProps = { text: "TEXT HERE", initialColor: "#ffffff", hoverColor: "#ff3c5f", font: { fontFamily: "Inter", fontWeight: 800, fontSize: 72, lineHeight: "1em", letterSpacing: "-0.03em" }, fontSize: 72, hoverScale: 1.3, metaballIntensity: 8, metaballThreshold: 35, transitionSpeed: 0.55, mobileThreshold: 0.45 };
addPropertyControls(TypographyHoverMetaball, {
  // ── Typography ───────────────────────────────────────────────────────────
  text: { type: ControlType.String, title: "Text", defaultValue: "TEXT HERE", placeholder: "Enter display text\u2026" },
  font: { type: ControlType.Font, title: "Font Style", controls: "extended", defaultValue: { fontFamily: "Inter", fontWeight: 800, fontSize: 72, lineHeight: "1em", letterSpacing: "-0.03em" } },
  fontSize: { type: ControlType.Number, title: "Font Size", defaultValue: 72, min: 12, max: 400, step: 1, unit: "px" },
  // ── Colors ───────────────────────────────────────────────────────────────
  initialColor: { type: ControlType.Color, title: "Default Color", defaultValue: "#ffffff" },
  hoverColor: { type: ControlType.Color, title: "Hover Color", defaultValue: "#ff3c5f" },
  // ── Hover Scale ──────────────────────────────────────────────────────────
  hoverScale: { type: ControlType.Number, title: "Hover Scale", defaultValue: 1.3, min: 1, max: 2, step: 0.01, description: "Scale factor for hovered characters. Higher values make the metaball merge more visible." },
  // ── Metaball Effect ──────────────────────────────────────────────────────
  metaballIntensity: { type: ControlType.Number, title: "Gooey Blur", defaultValue: 8, min: 1, max: 30, step: 1, unit: "px", description: "Blur radius for the metaball effect. Higher = softer, more liquid merging." },
  metaballThreshold: { type: ControlType.Number, title: "Gooey Sharpness", defaultValue: 35, min: 10, max: 80, step: 1, description: "Alpha threshold for edge sharpening. Lower = more gooey, Higher = crisper edges." },
  // ── Animation ────────────────────────────────────────────────────────────
  transitionSpeed: { type: ControlType.Number, title: "Transition", defaultValue: 0.55, min: 0.1, max: 2, step: 0.05, unit: "s", description: "Duration for hover animations." },
  // ── Mobile Fallback ──────────────────────────────────────────────────────
  mobileThreshold: { type: ControlType.Number, title: "Mobile Threshold", defaultValue: 0.45, min: 0.1, max: 1, step: 0.05, description: "IntersectionObserver threshold on touch devices. When this % of the component enters the viewport, the hover state triggers automatically." }
});
var __FramerMetadata__ = { "exports": { "default": { "type": "reactComponent", "name": "TypographyHoverMetaball", "slots": [], "annotations": { "framerSupportedLayoutWidth": "any", "framerIntrinsicHeight": "120", "framerDisableUnlink": "* @framerIntrinsicWidth 600", "framerContractVersion": "1", "framerSupportedLayoutHeight": "any" } }, "__FramerMetadata__": { "type": "variable" } } };
export {
  __FramerMetadata__,
  TypographyHoverMetaball as default
};
