"use client";
import { useEffect, useRef, useState } from "react";
import type { Short } from "@/lib/videos";

export function Hook({ text }: { text: string }) {
  return <>{text.split(" ").map((w, i) => /^\*.*\*$/.test(w) ? <mark key={i}>{w.slice(1, -1)} </mark> : <span key={i}>{w} </span>)}</>;
}

export function HeroLoop() {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => { if (mq.matches) v.pause(); else v.play().catch(() => {}); };
    apply(); mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return <video ref={ref} className="hero-video" src="/v/hero.mp4" poster="/v/hero.jpg" muted loop playsInline preload="metadata" aria-label="Quick cuts from HiddenClean videos" width={540} height={960} />;
}

export function ShortCard({ s, href }: { s: Short; href?: string }) {
  const [on, setOn] = useState(false);
  return (
    <article className="short">
      <div className="short-media">
        {on ? (
          <video src={`/v/${s.id}.mp4`} poster={`/v/${s.id}.jpg`} controls autoPlay playsInline preload="auto" width={432} height={768} />
        ) : (
          <button type="button" onClick={() => setOn(true)} aria-label={`Play: ${s.label}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/v/${s.id}.jpg`} alt="" loading="lazy" decoding="async" width={432} height={768} />
            <span className="play" aria-hidden="true">▶</span>
          </button>
        )}
      </div>
      <h3 className="short-hook"><Hook text={s.hook} /></h3>
      <p className="short-label">{href ? <a href={href}>{s.label} →</a> : s.label}</p>
    </article>
  );
}
