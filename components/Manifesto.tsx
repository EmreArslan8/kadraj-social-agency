"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Large statement whose words fade from dim to full as the user scrolls
// through — the classic Locomotive word-reveal pattern.
const TEXT = "İnsanlar bir paylaşımı unutabilir. Ama onlara ne";
const ACCENT = "hissettirdiğini";
const TAIL = "unutmaz. Biz algoritmaların ötesinde, insanlarla bağ kuran markalar için buradayız.";

export default function Manifesto() {
  const root = useRef<HTMLElement>(null);
  const para = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const words = para.current?.querySelectorAll<HTMLElement>(".m-word");
      if (!words) return;
      gsap.set(words, { opacity: 0.15 });
      gsap.to(words, {
        opacity: 1,
        stagger: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top 75%",
          end: "bottom 60%",
          scrub: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  const renderWords = (str: string, accent = false) =>
    str.split(" ").map((w, i) => (
      <span key={`${str}-${i}`} className="m-word inline-block">
        {accent ? <em className="accent-serif">{w}</em> : w}
        {" "}
      </span>
    ));

  return (
    <section
      ref={root}
      id="manifesto"
      className="hairline-t relative overflow-hidden px-5 py-[clamp(6rem,16vh,12rem)] md:px-10"
    >
      <div className="pointer-events-none absolute top-10 right-5 hidden text-[18vw] font-black leading-none text-text/[0.025] md:block">
        ✳
      </div>
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <span className="micro-label block">04 / BAKIŞ AÇIMIZ</span>
        <span className="micro-label block text-text">DAHA FAZLA İÇERİK DEĞİL. DAHA FAZLA ANLAM.</span>
      </div>
      <p
        ref={para}
        className="max-w-5xl text-[clamp(1.75rem,5vw,4rem)] font-semibold leading-[1.15] tracking-tight"
      >
        {renderWords(TEXT)}
        {renderWords(ACCENT, true)}
        {renderWords(TAIL)}
      </p>
      <div className="mt-16 grid gap-px bg-hairline md:grid-cols-3">
        {["Önce insan, sonra algoritma", "Her formatta aynı karakter", "Birlikte düşün, birlikte üret"].map((item) => (
          <span key={item} className="micro-label bg-background p-5 text-text">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
