"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Wraps the app in Lenis smooth scrolling and syncs it with GSAP
// ScrollTrigger. Disabled entirely when the user prefers reduced motion.
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({ lerp: 0.1, anchors: false });

    // Drive ScrollTrigger updates from Lenis' scroll events.
    lenis.on("scroll", ScrollTrigger.update);
    const navigate = (event: Event) => lenis.scrollTo((event as CustomEvent<number>).detail, { duration: 1.4 });
    window.addEventListener("kadraj:scroll", navigate);
    const anchor = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      event.preventDefault();
      history.replaceState(history.state, "", url.hash);
      lenis.scrollTo(url.hash, { duration: 1.4 });
    };
    document.addEventListener("click", anchor);

    // Drive Lenis' RAF from GSAP's ticker for a single synced loop.
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("kadraj:scroll", navigate);
      document.removeEventListener("click", anchor);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
