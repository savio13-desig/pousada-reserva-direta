/* Sistema de marca: uma só fonte (MARCA em dados.js, mais o teste guardado em marca.html)
   alimenta cores, logotipo e textos de todas as páginas. */
(function () {
  "use strict";
  var KEY = "pv-marca";
  var BASE = window.MARCA;
  var PRESETS = [
    { id: "sal-serra", nome: "Sal & Serra", nota: "Mar profundo, mata e sol", cores: BASE.cores },
    { id: "bromelia", nome: "Bromélia", nota: "Verde-floresta e ouro", cores: { mar: "#14301f", mata: "#1f6b3a", agua: "#3a8f6b", sol: "#e8c547", sal: "#f5f8f2" } },
    { id: "ilha-azul", nome: "Ilha Azul", nota: "Azul marinho e laranja-sol", cores: { mar: "#0a2342", mata: "#1d4f91", agua: "#2b8cbe", sol: "#ffb703", sal: "#f4f8fc" } },
    { id: "coral", nome: "Coral", nota: "Grafite quente e coral", cores: { mar: "#2a2330", mata: "#a8392b", agua: "#2a8f9c", sol: "#ffc857", sal: "#fbf7f5" } }
  ];

  function ler() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) { return null; } }
  function get() {
    var o = ler() || {};
    return {
      nome: o.nome || BASE.nome, curto: o.curto || BASE.curto, inicial: o.inicial || BASE.inicial,
      slogan: o.slogan || BASE.slogan, cidade: BASE.cidade, instagram: BASE.instagram,
      cores: Object.assign({}, BASE.cores, o.cores || {})
    };
  }
  function salvar(patch) {
    var o = ler() || {}; Object.keys(patch).forEach(function (k) { o[k] = patch[k]; });
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
    aplicar();
  }
  function restaurar() { try { localStorage.removeItem(KEY); } catch (e) {} aplicar(); }

  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---- contraste (WCAG) ---- */
  function lum(hex) {
    var n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255].map(function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function razao(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }

  /* ---- logotipo ---- */
  /* selo: sol nascendo sobre duas ondas, dentro de um círculo. */
  function selo(c, tamanho, opts) {
    opts = opts || {}; var k = c.cores || c, fundo = opts.fundo || k.mar, sol = opts.sol || k.sol, onda = opts.onda || k.agua, onda2 = opts.onda2 || k.sal;
    return '<svg class="selo" width="' + tamanho + '" height="' + tamanho + '" viewBox="0 0 64 64" role="img" aria-label="Selo ' + esc(opts.rotulo || "da marca") + '">' +
      '<circle cx="32" cy="32" r="32" fill="' + fundo + '"/>' +
      '<circle cx="32" cy="30" r="11" fill="' + sol + '"/>' +
      '<path d="M0 38 Q8 33 16 38 T32 38 T48 38 T64 38 V64 H0Z" fill="' + onda + '"/>' +
      '<path d="M0 47 Q8 42 16 47 T32 47 T48 47 T64 47 V64 H0Z" fill="' + onda2 + '" opacity=".92"/></svg>';
  }
  function avatar(c, tamanho) {
    return '<svg class="selo" width="' + tamanho + '" height="' + tamanho + '" viewBox="0 0 64 64" role="img" aria-label="Avatar da marca">' +
      '<circle cx="32" cy="32" r="32" fill="' + c.cores.mata + '"/><text x="32" y="44" text-anchor="middle" font-family="Young Serif, Georgia, serif" font-size="36" fill="' + c.cores.sal + '">' + esc(c.inicial) + '</text></svg>';
  }
  function logo(c, opts) {
    opts = opts || {}; var t = opts.tamanho || 44;
    if (opts.so_selo) return selo(c, t, opts);
    return '<span class="logo' + (opts.negativo ? " logo-neg" : "") + '">' + selo(c, t, opts) +
      '<span class="logo-txt"><b>' + esc(c.curto) + '</b><small>' + esc(opts.sub || BASE.cidade.split(" · ")[0]) + '</small></span></span>';
  }

  /* ---- aplicação nas páginas ---- */
  function aplicar() {
    var c = get(), r = document.documentElement.style;
    ["mar", "mata", "agua", "sol", "sal"].forEach(function (k) { r.setProperty("--" + k, c.cores[k]); });
    document.querySelectorAll("[data-marca]").forEach(function (e) { e.textContent = c[e.dataset.marca] != null ? c[e.dataset.marca] : ""; });
    document.querySelectorAll("[data-logo]").forEach(function (e) {
      e.innerHTML = logo(c, { tamanho: Number(e.dataset.logo) || 44, negativo: e.hasAttribute("data-neg"), fundo: e.hasAttribute("data-neg") ? c.cores.sal : undefined, onda2: e.hasAttribute("data-neg") ? c.cores.mar : undefined });
    });
    if (!window.__titulo) window.__titulo = document.title;
    document.title = window.__titulo.split(BASE.nome).join(c.nome);
    var tc = document.querySelector('meta[name="theme-color"]'); if (tc) tc.setAttribute("content", c.cores.mar);
    document.dispatchEvent(new CustomEvent("marca:aplicada", { detail: c }));
  }

  window.Marca = { get: get, salvar: salvar, restaurar: restaurar, aplicar: aplicar, presets: PRESETS, razao: razao, logo: logo, selo: selo, avatar: avatar, esc: esc };
  aplicar();
})();
