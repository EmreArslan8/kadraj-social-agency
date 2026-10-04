"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

const MEDIA = ["work-01", "work-02", "work-03", "work-04", "work-05", "hero"];
const FORMATS = ["REELS", "KAMPANYA", "MOTION", "İÇERİK", "TASARIM", "SHOWREEL"];

export default function Hero({ start, cinematic = false }: { start: boolean; cinematic?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const parallax = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const panel = el.closest(".story-panel");
    const videos = Array.from(el.querySelectorAll<HTMLVideoElement>("video"));
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const sync = () => {
      const running = start && visible && !motion.matches && !document.hidden && !panel?.hasAttribute("inert");
      el.dataset.running = String(running);
      videos.forEach(video => { if (running) video.play().catch(() => {}); else video.pause(); });
    };
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    intersection.observe(el);
    const mutation = new MutationObserver(sync);
    if (panel) mutation.observe(panel, { attributes: true, attributeFilter: ["inert"] });
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (motion.matches || event.pointerType !== "mouse") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        parallax.current?.style.setProperty("--flow-x", `${((event.clientX - rect.left) / rect.width - .5) * -40}px`);
        parallax.current?.style.setProperty("--flow-y", `${((event.clientY - rect.top) / rect.height - .5) * -40}px`);
      });
    };
    const reset = () => { parallax.current?.style.setProperty("--flow-x", "0px"); parallax.current?.style.setProperty("--flow-y", "0px"); };
    el.addEventListener("pointermove", move); el.addEventListener("pointerleave", reset);
    document.addEventListener("visibilitychange", sync); motion.addEventListener("change", sync); sync();
    return () => {
      cancelAnimationFrame(frame); intersection.disconnect(); mutation.disconnect(); videos.forEach(v => v.pause());
      el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", reset);
      document.removeEventListener("visibilitychange", sync); motion.removeEventListener("change", sync);
    };
  }, [start]);

  useLayoutEffect(() => {
    if (!start || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".flow-copy-inner > *", { opacity: 0, y: 35, duration: 1, stagger: .12, ease: "power3.out" });
    }, root);
    return () => ctx.revert();
  }, [start]);

  return <section ref={root} id="top" className={`flow-hero ${cinematic ? "hero-cinematic" : ""}`} data-running="false">
    <div ref={parallax} className="flow-parallax" aria-hidden="true">
      <div className="flow-wall">
        {Array.from({ length: 5 }, (_, column) => <div key={column} className="flow-column">
          {[0, 1].map(copy => <div className="flow-set" key={copy}>
            {Array.from({ length: 5 }, (_, row) => {
              const index = (column * 2 + row) % MEDIA.length;
              const src = MEDIA[index];
              const isVideo = (column === 1 && row === 1) || (column === 3 && row === 2);
              return <div key={row} className={`flow-card ${(column + row) % 3 === 0 ? "flow-card-tall" : ""}`}>
                {isVideo ? <video muted loop playsInline preload="none" poster={`/media/${src}.jpg`}><source src={`/media/${src}.mp4`} type="video/mp4" /></video> : <Image src={`/media/${src}.jpg`} alt="" fill unoptimized sizes="(max-width: 700px) 60vw, 26vw" loading={copy === 0 ? "eager" : "lazy"} />}
                <span className="flow-card-meta"><span>@kadraj</span><i>{FORMATS[index]}</i></span>
              </div>;
            })}
          </div>)}
        </div>)}
      </div>
    </div>
    <div className="flow-shade" aria-hidden="true" />
    <div className="flow-copy"><div className="flow-copy-inner">
      <span className="flow-tag">KADRAJ SOCIAL STUDIO / BAKIŞ AÇIMIZ</span>
      <h1>SINIRLARI AŞAN <em>fikirler.</em><br />AKILDA KALAN <em>hikâyeler.</em></h1>
      <p>Markanı sadece görünür değil, vazgeçilmez kılan içerikler.</p>
      <a className="lime-button" href="#work">İŞLERİ GÖR <span>↗</span></a>
    </div></div>
    <div className="flow-bottom"><span>SOSYAL MEDYA · İÇERİK · TASARIM</span><a href="#manifesto">KEŞFETMEK İÇİN KAYDIR ↓</a></div>
  </section>;
}
