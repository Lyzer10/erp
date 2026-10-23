import { useEffect, useRef, useState } from "react";
import { logoutUserFn, refreshSessionFn } from "@/lib/api/auth";
import { useTranslate } from "@/lib/i18n";
import { SESSION_IDLE_MINUTES } from "@/lib/session";

const IDLE_MS = SESSION_IDLE_MINUTES * 60_000;
const WARNING_MS = 2 * 60_000;
const REFRESH_EVERY_MS = 5 * 60_000;
const CHECK_EVERY_MS = 15_000;
// Shared across tabs so activity in one tab keeps the others signed in.
const STORAGE_KEY = "develeerp:last-activity";
const ACTIVITY_EVENTS = [
  "pointerdown",
  "pointermove",
  "keydown",
  "wheel",
  "touchstart",
  "scroll",
] as const;

function readShared() {
  try {
    return Number(localStorage.getItem(STORAGE_KEY)) || 0;
  } catch {
    return 0;
  }
}

function writeShared(time: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(time));
  } catch {
    // Storage can be unavailable (private mode); the in-memory timer still works.
  }
}

export function IdleLogout() {
  const { lang } = useTranslate();
  const lastActivity = useRef(Date.now());
  const lastRefresh = useRef(Date.now());
  const lastShared = useRef(0);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    let signingOut = false;
    const markActive = () => {
      const now = Date.now();
      lastActivity.current = now;
      // Throttle storage writes; precision of a few seconds is plenty.
      if (now - lastShared.current > 5_000) {
        lastShared.current = now;
        writeShared(now);
      }
    };

    const check = async () => {
      if (signingOut) return;
      const now = Date.now();
      const last = Math.max(lastActivity.current, readShared());
      const idle = now - last;

      if (idle >= IDLE_MS) {
        signingOut = true;
        await logoutUserFn().catch(() => undefined);
        window.location.href = "/login?reason=idle";
        return;
      }

      setSecondsLeft(idle >= IDLE_MS - WARNING_MS ? Math.ceil((IDLE_MS - idle) / 1000) : null);

      // Renew the server session only when there has been activity since the last renewal.
      if (last > lastRefresh.current && now - lastRefresh.current >= REFRESH_EVERY_MS) {
        lastRefresh.current = now;
        const result = await refreshSessionFn().catch(() => null);
        if (result && !result.success) {
          signingOut = true;
          window.location.href = "/login?reason=idle";
        }
      }
    };

    markActive();
    for (const event of ACTIVITY_EVENTS)
      window.addEventListener(event, markActive, { passive: true, capture: true });
    const timer = window.setInterval(check, CHECK_EVERY_MS);
    // Catch up immediately when a sleeping laptop or background tab wakes.
    const onVisible = () => document.visibilityState === "visible" && void check();
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      for (const event of ACTIVITY_EVENTS)
        window.removeEventListener(event, markActive, { capture: true });
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (secondsLeft === null) return null;
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, "0");
  return (
    <div
      role="alert"
      className="fixed bottom-4 left-1/2 z-[60] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-2xl"
    >
      <p className="text-sm text-slate-700">
        {lang === "en"
          ? `You will be signed out in ${minutes}:${seconds} because you have been inactive.`
          : `Utatolewa baada ya ${minutes}:${seconds} kwa sababu hujatumia mfumo.`}
      </p>
      <button
        type="button"
        onClick={() => {
          lastActivity.current = Date.now();
          writeShared(lastActivity.current);
          setSecondsLeft(null);
        }}
        className="shrink-0 rounded-xl bg-[#1f9c88] px-3 py-2 text-xs font-bold text-white"
      >
        {lang === "en" ? "Stay signed in" : "Endelea kutumia"}
      </button>
    </div>
  );
}
