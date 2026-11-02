/* ============================================================
   WORLD OF MANGA — MODE BLACK FRIDAY
   Mets BLACK_FRIDAY = false pour revenir au site normal.
   À inclure juste avant </body> (après le <script> principal) :
   <script src="blackfriday.js"></script>
   ============================================================ */
(function () {
  const BLACK_FRIDAY = true;
  if (!BLACK_FRIDAY) return;
 
  const BF_TSHIRT_PRICE = 8000;
  // Fin de l'opération : dimanche 29 novembre 2026, 23h59 (UTC = Abidjan)
  const BF_END = new Date('2026-11-29T23:59:59Z').getTime();
  // Arrêt automatique : après la date de fin, le site redevient normal tout seul.
  if (Date.now() > BF_END) return;
 
  /* ---------- 1. STYLE ---------- */
  const css = `
    :root { --bleu:#000; }
    body { background:#111 !important; }
    body::before { background-image:radial-gradient(circle,rgba(240,192,48,.07) 1px,transparent 1px) !important; }
    .promo-bar { background:#000 !important; border-bottom:2px solid var(--or) !important; }
    .promo-item { color:var(--or) !important; }
    .promo-sep { color:var(--rouge) !important; }
    .countdown-banner { background:linear-gradient(90deg,#000,#1a0000,#000) !important; border-bottom:4px solid var(--or) !important; }
    .cd-block { border-color:var(--rouge) !important; }
    .panel-1 { background:#000 !important; }
    .panel-1 h1 em { color:var(--or) !important; text-shadow:3px 3px 0 var(--rouge); }
    .panel-4 { background:var(--rouge) !important; }
    .panel-4 p { color:#fff !important; }
    .panel-4 .tag { background:var(--or) !important; color:#000 !important; }
    .panel-3 { background:#000 !important; }
    .products-section { background:#111 !important; }
    .pcard { background:#1b1b1b !important; }
    .pcard-badge { background:var(--or) !important; color:#000 !important; font-size:.9rem !important; padding:4px 12px !important; }
    .pcard-price .old { color:rgba(245,240,228,.45); text-decoration:line-through; font-size:.8rem; margin-right:6px; }
    .pcard-price .new { color:var(--or); }
    .delivery-banner { background:#000 !important; }
    .nl-section { background:var(--rouge) !important; }
    .nl-left h2, .nl-left p { color:#fff !important; }
    .nl-left h2 em { color:var(--or) !important; }
    .bf-ribbon { position:fixed; top:100px; left:-46px; z-index:1050; background:var(--or); color:#000;
      font-family:'Bangers',cursive; letter-spacing:3px; font-size:.95rem; padding:5px 56px;
      transform:rotate(-45deg); transform-origin:center; border:2px solid #000; box-shadow:3px 3px 0 var(--rouge); pointer-events:none; }
    @media(max-width:900px){ .bf-ribbon{ display:none; } }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
 
  /* ---------- 2. PRIX : tous les T-shirts à 8 000 F ---------- */
  function applyBlackFriday() {
    products.forEach(p => {
      if (!p._bf) {
        p._bf = true;
        p.oldPrice = p.price;
        // T-shirts : prix fixe 8 000 F. Autres articles : -33 % arrondi à la centaine.
        p.price = p.cat === 'tshirt' ? BF_TSHIRT_PRICE : Math.round(p.price * 0.67 / 100) * 100;
        p.badge = '-33% BLACK FRIDAY';
      }
    });
  }
 
  // On enveloppe renderProducts : la grille est reconstruite après chaque
  // chargement Firestore ou filtre, donc le prix reste toujours appliqué.
  const originalRender = renderProducts;
  renderProducts = function (cat) {
    applyBlackFriday();
    originalRender(cat);
    document.querySelectorAll('.pcard').forEach(card => {
      const p = products.find(x => x.id == card.dataset.id);
      if (p && p.oldPrice) {
        const el = card.querySelector('.pcard-price');
        if (el) el.innerHTML = `<span class="old">${p.oldPrice.toLocaleString()} F</span><span class="new">${p.price.toLocaleString()} F</span>`;
      }
    });
  };
  applyBlackFriday();
  renderProducts();
 
  /* ---------- 3. TEXTES ---------- */
  const setText = (sel, html) => { const el = document.querySelector(sel); if (el) el.innerHTML = html; };
 
  setText('.intro-sub', 'BLACK FRIDAY 2026');
  setText('.panel-tag', 'BLACK FRIDAY 2026');
  setText('.panel-4 .tag', '-33%');
  setText('.panel-4 p', 'BLACK<br>FRIDAY<br>-33% PARTOUT !');
  setText('.cd-label', '⚡ <span>BLACK FRIDAY</span> — Se termine dans :');
  const lastCd = document.querySelectorAll('#countdownBanner > .cd-label')[1];
  if (lastCd) lastCd.innerHTML = '— <span style="color:var(--or);">-33% sur toute la boutique !!</span>';
  document.title = 'World of Manga — BLACK FRIDAY -33% sur tout';
 
  const promoMsgs = [
    '🖤 BLACK FRIDAY : -33% SUR TOUTE LA BOUTIQUE ! T-SHIRTS À 8 000 FCFA',
    '🔥 LIVRAISON GRATUITE dès 25 000 FCFA',
    '⚡ Offre limitée — jusqu\'au 29 novembre',
    '🚀 Livraison 48h à Abidjan',
    '✏️ Articles personnalisés disponibles !!'
  ];
  document.getElementById('promoTrack').innerHTML =
    [...promoMsgs, ...promoMsgs].map(m => `<span class="promo-item">${m}</span><span class="promo-sep">✦</span>`).join('');
 
  const ribbon = document.createElement('div');
  ribbon.className = 'bf-ribbon';
  ribbon.textContent = 'BLACK FRIDAY';
  document.body.appendChild(ribbon);
 
  /* ---------- 4. COMPTE À REBOURS jusqu'à la fin de l'opération ---------- */
  function tickBF() {
    const diff = Math.max(0, BF_END - Date.now());
    document.getElementById('cdH').textContent = String(Math.floor(diff / 3600000)).padStart(2, '0');
    document.getElementById('cdM').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('cdS').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    if (diff === 0) document.getElementById('countdownBanner').style.display = 'none';
  }
  tickBF();
  setInterval(tickBF, 1000); // s'exécute après le compte à rebours d'origine et le remplace
})();
 