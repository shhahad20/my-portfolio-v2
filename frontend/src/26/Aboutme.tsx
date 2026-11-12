import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { PERSONAS } from "./aboutPersonas";
import "./style/Aboutme.scss";

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT ME — five-character ring, one character per topic of my background.
//
// Discrete UI (active topic, grid/focus view, hotspots, toast) lives in React
// state. The continuous ring motion is a small spring engine that writes
// transforms straight to the DOM on rAF, so dragging and spinning never
// re-render React per frame. Imperative visual flags are data-* attributes so
// React's className reconciliation can never wipe them.
// ─────────────────────────────────────────────────────────────────────────────

const N = PERSONAS.length;
const STEP = (2 * Math.PI) / N;
const STIFF = 95;
const DAMP = 2 * Math.sqrt(STIFF);
const AUTOPLAY_MS = 5000;
const FOCUS_MS = 950;
/** Below this deck width the grid view switches from one row to 3 + 2. */
const GRID_ONE_ROW_MIN = 900;
/** Matches $bp-stack in Aboutme.scss: focus slip becomes a bottom sheet. */
const STACK_BP = 1023;
const CV_HREF = "/CV_ Shahad_Altharwa_Software_Engineer2025v2.pdf";

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const mod = (n: number, m: number) => ((n % m) + m) % m;
const wrapAngle = (a: number) => {
  let m = (a + Math.PI) % (2 * Math.PI);
  if (m < 0) m += 2 * Math.PI;
  return m - Math.PI;
};
const shortest = (target: number, from: number) => mod(target - from + N / 2, N) - N / 2;
const matches = (q: string) =>
  typeof window !== "undefined" && !!window.matchMedia?.(q).matches;

/** Restart a CSS animation keyed off a data attribute. */
const restartAttr = (el: HTMLElement | null, name: string) => {
  if (!el) return;
  el.removeAttribute(name);
  void el.offsetWidth;
  el.setAttribute(name, "");
};
const setFlag = (el: HTMLElement | null, name: string, on: boolean) => {
  if (!el) return;
  if (on) el.setAttribute(name, "");
  else el.removeAttribute(name);
};

/** Renders **bold** markdown markers as <strong> elements. */
function renderParagraph(text: string): React.ReactNode {
  return text.split(/(\*\*.*?\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? <strong key={index}>{part.slice(2, -2)}</strong> : part,
  );
}

// ─── Ring engine ─────────────────────────────────────────────────────────────

interface Phys {
  pos: number;
  goal: number;
  vel: number;
  W: number;
  H: number;
  mobile: boolean;
  bottomPad: number;
  topPad: number;
  modelH: number;
  dragPx: number;
  dirty: boolean;
  raf: number;
  last: number;
  dragging: boolean;
  visible: boolean;
  dragEnd: number;
}

interface UiFlags {
  active: number;
  isGrid: boolean;
  focusOpen: boolean;
  slipHover: boolean;
}

interface EngineCtx {
  phys: Phys;
  ui: UiFlags;
  reducedMotion: boolean;
  getStage: () => HTMLDivElement | null;
  getDeck: () => HTMLDivElement | null;
  getRing: () => HTMLSpanElement | null;
  models: (HTMLDivElement | null)[];
  labels: (HTMLSpanElement | null)[];
  onIndex: (i: number) => void;
}

type BodyCache = { op: string; vis: string; pe: string; filt: string; z: number };

function createRingEngine(ctx: EngineCtx) {
  const p = ctx.phys;
  const ui = ctx.ui;
  const cache: BodyCache[] = PERSONAS.map(() => ({ op: "", vis: "", pe: "", filt: "", z: -1 }));

  function place(i: number, x: number, y: number, s: number, op: number, blur: number, z: number) {
    const el = ctx.models[i];
    if (!el) return;
    const c = cache[i];
    const w = p.modelH * 0.88;
    if (x + (w * s) / 2 < -4 || x - (w * s) / 2 > p.W + 4) op = 0;
    el.style.transform = `translate3d(${x.toFixed(1)}px, ${(y - p.H).toFixed(1)}px, 0) translateX(-50%) scale(${s.toFixed(4)})`;

    const opStr = op.toFixed(3);
    if (c.op !== opStr) el.style.opacity = c.op = opStr;
    const vis = op < 0.01 ? "hidden" : "visible";
    if (c.vis !== vis) el.style.visibility = c.vis = vis;
    const pe = op < 0.5 ? "none" : "auto";
    if (c.pe !== pe) el.style.pointerEvents = c.pe = pe;
    const filt = blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : "none";
    if (c.filt !== filt) el.style.filter = c.filt = filt;
    if (c.z !== z) {
      el.style.zIndex = String(z);
      c.z = z;
    }
  }

  function layoutRing() {
    const stage = ctx.getStage();
    if (!stage) return;
    const { W, H, mobile, topPad, bottomPad, modelH, pos } = p;
    const cx = W * 0.5;
    const cy = topPad + (H - topPad - bottomPad) * 0.5 + 10;
    const ry = (H - topPad - bottomPad) * (mobile ? 0.35 : 0.38);
    const rx = Math.min(W * (mobile ? 0.33 : 0.32), ry * (mobile ? 1.25 : 1.75));
    const frontH = H * (mobile ? 0.22 : 0.29);
    const front = frontH / modelH;

    stage.style.setProperty("--loop-y", `${cy - frontH * 0.5 - 10}px`);
    stage.style.setProperty("--ring-y", `${cy}px`);
    const ring = ctx.getRing();
    if (ring) {
      ring.style.width = `${2 * rx}px`;
      ring.style.height = `${2 * ry}px`;
    }

    for (let i = 0; i < N; i++) {
      const a = wrapAngle((i - pos) * STEP);
      const depth = (1 + Math.cos(a)) / 2;
      const near = Math.min(Math.max(1 - Math.abs(a) / STEP, 0), 1);
      const s = front * (0.58 + 0.42 * depth) * (1 + 0.16 * near);
      const x = cx + rx * Math.sin(a);
      const y = cy + ry * Math.cos(a) + modelH * s * 0.06;
      const blur = Math.max(0, (1 - depth) * 1.8 - 0.2);
      ctx.models[i]?.classList.toggle("is-active-front", near > 0.85);
      place(i, x, y, s, 1, blur, Math.round(depth * 1000) + 10);
    }
  }

  function layoutGrid() {
    const { W, H, modelH } = p;
    const positionLabel = (i: number, x: number, y: number) => {
      const lbl = ctx.labels[i];
      if (lbl) lbl.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translateX(-50%)`;
    };

    if (W < GRID_ONE_ROW_MIN) {
      // Tablet / mobile: two rows — three on top, two centred below.
      const top = 76;
      const gutter = W < 520 ? 0 : 48;
      const innerW = W - gutter * 2;
      const rowH = (H - 130 - top) / 2;
      const s = Math.min(rowH - 44, (innerW / 3) * 0.82) / modelH;
      for (let i = 0; i < N; i++) {
        const firstRow = i < 3;
        const colW = firstRow ? innerW / 3 : innerW / 2;
        const x = gutter + colW * ((firstRow ? i : i - 3) + 0.5);
        const y = top + rowH * (firstRow ? 1 : 2) - 30;
        place(i, x, y, s, 1, 0, firstRow ? 10 : 11);
        positionLabel(i, x, y + 10);
      }
    } else {
      // Desktop: one balanced row, inset so the edge figures clear the
      // Ring/Grid toggle.
      const top = 90;
      const gutter = 64;
      const availH = H - 150 - top;
      const colW = (W - gutter * 2) / N;
      const s = Math.min(availH, colW * 0.84) / modelH;
      // Centre the row (figure + label) vertically in the deck.
      const y = Math.min(top + availH * 0.85, (H + modelH * s) / 2 - 20);
      for (let i = 0; i < N; i++) {
        const x = gutter + colW * (i + 0.5);
        place(i, x, y, s, 1, 0, 10);
        positionLabel(i, x, y + 14);
      }
    }
  }

  function kick() {
    if (!p.raf && p.visible) {
      p.last = performance.now();
      p.raf = requestAnimationFrame(tick);
    }
  }

  function tick(t: number) {
    p.raf = 0;
    const dt = p.last ? Math.max(0, Math.min(0.034, (t - p.last) / 1000)) : 1 / 60;
    p.last = t;

    if (ctx.reducedMotion) {
      p.pos = p.goal;
      p.vel = 0;
    } else {
      const h = dt / 3;
      for (let k = 0; k < 3; k++) {
        const acc = -STIFF * (p.pos - p.goal) - DAMP * p.vel;
        p.vel += acc * h;
        p.pos += p.vel * h;
      }
    }

    let moving = true;
    if (Math.abs(p.pos - p.goal) <= 5e-4 && Math.abs(p.vel) <= 5e-4) {
      p.pos = p.goal;
      p.vel = 0;
      moving = false;
    }

    setFlag(ctx.getDeck(), "data-moving", moving || p.dragging);

    if (!ui.isGrid && (moving || p.dirty || p.dragging)) {
      layoutRing();
      p.dirty = false;
    }
    if (moving || p.dragging) kick();
  }

  function measure() {
    const stage = ctx.getStage();
    if (!stage) return;
    p.W = stage.clientWidth;
    p.H = stage.clientHeight;
    p.mobile = window.innerWidth < 810;
    p.bottomPad = p.mobile ? 168 : 120;
    p.topPad = p.mobile ? 72 : 96;
    p.modelH = Math.max(220, Math.round((p.H - p.bottomPad - 18 - p.topPad) / 1.08));
    stage.style.setProperty("--model-h", `${p.modelH}px`);
    p.dragPx = Math.max(p.mobile ? 100 : 130, p.W * 0.28);
    if (ui.isGrid) layoutGrid();
    p.dirty = true;
    kick();
  }

  function selectIndex(i: number) {
    i = mod(i, N);
    if (ui.active === i) return;
    ui.active = i;
    ctx.onIndex(i);
  }

  function goTo(g: number) {
    p.goal = g;
    selectIndex(Math.round(g));
    kick();
  }

  return {
    measure,
    kick,
    layoutRing,
    layoutGrid,
    selectIndex,
    goTo,
    next: () => goTo(Math.round(p.goal) + 1),
    prev: () => goTo(Math.round(p.goal) - 1),
    jumpTo: (i: number) => goTo(Math.round(p.goal) + shortest(i, ui.active)),
    frontIndex: () => mod(Math.round(p.goal), N),
    resetCache: () => cache.forEach((c) => ((c.op = ""), (c.filt = ""))),
    stop: () => {
      if (p.raf) cancelAnimationFrame(p.raf);
      p.raf = 0;
    },
  };
}

// ─── Component ───────────────────────────────────────────────────────────────

interface FocusModel {
  idx: number;
  h: number;
  nonce: number;
}

const AboutMe: React.FC = () => {
  const [reducedMotion] = useState(() => matches("(prefers-reduced-motion: reduce)"));

  const [active, setActive] = useState(0);
  const [isGrid, setIsGrid] = useState(false);
  const [focusOpen, setFocusOpen] = useState(false);
  const [focusModel, setFocusModel] = useState<FocusModel | null>(null);
  const [autoplay, setAutoplay] = useState(() => !reducedMotion);
  const [hot, setHot] = useState(0);
  const [toast, setToast] = useState({ text: "", on: false });
  const [live, setLive] = useState("");

  // DOM refs
  const deckRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const focusStageRef = useRef<HTMLDivElement>(null);
  const focusModelRef = useRef<HTMLDivElement>(null);
  const focusCloseRef = useRef<HTMLButtonElement>(null);
  const slipRef = useRef<HTMLElement>(null);
  const linesRef = useRef<HTMLUListElement>(null);
  const nowRef = useRef<HTMLDivElement>(null);
  const piecesRef = useRef<HTMLUListElement>(null);
  const modelEls = useRef<(HTMLDivElement | null)[]>([]);
  const figEls = useRef<(HTMLDivElement | null)[]>([]);
  const labelEls = useRef<(HTMLSpanElement | null)[]>([]);

  // Mutable interaction state
  const phys = useRef<Phys>({
    pos: reducedMotion ? 0 : -0.95,
    goal: 0,
    vel: 0,
    W: 0,
    H: 0,
    mobile: false,
    bottomPad: 120,
    topPad: 96,
    modelH: 560,
    dragPx: 140,
    dirty: true,
    raf: 0,
    last: 0,
    dragging: false,
    visible: true,
    dragEnd: 0,
  });
  const ui = useRef<UiFlags>({ active: 0, isGrid: false, focusOpen: false, slipHover: false });
  const drag = useRef({ id: null as number | null, startX: 0, startY: 0, startGoal: 0, trail: [] as { x: number; t: number }[] });
  const timers = useRef({ toast: 0, close: 0, anim: 0 });
  const flipSrc = useRef<number | null>(null);
  const focusNonce = useRef(0);

  const [engine] = useState(() =>
    createRingEngine({
      phys: phys.current,
      ui: ui.current,
      reducedMotion,
      getStage: () => stageRef.current,
      getDeck: () => deckRef.current,
      getRing: () => ringRef.current,
      models: modelEls.current,
      labels: labelEls.current,
      onIndex: setActive,
    }),
  );

  const char = PERSONAS[active];
  const focusChar = PERSONAS[focusModel?.idx ?? active];

  // ── Actions ────────────────────────────────────────────────────────────────

  const stopAuto = useCallback(() => setAutoplay(false), []);

  const showToast = useCallback((text: string) => {
    setToast({ text, on: true });
    window.clearTimeout(timers.current.toast);
    timers.current.toast = window.setTimeout(() => setToast((t) => ({ ...t, on: false })), 2500);
  }, []);

  const closeFocus = useCallback(() => {
    if (!ui.current.focusOpen) return;
    ui.current.focusOpen = false;

    const modelEl = focusModelRef.current;
    const srcFig = figEls.current[engine.frontIndex()];
    const dstFig = modelEl?.querySelector<HTMLElement>(".model__fig");
    if (modelEl && srcFig && dstFig && !reducedMotion) {
      const s = srcFig.getBoundingClientRect();
      const d = dstFig.getBoundingClientRect();
      modelEl.style.transform = `translate3d(${(s.left - d.left).toFixed(1)}px, ${(s.bottom - d.bottom).toFixed(1)}px, 0) scale(${(s.height / d.height).toFixed(4)})`;
    }

    setFocusOpen(false);
    setHot(0);
    window.clearTimeout(timers.current.close);
    timers.current.close = window.setTimeout(() => setFocusModel(null), reducedMotion ? 0 : FOCUS_MS);

    const ae = document.activeElement;
    if (ae && (focusRef.current?.contains(ae) || slipRef.current?.contains(ae))) {
      stageRef.current?.focus({ preventScroll: true });
    }
  }, [engine, reducedMotion]);

  const openFocus = useCallback(() => {
    if (ui.current.focusOpen || !focusStageRef.current) return;
    setAutoplay(false);
    setHot(0);
    window.clearTimeout(timers.current.close);

    const rect = focusStageRef.current.getBoundingClientRect();
    const h = Math.max(180, Math.min(rect.height, rect.width / 0.88));
    flipSrc.current = engine.frontIndex();
    ui.current.focusOpen = true;
    focusNonce.current += 1;
    setFocusModel({ idx: ui.current.active, h, nonce: focusNonce.current });
    setFocusOpen(true);
  }, [engine]);

  const setGridMode = useCallback(
    (on: boolean) => {
      if (ui.current.isGrid === on || ui.current.focusOpen) return;
      setAutoplay(false);
      ui.current.isGrid = on;

      const factor = on ? 0.32 : 0.24;
      modelEls.current.forEach((el, i) => {
        const stagger = Math.round((Math.abs(wrapAngle((i - phys.current.pos) * STEP)) / Math.PI) * 2);
        el?.style.setProperty("--d", `${(stagger * factor).toFixed(3)}s`);
      });

      const deck = deckRef.current;
      setFlag(deck, "data-anim", true);
      window.clearTimeout(timers.current.anim);
      timers.current.anim = window.setTimeout(() => setFlag(deck, "data-anim", false), reducedMotion ? 0 : 1700);

      if (on) {
        engine.layoutGrid();
      } else {
        engine.resetCache();
        phys.current.dirty = true;
        engine.layoutRing();
      }
      engine.kick();
      setIsGrid(on);
    },
    [engine, reducedMotion],
  );

  const hotAndScroll = (p: number) => {
    setHot(p);
    linesRef.current
      ?.querySelector(`.line[data-p="${p}"]`)
      ?.scrollIntoView({ block: "nearest", behavior: reducedMotion ? "auto" : "smooth" });
  };

  // ── Stage pointer / keyboard ───────────────────────────────────────────────

  const onStagePointerDown = (e: React.PointerEvent) => {
    if (ui.current.focusOpen || ui.current.isGrid || e.button !== 0) return;
    const d = drag.current;
    d.startX = e.clientX;
    d.startY = e.clientY;
    d.startGoal = phys.current.goal;
    d.id = e.pointerId;
    d.trail = [{ x: e.clientX, t: performance.now() }];
  };

  const onStageClick = (e: React.MouseEvent) => {
    if (performance.now() - phys.current.dragEnd < 60) return;
    const hit = (e.target as Element).closest<HTMLElement>(".model__hit");
    if (!hit) return;
    const i = Number(hit.dataset.i);
    const p = phys.current;

    if (ui.current.isGrid) {
      p.goal = p.pos = i;
      p.vel = 0;
      engine.selectIndex(i);
      openFocus();
      return;
    }
    const d = shortest(i, Math.round(p.goal));
    if (d === 0) {
      openFocus();
    } else {
      stopAuto();
      engine.goTo(Math.round(p.goal) + d);
    }
  };

  const onStageKeyDown = (e: React.KeyboardEvent) => {
    if (ui.current.focusOpen) return;
    const grid = ui.current.isGrid;
    const keyMap: Record<string, (() => void) | undefined> = {
      ArrowRight: engine.next,
      ArrowLeft: engine.prev,
      ArrowDown: grid ? () => engine.jumpTo(ui.current.active + 2) : undefined,
      ArrowUp: grid ? () => engine.jumpTo(ui.current.active - 2) : undefined,
    };
    const fn = keyMap[e.key];
    if (fn) {
      e.preventDefault();
      stopAuto();
      fn();
    } else if (e.key === "Enter" && e.target === e.currentTarget) {
      e.preventDefault();
      if (grid) {
        const p = phys.current;
        p.goal = p.pos = ui.current.active;
        p.vel = 0;
      }
      openFocus();
    }
  };

  // ── Effects ────────────────────────────────────────────────────────────────

  // Mount: sizing, visibility, global pointer/wheel/keyboard listeners.
  useEffect(() => {
    const stage = stageRef.current;
    const deck = deckRef.current;
    if (!stage || !deck) return;
    const p = phys.current;
    const d = drag.current;

    const endDrag = (e: PointerEvent) => {
      if (d.id === null || e.pointerId !== d.id) return;
      d.id = null;
      if (!p.dragging) return;
      p.dragging = false;
      setFlag(deck, "data-dragging", false);
      try {
        stage.releasePointerCapture(e.pointerId);
      } catch {
        /* capture already released */
      }
      p.dragEnd = performance.now();

      const dx = e.clientX - d.startX;
      let v = 0;
      if (d.trail.length >= 2) {
        const first = d.trail[0];
        const last = d.trail[d.trail.length - 1];
        const dt = last.t - first.t;
        if (dt > 0) v = (last.x - first.x) / dt;
      }
      const base = Math.round(d.startGoal);
      let target = base;
      if (p.mobile) {
        if (Math.abs(dx) > 30 || Math.abs(v) > 0.3) target = base + (dx < 0 ? 1 : -1);
      } else {
        target = Math.round(p.goal - (v * 160) / p.dragPx);
        if (target === base && Math.abs(v) > 0.3) target = base + (v < 0 ? 1 : -1);
        target = Math.max(base - 2, Math.min(base + 2, target));
      }
      engine.goTo(target);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (d.id === null || e.pointerId !== d.id) return;
      if (e.pointerType === "mouse" && e.buttons === 0) {
        endDrag(e);
        return;
      }
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      if (!p.dragging) {
        if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
          d.id = null;
          return;
        }
        if (Math.abs(dx) > 8 && Math.abs(dx) > 1.2 * Math.abs(dy)) {
          p.dragging = true;
          setFlag(deck, "data-dragging", true);
          stage.setPointerCapture(e.pointerId);
          setAutoplay(false);
        }
      }
      if (p.dragging) {
        d.trail.push({ x: e.clientX, t: performance.now() });
        if (d.trail.length > 6) d.trail.shift();
        p.goal = d.startGoal - dx / p.dragPx;
        engine.selectIndex(Math.round(p.goal));
        engine.kick();
      }
    };

    let wheelSum = 0;
    let wheelLocked = false;
    let wheelTimer = 0;
    const onWheel = (e: WheelEvent) => {
      if (ui.current.focusOpen || ui.current.isGrid) return;
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (wheelLocked) return;
      wheelSum += e.deltaX;
      if (Math.abs(wheelSum) > 40) {
        setAutoplay(false);
        if (wheelSum > 0) engine.next();
        else engine.prev();
        wheelSum = 0;
        wheelLocked = true;
        wheelTimer = window.setTimeout(() => (wheelLocked = false), 500);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && ui.current.focusOpen) closeFocus();
    };

    const onVisibility = () => {
      if (!document.hidden) engine.kick();
    };

    const ro = new ResizeObserver(() => engine.measure());
    ro.observe(stage);
    const io = new IntersectionObserver((entries) => {
      p.visible = entries[entries.length - 1].isIntersecting;
      if (p.visible) engine.kick();
    });
    io.observe(stage);

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    stage.addEventListener("wheel", onWheel, { passive: false });

    engine.measure();
    engine.kick();

    const t = timers.current;
    return () => {
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      stage.removeEventListener("wheel", onWheel);
      window.clearTimeout(wheelTimer);
      window.clearTimeout(t.toast);
      window.clearTimeout(t.close);
      window.clearTimeout(t.anim);
      engine.stop();
    };
  }, [engine, closeFocus]);

  // Autoplay: advance every 5s while the deck is idle and on screen.
  useEffect(() => {
    if (!autoplay) return;
    let timer = 0;
    const check = () => {
      const u = ui.current;
      const p = phys.current;
      if (p.visible && !p.dragging && !document.hidden && !u.slipHover && !u.focusOpen && !u.isGrid) {
        engine.next();
      } else {
        timer = window.setTimeout(check, AUTOPLAY_MS);
      }
    };
    timer = window.setTimeout(check, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, active, engine]);

  // Topic change: announce + glint sweep + dock swap animations.
  const prevActive = useRef(active);
  useEffect(() => {
    if (prevActive.current === active) return;
    prevActive.current = active;
    const c = PERSONAS[active];
    setLive(`${active + 1} of ${N}: ${c.name} — ${c.summary}`);
    if (reducedMotion) return;
    restartAttr(stageRef.current, "data-glint");
    restartAttr(nowRef.current, "data-swap");
    restartAttr(piecesRef.current, "data-in");
  }, [active, reducedMotion]);

  // Focus open: FLIP the figure from its ring slot into the focus stage.
  useLayoutEffect(() => {
    const src = flipSrc.current;
    if (src === null || !focusModel) return;
    flipSrc.current = null;
    const modelEl = focusModelRef.current;
    const fig = modelEl?.querySelector<HTMLElement>(".model__fig");
    const srcFig = figEls.current[src];
    if (!reducedMotion && modelEl && fig && srcFig) {
      const s = srcFig.getBoundingClientRect();
      const d = fig.getBoundingClientRect();
      modelEl.style.transition = "none";
      modelEl.style.transform = `translate3d(${(s.left - d.left).toFixed(1)}px, ${(s.bottom - d.bottom).toFixed(1)}px, 0) scale(${(s.height / d.height).toFixed(4)})`;
      void modelEl.offsetWidth;
      modelEl.style.transition = "";
      modelEl.style.transform = "none";
    }
    focusCloseRef.current?.focus({ preventScroll: true });
  }, [focusModel, reducedMotion]);

  // Hotspot tooltip: keep it inside the visible stage (right → left → below).
  useLayoutEffect(() => {
    if (!hot) return;
    const tag = focusStageRef.current?.querySelector<HTMLElement>(`.tag[data-p="${hot}"]`);
    const tip = tag?.querySelector<HTMLElement>(".tag__tip");
    const stage = stageRef.current;
    if (!tag || !tip || !stage) return;
    tip.classList.remove("is-flip", "is-below");
    tip.style.removeProperty("--dx");
    const stageRect = stage.getBoundingClientRect();
    // Side-by-side layout: the info slip covers the right of the stage.
    // (At ≤ STACK_BP it is a bottom sheet instead — see Aboutme.scss.)
    const sideBySide = !matches(`(max-width: ${STACK_BP}px)`);
    const slipLeft = sideBySide && slipRef.current ? slipRef.current.getBoundingClientRect().left : Infinity;
    const sr = { left: stageRect.left, right: Math.min(stageRect.right, slipLeft), width: 0 };
    sr.width = sr.right - sr.left;
    const tr = tag.getBoundingClientRect();
    const tw = tip.offsetWidth;
    if (tr.right + tw <= sr.right - 8) return;
    if (tr.left - tw >= sr.left + 8) {
      tip.classList.add("is-flip");
      return;
    }
    tip.classList.add("is-below");
    const half = Math.min(tw, sr.width - 16) / 2;
    const center = tr.left + tr.width / 2;
    const clamped = Math.max(sr.left + 8 + half, Math.min(sr.right - 8 - half, center));
    tip.style.setProperty("--dx", `${(clamped - center).toFixed(1)}px`);
  }, [hot, focusModel]);

  // ── Render ─────────────────────────────────────────────────────────────────

  const deckClass = ["deck", isGrid && "is-grid", focusOpen && "is-focus"].filter(Boolean).join(" ");

  return (
    <section className="about-deck" id="about" aria-labelledby="about-deck-title">
      <div className={deckClass} ref={deckRef}>
        <div className="deck__intro">
          <h2 id="about-deck-title">About Me</h2>
          <p>
            Five sides of my background. Turn the ring or switch to the grid, then open a topic to read more.
          </p>
        </div>

        {/* Stage */}
        <div
          className="deck__stage"
          ref={stageRef}
          tabIndex={0}
          role="region"
          aria-roledescription={isGrid ? "grid" : "carousel"}
          aria-label="About me topics — arrow keys turn the ring, Enter opens the topic"
          onPointerDown={onStagePointerDown}
          onClick={onStageClick}
          onKeyDown={onStageKeyDown}
        >
          <span className="loop__ring" ref={ringRef} />
          <div className="loop" aria-hidden="true">
            <p className="loop__t">
              About Me <span className="loop__num">01</span>
            </p>
            <p className="loop__s">Software Engineer · Full-Stack Developer</p>
          </div>

          <div className="deck__crowd">
            {PERSONAS.map((c, i) => (
              <div
                key={c.key}
                className="model"
                ref={(el) => {
                  modelEls.current[i] = el;
                }}
                style={{ "--foot": c.foot } as CSSProperties}
              >
                <div
                  className="model__fig"
                  ref={(el) => {
                    figEls.current[i] = el;
                  }}
                >
                  <span className="model__shadow" aria-hidden="true" />
                  <img className="model__pic" src={c.image} alt="" draggable={false} decoding="async" />
                  <button
                    type="button"
                    className="model__hit"
                    tabIndex={i === active ? 0 : -1}
                    data-i={i}
                    aria-label={`${pad(i + 1)}: ${c.name} — ${c.summary}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="deck__labels">
            {PERSONAS.map((c, i) => (
              <span
                key={c.key}
                className={`deck__label${i === active ? " is-on" : ""}`}
                ref={(el) => {
                  labelEls.current[i] = el;
                }}
                style={{ "--i": i } as CSSProperties}
              >
                <span className="deck__label-name">
                  {pad(i + 1)}&nbsp;&nbsp;{c.name}
                </span>
                <span className="deck__label-sub">{c.tag}</span>
              </span>
            ))}
          </div>

          <span className="deck__glint" />
          <span className="deck__live" aria-live="polite">{live}</span>
        </div>

        {/* Dock */}
        <div className="dock">
          <div className="dock__now" ref={nowRef}>
            <div className="dock__count">
              <span className="cap">{pad(active + 1)}</span>
              <span className="cap">&nbsp;/&nbsp;</span>
              <span className="cap">{pad(N)}</span>
              <button
                type="button"
                className="dock__auto"
                aria-label="Autoplay"
                aria-pressed={autoplay}
                onClick={() => setAutoplay((a) => !a)}
              >
                <svg className="icon-pause" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M6.5 4.5h3.5v15H6.5z M14 4.5h3.5v15H14z" />
                </svg>
                <svg className="icon-play" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M7 4.5v15l12.5-7.5z" />
                </svg>
              </button>
            </div>
            <div className="dock__name">{char.name}</div>
            <p className="dock__sub">{char.summary}</p>
          </div>

          <ul className="dock__pieces" ref={piecesRef} aria-label="About me topics">
            {PERSONAS.map((c, idx) => (
              <li key={c.key} style={{ "--i": idx + 1 } as CSSProperties}>
                <button
                  type="button"
                  className={`piece${idx === active ? " is-current" : ""}`}
                  aria-label={c.name}
                  aria-current={idx === active}
                  onClick={() => {
                    stopAuto();
                    if (idx === active) openFocus();
                    else engine.jumpTo(idx);
                  }}
                >
                  <span className="piece__img">
                    <img src={c.image} alt="" loading="lazy" decoding="async" />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button type="button" className="dock__shop" aria-label={`Read more about ${char.name}`} onClick={openFocus}>
            <span className="cap">Read More</span>
            <span className="dock__dot">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12 4v16M4 12h16" />
              </svg>
            </span>
          </button>
        </div>

        {/* View toggle */}
        <div className="deck__view" role="group" aria-label="View">
          <button type="button" className="deck__vbtn" aria-pressed={!isGrid} onClick={() => setGridMode(false)}>
            Ring
          </button>
          <button type="button" className="deck__vbtn" aria-pressed={isGrid} onClick={() => setGridMode(true)}>
            Grid
          </button>
        </div>

        {/* Focus view */}
        <div className="focus" ref={focusRef} aria-hidden={!focusOpen}>
          <div className="focus__top">
            <div className="focus__cap">
              <div className="focus__title-row">
                <span className="focus__num">{pad(PERSONAS.indexOf(focusChar) + 1)}</span>
                <span>{focusChar.name}</span>
              </div>
              <p className="focus__subtitle">{focusChar.summary}</p>
            </div>
            <button
              type="button"
              className="focus__close"
              ref={focusCloseRef}
              aria-label="Close"
              onClick={() => {
                stopAuto();
                closeFocus();
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          <div
            className="focus__stage"
            ref={focusStageRef}
            onClick={(e) => {
              const t = e.target as Element;
              if (t.closest(".tag") || t.closest(".model__fig")) return;
              stopAuto();
              closeFocus();
            }}
          >
            {focusModel && (
              <div
                key={focusModel.nonce}
                className="focus__model"
                ref={focusModelRef}
                style={{ "--model-h": `${focusModel.h}px`, "--foot": focusChar.foot } as CSSProperties}
              >
                <div className="model__fig">
                  <span className="model__shadow" aria-hidden="true" />
                  <img className="model__pic" src={focusChar.image} alt="" draggable={false} decoding="async" />
                  <div className="tags">
                    {focusChar.highlights.map((g, gi) => {
                      const p = gi + 1;
                      const [x, y] = focusChar.tags[gi];
                      return (
                        <button
                          key={g.name}
                          type="button"
                          className={`tag${hot === p ? " is-hot" : ""}`}
                          data-p={p}
                          style={{ left: `${x}%`, top: `${y}%`, "--pi": p } as CSSProperties}
                          aria-label={`${pad(p)}: ${g.name} — ${g.desc}`}
                          onPointerOver={(e) => e.pointerType === "mouse" && setHot(p)}
                          onFocus={() => setHot(p)}
                          onClick={(e) => {
                            e.stopPropagation();
                            stopAuto();
                            hotAndScroll(p);
                          }}
                        >
                          <span className="dotnum">{pad(p)}</span>
                          <span className="tag__tip">
                            <b>{g.name}</b>
                            <span>{g.desc}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className="focus__hint cap">Tap the numbered dots for highlights · click outside to close</p>
        </div>

        {/* Info slip */}
        <aside
          className="slip"
          ref={slipRef}
          aria-label={`About me: ${char.name}`}
          aria-hidden={!focusOpen}
          onPointerEnter={(e) => {
            if (e.pointerType === "mouse") ui.current.slipHover = true;
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") ui.current.slipHover = false;
          }}
        >
          <div className="slip__head">
            <div className="slip__logo">
              About Me <span className="slip__num">01</span>
            </div>
            <span className="cap">
              {pad(active + 1)} — {char.name}
            </span>
          </div>

          <div className="slip__scroll" data-lenis-prevent>
            <div className="dossier__section">
              <p className="dossier__lead">{char.lead}</p>
              {char.paragraphs.map((text, i) => (
                <p key={i} className="dossier__bio">
                  {renderParagraph(text)}
                </p>
              ))}
            </div>

            <div className="dossier__section">
              <dl className="facts">
                {char.facts.map((f, i) => (
                  <div key={i} className="facts__row">
                    <dt className="cap">{f.label}</dt>
                    <dd>{f.value}</dd>
                  </div>
                ))}
              </dl>
              <span className="cap dossier__label dossier__label--gap">Skills</span>
              <div className="dossier__chips">
                {char.skills.map((s) => (
                  <span key={s} className="chip">{s}</span>
                ))}
              </div>
            </div>

            <div className="dossier__section dossier__section--last">
              <span className="cap dossier__label dossier__label--lines">Highlights</span>
              <ul className="slip__lines" ref={linesRef} onPointerLeave={() => setHot(0)}>
                {char.highlights.map((g, gi) => {
                  const p = gi + 1;
                  return (
                    <li
                      key={g.name}
                      className={`line${hot === p ? " is-hot" : ""}`}
                      data-p={p}
                      onPointerOver={(e) => e.pointerType === "mouse" && setHot(p)}
                    >
                      <span className="line__name">{g.name}</span>
                      <span className="line__price">{g.meta}</span>
                      <span className="line__kind">{g.desc}</span>
                      <button
                        type="button"
                        className="line__add"
                        aria-label={`Show ${g.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          stopAuto();
                          setHot(p);
                          showToast(`${g.name}: ${g.desc}`);
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="slip__bundle">
            <a className="slip__cta" href={CV_HREF} target="_blank" rel="noopener noreferrer">
              <span>View my CV</span>
              <svg viewBox="0 0 26 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M1 7h24M19 1l6 6-6 6" />
              </svg>
            </a>
          </div>
          <div className="slip__foot" aria-hidden="true">
            <div className="slip__code" />
            <span className="cap">Shahad Altharwa · Software Engineer</span>
          </div>
        </aside>

        <div className={`toast${toast.on ? " is-on" : ""}`} role="status" aria-live="polite">
          {toast.text}
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
