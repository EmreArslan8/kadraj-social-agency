"use client";
import { FormEvent, useState } from "react";
export default function ContactFooter() {
  const [downloaded, setDownloaded] = useState(false);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = `KADRAJ — Proje Briefi\n\nAd: ${data.get("name")}\nMarka: ${data.get("brand")}\nE-posta: ${data.get("email")}\nİhtiyaç: ${data.get("service")}\n\nProje:\n${data.get("message")}\n`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "kadraj-proje-briefi.txt"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setDownloaded(true);
  }
  return <footer id="contact" className="contact-section section-pad">
    <div className="section-heading"><span className="micro-label">05 / SIRADAKİ HİKÂYE SENİN</span><a href="#top" className="micro-label">BAŞA DÖN ↑</a></div>
    <h2 className="display">HADİ,<br /><em className="accent-serif">iz bırakalım.</em><span className="contact-arrow" aria-hidden="true">↗</span></h2>
    <div className="contact-grid"><div><p>Büyük bir lansman.<br />Yepyeni bir başlangıç.<br />Ya da sadece bir merhaba.</p><span className="micro-label">GEL, KADRAJI BİRLİKTE KURALIM.</span></div>
      <form onSubmit={submit} onChange={() => setDownloaded(false)}>
        <div className="form-pair"><label>Adın<input name="name" placeholder="Seni nasıl tanıyalım?" required autoComplete="name" maxLength={100} /></label><label>Markan<input name="brand" placeholder="Marka / şirket adı" required autoComplete="organization" maxLength={100} /></label></div>
        <div className="form-pair"><label>E-posta<input name="email" type="email" placeholder="sen@markan.com" required autoComplete="email" maxLength={200} /></label><label>Neye ihtiyacın var?<select name="service">{["Sosyal medya yönetimi", "İçerik & prodüksiyon", "Tasarım & 3D", "Dijital reklam", "Hepsini konuşalım"].map(item => <option key={item}>{item}</option>)}</select></label></div>
        <label>Aklındaki fikir<textarea name="message" placeholder="Biraz projenden bahset…" required rows={2} maxLength={4000} /></label>
        <div className="form-submit"><p>Proje briefini hazırla ve cihazına indir.<br />Bu demo üzerinden bilgi gönderilmez.</p><button type="submit">Briefini indir <span>↗</span></button></div>
        <p role="status" className="form-status">{downloaded ? "Briefin hazır. İndirilen dosyayı ajansla paylaşabilirsin." : ""}</p>
      </form>
    </div>
    <div className="footer-base"><a href="#top" className="brand-lockup">KADRAJ✳</a><span className="micro-label">SOSYAL MEDYA. TASARIM. HAREKET.</span><span className="micro-label">© 2026 · KONSEPT AJANS DEMOSU</span></div>
  </footer>;
}
