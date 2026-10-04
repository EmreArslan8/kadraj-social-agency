"use client";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const SERVICES = [
  ["Sosyal medya", "Markanın sesini bulur, doğru insanlarla buluştururuz. Stratejiden içerik takvimine, topluluk yönetiminden raporlamaya aynı masadayız.", "STRATEJİ / İÇERİK PLANI / TOPLULUK"],
  ["İçerik & prodüksiyon", "İlk saniyede dikkat çeken, sonrasında hatırlanan içerikler. Reels, TikTok, fotoğraf ve marka filmleri için fikirden son kurguya üretim.", "REELS / FOTOĞRAF / VİDEO / UGC"],
  ["Tasarım & 3D", "Markanın dünyasını genişleten görsel kimlikler, hareketli tasarımlar ve 3D deneyimler. Her temas noktasında aynı karakter.", "ART DIRECTION / CGI / MOTION"],
  ["Dijital reklam", "Yaratıcı fikri ölçülebilir bir plana bağlarız. Hedef kitle, kreatif varyasyonları ve düzenli optimizasyonla kampanyayı birlikte geliştiririz.", "META ADS / TIKTOK ADS / ANALİZ"],
];
export default function Capabilities({ cinematic = false }: { cinematic?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);
  useLayoutEffect(() => {
    if (cinematic || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => { gsap.from(".service-row", { y: 45, opacity: .2, stagger: .1, duration: .8, scrollTrigger: { trigger: root.current, start: "top 75%" } }); }, root);
    return () => ctx.revert();
  }, [cinematic]);
  return <section ref={root} id="studio" className="services-section section-pad">
    <div className="section-heading"><span className="micro-label">03 / NELER YAPIYORUZ?</span><span className="micro-label">TEK EKİP. ÇOK BOYUTLU BAKIŞ.</span></div>
    <div className="services-layout"><div><h2 className="display">FİKİRDEN<br /><em className="accent-serif">etkiye.</em></h2><p>Markanın ihtiyacı neyse,<br />kadrajı oraya çeviriyoruz.</p><span className="service-star" aria-hidden="true">✳</span></div>
    <div>{SERVICES.map(([title, copy, tags], i) => <article key={title} className={`service-row ${open === i ? "is-open" : ""}`}>
      <h3><button onClick={() => { setOpen(open === i ? -1 : i); requestAnimationFrame(() => ScrollTrigger.refresh()); }} aria-expanded={open === i} aria-controls={`service-${i}`}><span className="micro-label">0{i+1}</span><span>{title}</span><span className="service-plus">{open === i ? "−" : "+"}</span></button></h3>
      <div id={`service-${i}`} hidden={open !== i} className="service-description"><p>{copy}</p><span className="micro-label">{tags}</span></div>
    </article>)}</div></div>
  </section>;
}
