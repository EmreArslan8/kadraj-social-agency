import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import Nav from "@/components/Nav";
import MediaSlot from "@/components/MediaSlot";
import type { Metadata } from "next";
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(p => p.slug === slug);
  return { title: project ? `${project.title} — KADRAJ` : "Proje bulunamadı — KADRAJ" };
}
export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find(p => p.slug === slug);
  if (!project) notFound();
  const next = projects[(projects.indexOf(project) + 1) % projects.length];
  return <><Nav /><main id="main" className="case-page section-pad">
    <Link href="/#work" data-transition className="micro-label case-back">↖ TÜM İŞLER</Link>
    <div className="case-title"><span className="micro-label">{project.category} / {project.year} / KONSEPT PROJE</span><h1 className="display">{project.title}</h1><p>{project.result}</p></div>
    <MediaSlot src={project.src} label={project.title} ratio="16/9" preload="none" />
    <div className="case-story"><span className="micro-label">{project.client} / {project.index}</span><div><h2>Fikir.</h2><p>{project.brief}</p><h2>Yaklaşım.</h2><p>{project.approach}</p><div className="case-tags">{project.deliverables.map(item => <span key={item}>{item}</span>)}</div><p className="case-disclaimer">Bu çalışma, ajansın yaratıcı yaklaşımını göstermek için hazırlanmış bir konsept sunumdur.</p></div></div>
    <div className="case-next"><span className="micro-label">SIRADAKİ PROJE</span><Link data-transition href={`/work/${next.slug}`} className="display">{next.title}<span>↗</span></Link><Link href="/#contact" data-transition className="case-contact">Senin markan için ne yapabiliriz? ↗</Link></div>
  </main></>;
}
