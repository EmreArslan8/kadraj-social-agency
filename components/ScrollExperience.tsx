"use client";
import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./Hero";
import MediaSlot from "./MediaSlot";
gsap.registerPlugin(ScrollTrigger);
const IDS = ["top", "manifesto", "work", "approach", "studio", "next"];
const LABELS = ["Başlangıç", "Bakış açımız", "İşler", "İçerik & etki", "Hizmetler", "Sıradaki fikir"];
const SERVICES = [
  {title:"Sosyal medya", kind:"social", media:"work-01", tag:"STRATEJİ & TOPLULUK", text:"Doğru fikir, doğru kitle, doğru zaman. Markanın sesini birlikte bulalım.", items:["İçerik takvimi","Topluluk yönetimi","Aylık rapor"]},
  {title:"İçerik stüdyosu", kind:"film", media:"hero", tag:"VİDEO & PRODÜKSİYON", text:"İlk saniyede yakalayan Reels, marka filmleri ve fotoğraf prodüksiyonları.", items:["Reels & TikTok","Marka filmi","Fotoğraf"]},
  {title:"Tasarım & 3D", kind:"motion", media:"work-03", tag:"GÖRSEL KİMLİK & HAREKET", text:"Ekranın sınırlarını aşan fikirler. Markana ait, akılda kalan bir görsel dünya.", items:["Kimlik","3D & motion","Kampanya görseli"]},
  {title:"Dijital reklam", kind:"growth", media:"work-02", tag:"PERFORMANS & ÖLÇÜM", text:"Yaratıcı fikri veriye bağlayan kampanyalar, testler ve sürekli optimizasyon.", items:["Meta & Google Ads","A/B test","Dönüşüm takibi"]},
];
// Small live "UI" motif per service, layered over the card's footage.
function ServiceWidget({ kind }: { kind: string }) {
  if (kind === "social") return <span className="service-widget widget-social"><small>AYLIK ERİŞİM</small><b>+%340</b><svg viewBox="0 0 120 34" preserveAspectRatio="none"><path d="M0 31 C18 29 26 27 38 24 S58 21 70 16 S94 9 104 6 S116 3 120 2" /></svg><em>♥ 24,8B</em></span>;
  if (kind === "film") return <span className="service-widget widget-film"><i className="rec">REC</i><b>00:00:15:08</b><small>4K · 25P · 9:16</small></span>;
  if (kind === "motion") return <span className="service-widget widget-motion"><svg viewBox="0 0 100 100"><defs><path id="ring" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" /></defs><text><textPath href="#ring">KİMLİK · HAREKET · 3D · KİMLİK · HAREKET · 3D ·</textPath></text></svg><b>✳</b></span>;
  return <span className="service-widget widget-growth"><small>ROAS</small><b>4,2×</b><span className="bars">{[38,52,46,70,64,92].map((h,i)=><i key={i} style={{height:`${h}%`}} />)}</span></span>;
}

export default function ScrollExperience({ start }: { start: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const jump = useRef<(index: number) => void>(() => {});
  const [active, setActive] = useState(0);
  useLayoutEffect(() => {
    const el = root.current, viewport = stage.current;
    if (!el || !viewport) return;
    jump.current = index => document.getElementById(IDS[index])?.scrollIntoView();
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference) and (min-height: 600px)", () => {
      el.classList.add("is-cinematic");
      const panels = gsap.utils.toArray<HTMLElement>(".story-panel", el);
      const board = el.querySelector<HTMLElement>(".moodboard-track")!;
      const collection = el.querySelector<HTMLElement>(".collection-track")!;
      const gallery = el.querySelector<HTMLElement>(".collection-window")!;
      let current = -1;
      const activate = (index: number) => {
        if (current === index) return;
        current = index; setActive(index);
        document.documentElement.dataset.surface = [2,3,5].includes(index) ? "light" : "dark";
        panels.forEach((panel, i) => { panel.inert = i !== index; });
        panels.forEach((panel, i) => panel.querySelectorAll<HTMLVideoElement>("video").forEach(video => {
          if (i === index) video.play().catch(() => {}); else video.pause();
        }));
      };
      gsap.set(panels.slice(1), { yPercent: 110 });
      gsap.set(panels[1], { yPercent: 0, autoAlpha: 0 });
      gsap.set(panels[5], { yPercent: 0, clipPath: "ellipse(0% 0% at 50% 100%)" });
      const tl = gsap.timeline({ defaults:{ease:"power2.inOut"}, scrollTrigger:{
        trigger:el, start:"top top", end:()=>`+=${window.innerHeight * 9.5}`, pin:viewport, scrub:.8,
        anticipatePin:1, invalidateOnRefresh:true,
        onUpdate:self => { const t=self.progress*12; activate(t<.95?0:t<2.95?1:t<6.05?2:t<8.1?3:t<10.9?4:5); },
      }});
      tl.addLabel("top",0)
        .to(".flow-wall",{scale:1.3,rotation:0,yPercent:-8,duration:1.3},.05)
        .to(".flow-copy",{scale:1.12,y:-70,opacity:0,duration:.8},.1)
        .to(".flow-bottom",{opacity:0,duration:.4},.1)
        .to(".flow-shade",{opacity:.35,duration:.6},.15)
        .to(panels[1],{autoAlpha:1,duration:.75},.95)
        .from(".statement-copy",{scale:.8,y:120,opacity:0,duration:.8},1.05)
        .fromTo(".statement-word",{opacity:.22},{opacity:1,stagger:.07,duration:.2,ease:"none"},1.2)
        .addLabel("manifesto",2.15)
        .to(panels[1],{yPercent:-50,scale:.94,duration:1.2},2.4)
        .to(panels[2],{yPercent:0,duration:1.2},2.4)
        .from(".board-photo",{y:150,rotate:8,stagger:.06,duration:1},2.8)
        .addLabel("work",3.6)
        .to(board,{x:()=>-Math.max(0,board.scrollWidth-viewport.clientWidth),duration:2.35,ease:"none"},3.55)
        .to(".board-tall",{y:-70,duration:2.35,ease:"none"},3.55)
        .to(".board-small",{y:65,duration:2.35,ease:"none"},3.55)
        .to(panels[2],{scale:.9,opacity:.2,duration:1},5.7)
        .to(panels[3],{yPercent:0,duration:1},5.7)
        .from(".split-title-left",{xPercent:-70,duration:1.1},5.8)
        .from(".split-title-right",{xPercent:70,duration:1.1},5.8)
        .addLabel("approach",6.9)
        .fromTo(".bridge-media",{clipPath:"inset(20% 32% 0% 32% round 45% 45% 0 0)",scale:.85},{clipPath:"inset(0% 0% 0% 0% round 0% 0% 0 0)",scale:1,duration:1.1},7)
        .to(".split-content",{opacity:0,scale:1.1,duration:.6},7.2)
        .to(panels[4],{yPercent:0,duration:1},7.65)
        .from(".collection-heading",{y:70,opacity:0,duration:.7},8)
        .from(".collection-card",{y:110,opacity:0,stagger:.1,duration:.9},8)
        .from(".service-widget",{scale:.6,opacity:0,stagger:.1,duration:.7},8.25)
        .addLabel("studio",8.65)
        .to(collection,{x:()=>-Math.max(0,collection.scrollWidth-gallery.clientWidth),duration:1.75,ease:"none"},8.7)
        .to(panels[4],{scale:.9,borderRadius:"0 0 12% 12%",duration:1},10.3)
        .to(panels[5],{clipPath:"ellipse(150% 150% at 50% 100%)",duration:1.2},10.3)
        .from(".fan-card",{y:250,rotation:0,scale:.3,stagger:.06,duration:1},10.65)
        .from(".next-copy",{opacity:0,y:70,duration:.8},10.8)
        .addLabel("next",11.5).to({}, {duration:.5},11.5);
      activate(0);
      jump.current = index => {
        const st=tl.scrollTrigger;if(!st)return;
        const top=st.start+tl.labels[IDS[index]]/tl.duration()*(st.end-st.start);
        window.dispatchEvent(new CustomEvent("kadraj:scroll",{detail:top}));
      };
      const anchor=(event:MouseEvent)=>{
        const link=(event.target as Element).closest<HTMLAnchorElement>("a[href]");
        if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
        const url=new URL(link.href);if(url.origin!==location.origin||url.pathname!==location.pathname)return;
        const index=IDS.indexOf(url.hash.slice(1));if(index<0)return;
        event.preventDefault();history.replaceState(history.state,"",url.hash);jump.current(index);
      };
      document.addEventListener("click",anchor,true);
      const hash=()=>{const i=IDS.indexOf(location.hash.slice(1));if(i>=0)jump.current(i);};
      const timer=setTimeout(()=>{ScrollTrigger.refresh();hash();},180);
      window.addEventListener("hashchange",hash);
      return()=>{
        clearTimeout(timer);document.removeEventListener("click",anchor,true);window.removeEventListener("hashchange",hash);
        el.classList.remove("is-cinematic");delete document.documentElement.dataset.surface;
        panels.forEach(panel=>{panel.inert=false;panel.querySelectorAll<HTMLVideoElement>("video").forEach(v=>v.pause());});
        jump.current=index=>document.getElementById(IDS[index])?.scrollIntoView();
      };
    },el);
    return()=>mm.revert();
  },[]);
  return <div ref={root} className="scroll-experience lando-experience" data-chapter={active}>
    <div ref={stage} className="story-stage">
      <div className="story-panel story-hero"><Hero start={start} cinematic /></div>
      <section id="manifesto" className="story-panel statement-scene topography">
        <span className="tiny-tag">KADRAJ SOCIAL STUDIO / BAKIŞ AÇIMIZ</span>
        <h2 className="statement-copy">{[
          ["İYİ",false],["FİKİRLERİ",true],["İNSANLARLA",false],["BULUŞTURURUZ.",false],["HER",false],["EKRANDA",false],["AYNI",false],["KARAKTER.",true],
        ].map(([word,serif],i)=><span key={i} className={`statement-word ${serif?"serif-word":""}`}>{word}{" "}</span>)}</h2>
        <span className="signature">Kadraj.</span><p className="statement-note">Markanı sadece görünür değil,<br />vazgeçilmez kılan fikirler.</p>
      </section>
      <section id="work" className="story-panel moodboard-scene topography">
        <div className="board-label"><span className="tiny-tag">KADRAJDAN KARELER</span><span className="tiny-tag">KREATİF İŞLER / KONSEPT SEÇKİ</span></div>
        <div className="moodboard-track">
          <div className="board-column board-intro"><h2>İyi bir fikir,<br /><em>her yerde</em><br />kendini belli eder.</h2><span className="signature">Kadraj.</span><p>Kaydırmaya devam et.<br />Her karenin bir hikâyesi var. →</p><div className="board-photo board-small"><span>HAREKET ÇALIŞMASI / 2026</span><MediaSlot src="work-04" ratio="4/3" label="Hareket çalışması" preload="none" /></div></div>
          <div className="board-column board-main"><Link className="board-photo board-tall" href="/work/neon-harvest" data-transition aria-label="NEON HARVEST projesini incele"><span>NEON HARVEST / SOSYAL KAMPANYA</span><MediaSlot src="work-01" ratio="4/5" label="Neon Harvest" preload="none" /><b>↗</b></Link><p className="board-quote">“İlk saniyede dikkat.<br />Sonrasında kalıcı bir his.”</p></div>
          <div className="board-column board-stack"><Link className="board-photo board-small" href="/work/orbit" data-transition aria-label="ORBIT projesini incele"><span>ORBIT / 3D & MOTION</span><MediaSlot src="work-03" ratio="1/1" label="Orbit" preload="none" /><b>↗</b></Link><div className="board-photo board-tall"><span>YENİ BİR BAKIŞ / GÖRSEL ARAŞTIRMA</span><MediaSlot src="work-05" ratio="4/3" label="Görsel araştırma" preload="none" /></div></div>
          <div className="board-column board-main board-final"><Link className="board-photo board-tall" href="/work/velvet-chrome" data-transition aria-label="VELVET / CHROME projesini incele"><span>VELVET / CHROME — MARKA DÜNYASI</span><MediaSlot src="work-02" ratio="1/1" label="Velvet Chrome" preload="none" /><b>↗</b></Link><p className="board-quote">Fikirden son kareye,<br />aynı tutku. Aynı ekip.</p><a href="#studio" className="lime-button">NELER YAPIYORUZ? ↗</a></div>
        </div>
      </section>
      <section id="approach" className="story-panel split-scene">
        <div className="split-content"><div className="split-side split-left"><span className="tiny-tag">YARATICI TARAFIMIZ</span><h2 className="split-title-left">İÇERİK<br /><em>üretir.</em></h2><p>Video, fotoğraf, tasarım.<br />Markanın hikâyesini görünür kılarız.</p></div><div className="split-side split-right"><span className="tiny-tag">STRATEJİK TARAFIMIZ</span><h2 className="split-title-right">ETKİ<br /><em>yaratır.</em></h2><p>Strateji, reklam, topluluk.<br />İyi fikri doğru insanlarla buluştururuz.</p></div></div>
        <div className="bridge-media"><MediaSlot src="hero" label="Kreatif stüdyo showreel" preload="none" /><span>BİR FİKİR. HER YERDE.</span></div>
      </section>
      <section id="studio" className="story-panel collection-scene">
        <div className="collection-heading"><h2>TEK EKİP.<br /><em>ÇOK BOYUT.</em></h2><p>Stratejiden son kareye, markanın ihtiyacı olan her şey aynı masada. Fikri birlikte büyütelim.</p></div>
        <div className="collection-window"><div className="collection-track">{SERVICES.map((s,i)=><article key={s.title} className={`collection-card ${s.kind}`} onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty("--x",`${e.clientX-r.left}px`);e.currentTarget.style.setProperty("--y",`${e.clientY-r.top}px`);}}>
          <MediaSlot src={s.media} label={s.title} className="service-media" preload="none" />
          <span className="service-shade" aria-hidden="true" />
          <header className="service-top"><span className="service-index">0{i+1}</span><span className="service-tag">{s.tag}</span></header>
          <ServiceWidget kind={s.kind} />
          <div className="service-body"><h3>{s.title}</h3><p>{s.text}</p><ul>{s.items.map(item=><li key={item}>{item}</li>)}</ul></div>
          <a href="#contact" className="service-cta" aria-label={`${s.title} için projenden bahset`}>↗</a>
        </article>)}</div></div>
        <div className="collection-bottom"><span className="signature">Birlikte, daha ileri.</span><a href="#contact" className="lime-button">PROJENDEN BAHSET ↗</a></div>
      </section>
      <section id="next" className="story-panel next-scene topography">
        <div className="fan-art" aria-hidden="true">{["work-01","work-03","work-02","work-04","work-05"].map((src,i)=><div key={src} className={`fan-card fan-${i}`}><MediaSlot src={src} ratio="4/5" label="" preload="none" /></div>)}</div>
        <div className="next-copy"><span className="tiny-tag">HER İYİ İŞ, BİR MERHABA İLE BAŞLAR.</span><h2>SIRADAKİ<br /><em>iyi fikir</em><br />SENİN OLSUN.</h2><a href="#contact" className="lime-button">BİRLİKTE BAŞLAYALIM ↗</a></div>
      </section>
      <div className="chapter-rail" aria-label="Bölümler">{LABELS.map((label,i)=><button key={label} onClick={()=>jump.current(i)} aria-current={active===i?"step":undefined} aria-label={`${i+1}. bölüm: ${label}`}><span>0{i+1}</span><i /><b>{label}</b></button>)}</div>
    </div>
  </div>;
}
