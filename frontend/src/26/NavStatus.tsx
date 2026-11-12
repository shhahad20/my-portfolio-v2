import React, { useEffect, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// NavStatus — live clock + battery indicator for the top navigation bar.
// Battery reads the real device level where the Battery Status API exists
// (Chromium browsers) and falls back to the static 12% display elsewhere.
// ─────────────────────────────────────────────────────────────────────────────

interface BatteryManagerLike extends EventTarget {
  level: number;
  charging: boolean;
}

const FALLBACK_LEVEL = 0.12;

const NavStatus: React.FC = () => {
  const [time, setTime] = useState("");
  const [level, setLevel] = useState(FALLBACK_LEVEL);
  const [charging, setCharging] = useState(false);

  // Clock: re-render once per minute, aligned to the minute boundary.
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" });
    let timer = 0;
    const tick = () => {
      setTime(fmt.format(new Date()));
      timer = window.setTimeout(tick, 60000 - (Date.now() % 60000) + 50);
    };
    tick();
    return () => window.clearTimeout(timer);
  }, []);

  // Battery: subscribe to level / charging changes when supported.
  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManagerLike> };
    if (!nav.getBattery) return;
    let battery: BatteryManagerLike | null = null;
    let cancelled = false;
    const sync = () => {
      if (!battery) return;
      setLevel(battery.level);
      setCharging(battery.charging);
    };
    nav
      .getBattery()
      .then((b) => {
        if (cancelled) return;
        battery = b;
        sync();
        b.addEventListener("levelchange", sync);
        b.addEventListener("chargingchange", sync);
      })
      .catch(() => {
        /* unsupported or blocked — keep the fallback display */
      });
    return () => {
      cancelled = true;
      battery?.removeEventListener("levelchange", sync);
      battery?.removeEventListener("chargingchange", sync);
    };
  }, []);

  const pct = Math.round(level * 100);

  return (
    <div className="nm-status">
      <span className="nm-status__time" aria-hidden="true">{time}</span>
      <span
        className={`nm-status__battery${charging ? " is-charging" : ""}${pct <= 20 && !charging ? " is-low" : ""}`}
        role="img"
        aria-label={`Battery ${pct}%${charging ? ", charging" : ""}`}
      >
        <span className="nm-status__cell" aria-hidden="true">
          <span className="nm-status__fill" style={{ width: `${Math.max(pct, 6)}%` }} />
          {charging && (
            <svg className="nm-status__bolt" viewBox="0 0 10 14" aria-hidden="true">
              <path d="M6 0 0 8h4l-1 6 6-8H5z" fill="currentColor" />
            </svg>
          )}
        </span>
        <span className="nm-status__pct" aria-hidden="true">{pct}%</span>
      </span>
    </div>
  );
};

export default NavStatus;
