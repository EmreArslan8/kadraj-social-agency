"use client";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";

export default function PageTransition() {
  const curtain = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const router = useRouter();
  const path = usePathname();
  useEffect(() => {
    const el = curtain.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.to(el, { yPercent: -100, duration: reduced ? 0 : .65, ease: "power4.inOut", onComplete: () => { busy.current = false; } });
    const click = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[data-transition]");
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === "_blank") return;
      const url = new URL(link.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      event.preventDefault();
      if (busy.current) return;
      busy.current = true;
      gsap.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: reduced ? 0 : .5, ease: "power4.inOut", onComplete: () => router.push(url.pathname + url.hash) });
    };
    document.addEventListener("click", click, true);
    return () => { document.removeEventListener("click", click, true); gsap.killTweensOf(el); };
  }, [path, router]);
  return <div ref={curtain} className="page-curtain" aria-hidden="true"><span>KADRAJ✳</span><small>FİKİRLER HAREKETE GEÇER.</small></div>;
}
