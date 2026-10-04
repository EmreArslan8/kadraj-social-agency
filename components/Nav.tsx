"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const LINKS = [{ label: "İşler", href: "work" }, { label: "Hizmetler", href: "studio" }, { label: "Yaklaşım", href: "manifesto" }];
export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (menuOpen) dialog.current?.showModal(); else dialog.current?.close();
    if (!menuOpen) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = old; };
  }, [menuOpen]);
  const href = (id: string) => pathname === "/" ? `#${id}` : `/#${id}`;
  return <>
    <nav className="agency-nav" aria-label="Ana menü">
      <a href={href("top")} data-transition className="brand-lockup"><span className="nav-brand-serif">KADRAJ</span><span className="nav-brand-sans">SOCIAL</span></a>
      <div className="desktop-links">{LINKS.map(link => <a key={link.href} href={href(link.href)} data-transition>{link.label}<span>↗</span></a>)}</div>
      <a href={href("contact")} data-transition className="nav-brief">Bir fikrim var <span>↗</span></a>
      <button className="mobile-toggle" onClick={() => setMenuOpen(true)} aria-label="Menüyü aç" aria-expanded={menuOpen}><span /><span /></button>
    </nav>
    <dialog ref={dialog} className="mobile-menu" onCancel={() => setMenuOpen(false)} onClose={() => setMenuOpen(false)}>
      <div className="menu-top"><span className="brand-lockup">KADRAJ✳</span><button onClick={() => setMenuOpen(false)} aria-label="Menüyü kapat">×</button></div>
      {[...LINKS, { label: "İletişim", href: "contact" }].map((link, i) => <a key={link.href} href={href(link.href)} data-transition onClick={() => setMenuOpen(false)}><sup>0{i+1}</sup>{link.label}<span>↗</span></a>)}
      <p className="micro-label">BİR SONRAKİ İYİ FİKİR, BİR MERHABA İLE BAŞLAR.</p>
    </dialog>
  </>;
}
