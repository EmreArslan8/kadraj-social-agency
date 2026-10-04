"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MediaSlot from "./MediaSlot";

gsap.registerPlugin(ScrollTrigger);

import { projects as PROJECTS } from "@/lib/projects";

// Pinned section: a horizontal track of project cards scrubbed by vertical
// scroll on desktop; a simple vertical stack on mobile (no pin).
export default function SelectedWork() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLSpanElement>(null);

  // Lazily start the card videos (preload="none") as the section approaches,
  // so they don't download until needed. Posters stand in under reduced-motion.
  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced || !root.current) return;

    const videos = Array.from(
      root.current.querySelectorAll<HTMLVideoElement>("video")
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLVideoElement).play().catch(() => {});
          } else {
            (entry.target as HTMLVideoElement).pause();
          }
        });
      },
      { rootMargin: "400px 0px" }
    );
    videos.forEach((v) => io.observe(v));

    return () => { io.disconnect(); videos.forEach(v => v.pause()); };
  }, []);

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: pin + horizontal scrub.
      mm.add("(min-width: 768px)", () => {
        const el = track.current;
        const stageEl = stage.current;
        if (!el || !stageEl) return;
        const getDistance = () => Math.max(0, el.scrollWidth - stageEl.clientWidth);

        const tween = gsap.to(el, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: stageEl,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: stageEl,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progress.current) {
                progress.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });

        // Slight counter-parallax on each card's inner image.
        const parallax: gsap.core.Tween[] = [];
        gsap.utils.toArray<HTMLElement>(".work-inner").forEach((inner) => {
          parallax.push(
            gsap.fromTo(
              // scale set here so the translate never reveals an edge
              // (GSAP's inline transform would otherwise drop the CSS scale).
              inner,
              { xPercent: -8, scale: 1.1 },
              {
                xPercent: 8,
                scale: 1.1,
                ease: "none",
                scrollTrigger: {
                  trigger: stageEl,
                  start: "top top",
                  end: () => `+=${getDistance()}`,
                  scrub: true,
                },
              }
            )
          );
        });

        return () => {
          tween.kill();
          parallax.forEach((p) => p.kill());
        };
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="work" className="relative">
      <div className="grid gap-8 px-5 pt-16 pb-8 md:grid-cols-[0.8fr_1.2fr] md:px-10 md:pt-20 md:pb-4">
        <div>
          <span className="micro-label">02 / SEÇİLİ İŞLER</span>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted md:text-base">
            Fikirlerin akışa karıştığı yer. Sosyal kampanyalar, marka dünyaları ve hareketli hikâyeler.
          </p>
        </div>
        <div className="flex flex-col gap-5 md:items-end">
          <h2 className="display max-w-3xl text-[clamp(2.5rem,5.5vw,5.5rem)] md:text-right">
            SÖZÜ AZALT. ETKİYİ BÜYÜT.
          </h2>
          <div className="flex flex-wrap gap-2">
            {["Sosyal medya", "İçerik", "3D & Motion"].map((item) => (
              <span key={item} className="micro-label border border-hairline px-3 py-2 text-text">
                {item}
              </span>
            ))}
            <span className="micro-label px-2 py-2 text-accent">KEŞFETMEK İÇİN KAYDIR →</span>
          </div>
        </div>
      </div>

      <div
        ref={stage}
        className="relative md:h-svh md:overflow-hidden"
      >
        {/* The intro scrolls normally; only this visible card stage is pinned. */}
        <div
          ref={track}
          className="flex flex-col gap-12 px-5 pb-16 md:h-full md:w-max md:flex-row md:items-center md:gap-8 md:px-10 md:pb-0"
        >
          {PROJECTS.map((p, i) => (
            <article
              key={p.index}
              className={`group w-full shrink-0 md:w-[40vw] ${i % 2 ? "md:translate-y-8" : "md:-translate-y-8"}`}
            >
              <Link href={`/work/${p.slug}`} data-transition aria-label={`${p.title} projesini incele`} className="relative block overflow-hidden bg-surface">
                <MediaSlot
                  src={p.src}
                  preload="none"
                  label={`${p.title} — ${p.category}`}
                  ratio="4/5"
                  hue={p.hue}
                  innerClassName="work-inner scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-4 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="flex items-end justify-between gap-6">
                    <div>
                      <p className="micro-label text-text">{p.client}</p>
                      <p className="mt-2 max-w-xs text-sm leading-relaxed text-text">
                        {p.result}
                      </p>
                    </div>
                    <span className="micro-label text-acid">PROJEYİ İNCELE ↗</span>
                  </div>
                </div>
              </Link>
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <h3 className="display text-2xl md:text-3xl">{p.title}</h3>
                  <p className="micro-label mt-2">
                    {p.category} — KONSEPT PROJE
                  </p>
                </div>
                <span className="display text-accent text-xl">{p.index}</span>
              </div>
            </article>
          ))}
        </div>

        {/* Scrub-linked progress stays fixed while the cards move. */}
        <div className="absolute inset-x-0 bottom-0 hidden h-px bg-hairline md:block">
          <span
            ref={progress}
            className="block h-full origin-left scale-x-0 bg-accent"
          />
        </div>
      </div>
    </section>
  );
}
