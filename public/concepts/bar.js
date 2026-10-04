(()=>{const items=[["index.html","Fikirler"],["1-akis.html","1 · Akış duvarı"],["2-telefon.html","2 · Telefon & bildirim"],["3-vizor.html","3 · Kadraj vizörü"],["4-kinetik.html","4 · Kinetik yazı"]];
const here=location.pathname.split("/").pop()||"index.html";
const nav=document.createElement("nav");nav.className="concept-bar";
nav.innerHTML=items.map(([h,l])=>`<a href="${h}"${h===here?' aria-current="page"':""}>${l}</a>`).join("");
document.body.prepend(nav);})();
