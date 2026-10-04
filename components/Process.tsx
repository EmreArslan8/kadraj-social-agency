export default function Process() {
  return <section className="process-section section-pad">
    <div className="section-heading"><span className="micro-label">BİRLİKTE NASIL ÇALIŞIRIZ?</span><span className="micro-label">FİKİR → ÜRETİM → YAYIN → ÖĞRENME</span></div>
    <div className="process-grid">{[
      ["01", "Önce seni tanırız.", "Markanı, hedeflerini ve kitleni dinleriz. Doğru sorularla ortak bir yön belirleriz."],
      ["02", "Sonra dünyanı kurarız.", "Strateji, görsel dil ve içerik fikirleri aynı hikâyenin parçalarına dönüşür."],
      ["03", "Birlikte büyütürüz.", "Üretir, yayınlar, ölçeriz. Öğrendiklerimizi bir sonraki fikrin başlangıcı yaparız."],
    ].map(([n, title, copy]) => <article key={n}><span className="process-number">{n}<i>↗</i></span><h3>{title}</h3><p>{copy}</p></article>)}</div>
  </section>;
}
