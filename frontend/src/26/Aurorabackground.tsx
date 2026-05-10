import { useEffect, useRef } from "react";

// ─── Simplex Noise (inline, no external dep) ───────────────────────────────
// Minimal 3-D simplex noise adapted from Stefan Gustavson's public-domain impl.
class SimplexNoise {
  private p: Uint8Array;
  private perm: Uint8Array;
  private permMod12: Uint8Array;

  constructor() {
    const seed = Math.random();
    this.p = new Uint8Array(256);
    this.perm = new Uint8Array(512);
    this.permMod12 = new Uint8Array(512);

    for (let i = 0; i < 256; i++) this.p[i] = i;
    // Fisher–Yates shuffle seeded by Math.random (good enough for visuals)
    for (let i = 255; i > 0; i--) {
      const j = Math.floor((seed + Math.random()) * (i + 1)) & 255;
      [this.p[i], this.p[j]] = [this.p[j], this.p[i]];
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
      this.permMod12[i] = this.perm[i] % 12;
    }
  }

  private static grad3 = new Float32Array([
    1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0,
    -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
  ]);

  noise3D(xin: number, yin: number, zin: number): number {
    const grad3 = SimplexNoise.grad3;
    const { permMod12, perm } = this;
    const F3 = 1 / 3,
      G3 = 1 / 6;
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s),
      j = Math.floor(yin + s),
      k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const x0 = xin - (i - t),
      y0 = yin - (j - t),
      z0 = zin - (k - t);
    let i1: number, j1: number, k1: number;
    let i2: number, j2: number, k2: number;
    if (x0 >= y0) {
      if (y0 >= z0) {
        [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 1, 0];
      } else if (x0 >= z0) {
        [i1, j1, k1, i2, j2, k2] = [1, 0, 0, 1, 0, 1];
      } else {
        [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 1, 0, 1];
      }
    } else {
      if (y0 < z0) {
        [i1, j1, k1, i2, j2, k2] = [0, 0, 1, 0, 1, 1];
      } else if (x0 < z0) {
        [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 0, 1, 1];
      } else {
        [i1, j1, k1, i2, j2, k2] = [0, 1, 0, 1, 1, 0];
      }
    }
    const x1 = x0 - i1 + G3,
      y1 = y0 - j1 + G3,
      z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3,
      y2 = y0 - j2 + 2 * G3,
      z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3,
      y3 = y0 - 1 + 3 * G3,
      z3 = z0 - 1 + 3 * G3;
    const ii = i & 255,
      jj = j & 255,
      kk = k & 255;

    const dot = (g: number, x: number, y: number, z: number) =>
      grad3[g * 3] * x + grad3[g * 3 + 1] * y + grad3[g * 3 + 2] * z;

    const contrib = (x: number, y: number, z: number, gi: number): number => {
      const t = 0.6 - x * x - y * y - z * z;
      return t < 0 ? 0 : t * t * t * t * dot(gi, x, y, z);
    };

    const n0 = contrib(x0, y0, z0, permMod12[ii + perm[jj + perm[kk]]]);
    const n1 = contrib(
      x1,
      y1,
      z1,
      permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]],
    );
    const n2 = contrib(
      x2,
      y2,
      z2,
      permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]],
    );
    const n3 = contrib(
      x3,
      y3,
      z3,
      permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]],
    );

    return 32 * (n0 + n1 + n2 + n3);
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────
const rand = (n: number) => Math.random() * n;
const round = (n: number) => Math.round(n);
const fadeInOut = (t: number, m: number) => {
  const hm = 0.5 * m;
  return Math.abs(((t + hm) % m) - hm) / hm;
};

// ─── Aurora config ─────────────────────────────────────────────────────────
const RAY_COUNT = 500;
const RAY_PROP_COUNT = 8;
const RAY_PROPS_LENGTH = RAY_COUNT * RAY_PROP_COUNT;
const BASE_LENGTH = 200;
const RANGE_LENGTH = 200;
const BASE_SPEED = 0.05;
const RANGE_SPEED = 0.1;
const BASE_WIDTH = 10;
const RANGE_WIDTH = 20;
const BASE_TTL = 50;
const RANGE_TTL = 100;
const NOISE_STRENGTH = 100;
const X_OFF = 0.0015;
const Y_OFF = 0.0015;
const Z_OFF = 0.0015;

// ─── Theme presets ─────────────────────────────────────────────────────────
//
//  dark  → "lighter" composite: rays ADD light → glowing aurora on deep navy
//  light → "multiply" composite: rays DARKEN the surface → watercolour wash
//          on cream paper; hues shifted to blue/violet/rose so they stay
//          visible and beautiful against #f8f6f2.
//
const THEME_PRESETS = {
  dark: {
    backgroundColor: "hsla(220,60%,3%,1)",
    compositeOp: "lighter" as GlobalCompositeOperation,
    baseHue: 120, // green → teal
    rangeHue: 60,
    rayLightness: 65,
    maxAlpha: 1,
  },
  light: {
    backgroundColor: "#fef7e8",
    baseHue: 28,
    rangeHue: 18,
    rayLightness: 68,
    maxAlpha: 0.22,
  },
} as const;

// ─── Component ─────────────────────────────────────────────────────────────
interface AuroraBackgroundProps {
  /** "light" adjusts composite, hues and lightness for a light background.
   *  Defaults to "dark" (original deep-navy aurora look). */
  theme?: "light" | "dark";
  /** Override the background fill colour (uses theme default if omitted) */
  backgroundColor?: string;
  /** Override base hue in degrees (uses theme default if omitted) */
  baseHue?: number;
  className?: string;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({
  theme = "light",
  backgroundColor,
  baseHue,
  className,
}) => {
  const preset = THEME_PRESETS[theme];
  const resolvedBg = backgroundColor ?? preset.backgroundColor;
  const resolvedHue = baseHue ?? preset.baseHue;
  const { compositeOp, rangeHue, rayLightness, maxAlpha } = preset;
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Capture resolved values so the closure stays stable
    const bgColor = resolvedBg;
    const hue = resolvedHue;

    // Two-canvas setup: `a` is the offscreen drawing buffer, `b` is displayed
    const canvasA = document.createElement("canvas");
    const canvasB = document.createElement("canvas");

    Object.assign(canvasB.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: "-1",
      inset: "0",
      pointerEvents: "none",
    });

    container.appendChild(canvasB);

    const ctxA = canvasA.getContext("2d")!;
    const ctxB = canvasB.getContext("2d")!;

    let center = [0, 0];
    let tick = 0;
    let simplex = new SimplexNoise();
    let rayProps = new Float32Array(RAY_PROPS_LENGTH);

    // ── resize ──────────────────────────────────────────────────────────────
    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvasA.width = w;
      canvasA.height = h;
      ctxA.drawImage(canvasB, 0, 0);
      canvasB.width = w;
      canvasB.height = h;
      ctxB.drawImage(canvasA, 0, 0);
      center = [0.5 * w, 0.5 * h];
    };

    // ── ray lifecycle ────────────────────────────────────────────────────────
    const initRay = (i: number) => {
      const length = BASE_LENGTH + rand(RANGE_LENGTH);
      const x = rand(canvasA.width);
      let y1 = center[1] + NOISE_STRENGTH;
      let y2 = y1 - length;
      const n =
        simplex.noise3D(x * X_OFF, y1 * Y_OFF, tick * Z_OFF) * NOISE_STRENGTH;
      y1 += n;
      y2 += n;
      const life = 0;
      const ttl = BASE_TTL + rand(RANGE_TTL);
      const width = BASE_WIDTH + rand(RANGE_WIDTH);
      const speed = BASE_SPEED + rand(RANGE_SPEED) * (round(rand(1)) ? 1 : -1);
      const rayHue = hue + rand(rangeHue);
      rayProps.set([x, y1, y2, life, ttl, width, speed, rayHue], i);
    };

    const initRays = () => {
      tick = 0;
      simplex = new SimplexNoise();
      rayProps = new Float32Array(RAY_PROPS_LENGTH);
      for (let i = 0; i < RAY_PROPS_LENGTH; i += RAY_PROP_COUNT) initRay(i);
    };

    const drawRay = (
      x: number,
      y1: number,
      y2: number,
      life: number,
      ttl: number,
      width: number,
      hue: number,
    ) => {
      const gradient = ctxA.createLinearGradient(x, y1, x, y2);
      const alpha = fadeInOut(life, ttl) * maxAlpha;
      gradient.addColorStop(0, `hsla(${hue},100%,${rayLightness}%,0)`);
      gradient.addColorStop(0.5, `hsla(${hue},100%,${rayLightness}%,${alpha})`);
      gradient.addColorStop(1, `hsla(${hue},100%,${rayLightness}%,0)`);
      ctxA.save();
      ctxA.beginPath();
      ctxA.strokeStyle = gradient;
      ctxA.lineWidth = width;
      ctxA.moveTo(x, y1);
      ctxA.lineTo(x, y2);
      ctxA.stroke();
      ctxA.closePath();
      ctxA.restore();
    };

    const updateRay = (i: number) => {
      let x = rayProps[i];
      const y1 = rayProps[i + 1];
      const y2 = rayProps[i + 2];
      let life = rayProps[i + 3];
      const ttl = rayProps[i + 4];
      const width = rayProps[i + 5];
      const speed = rayProps[i + 6];
      const hue = rayProps[i + 7];

      drawRay(x, y1, y2, life, ttl, width, hue);

      x += speed;
      life++;
      rayProps[i] = x;
      rayProps[i + 3] = life;

      if (x < 0 || x > canvasA.width || life > ttl) initRay(i);
    };

    const drawRays = () => {
      for (let i = 0; i < RAY_PROPS_LENGTH; i += RAY_PROP_COUNT) updateRay(i);
    };

    // ── render loop ──────────────────────────────────────────────────────────
    const draw = () => {
      tick++;
      ctxA.clearRect(0, 0, canvasA.width, canvasA.height);

      ctxB.fillStyle = bgColor;
      ctxB.fillRect(0, 0, canvasB.width, canvasB.height);

      ctxA.globalCompositeOperation = compositeOp;
      drawRays();

      ctxB.save();
      ctxB.filter = "blur(20px)";
      ctxB.drawImage(canvasA, 0, 0);
      ctxB.restore();

      rafRef.current = window.requestAnimationFrame(draw);
    };

    // ── init ─────────────────────────────────────────────────────────────────
    resize();
    initRays();
    draw();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(rafRef.current);
      container.removeChild(canvasB);
    };
  }, [resolvedBg, resolvedHue, compositeOp, rangeHue, rayLightness, maxAlpha]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
};

export default AuroraBackground;
