/* Regras de reserva: disponibilidade, preço por noite, reservas e bloqueios.
   Na amostra os dados ficam no navegador (localStorage); em produção troca por um banco online
   sem mudar as telas. */
(function () {
  "use strict";
  var P = window.POUSADA, KR = "pv-reservas", KB = "pv-bloqueios", KS = "pv-seed";
  var MS = 86400000;

  function lerJSON(k, pad) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? pad : v; } catch (e) { return pad; } }
  function gravar(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* datas como texto AAAA-MM-DD, sempre em hora local */
  function dstr(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function parse(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function soma(s, n) { var d = parse(s); d.setDate(d.getDate() + n); return dstr(d); }
  function noites(ci, co) { return Math.round((parse(co) - parse(ci)) / MS); }
  function hoje() { return dstr(new Date()); }
  var DIAS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  var MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  function dataLonga(s) { var d = parse(s); return DIAS[d.getDay()] + ", " + d.getDate() + " de " + MESES[d.getMonth()]; }
  function brl(v) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
  function soDigitos(t) { return String(t || "").replace(/\D/g, ""); }

  function quarto(id) { return P.quartos.filter(function (q) { return q.id === id; })[0]; }

  /* ---- dados ---- */
  function reservas() { return lerJSON(KR, []); }
  function bloqueios() { return lerJSON(KB, []); }
  function salvarReservas(l) { gravar(KR, l); }
  function salvarBloqueios(l) { gravar(KB, l); }
  function ativa(r) { return r.status === "reservada" || r.status === "hospedada"; }

  /* ---- preço ---- */
  function precoNoite(q, dia) {
    var d = parse(dia), mes = d.getMonth() + 1, sem = d.getDay(), v = q.diaria;
    if (P.altaTemporada.meses.indexOf(mes) >= 0) v *= 1 + P.altaTemporada.acrescimo;
    if (sem === 5 || sem === 6) v *= 1 + P.fimDeSemana;
    return Math.round(v / 5) * 5;
  }
  function preco(q, ci, co) {
    var tot = 0, lista = []; for (var d = ci; d < co; d = soma(d, 1)) { var v = precoNoite(q, d); tot += v; lista.push({ dia: d, valor: v }); }
    return { total: tot, noites: lista.length, media: lista.length ? Math.round(tot / lista.length) : 0, lista: lista };
  }

  /* ---- disponibilidade ---- */
  function ocupadas(id, ci, co, ignorarId) {
    var n = 0;
    reservas().forEach(function (r) { if (r.quartoId === id && ativa(r) && r.id !== ignorarId && r.ci < co && r.co > ci) n++; });
    bloqueios().forEach(function (b) { if (b.quartoId === id && b.ini < co && soma(b.fim, 1) > ci) n++; });
    return n;
  }
  function livres(q, ci, co) { return Math.max(0, q.qtd - ocupadas(q.id, ci, co)); }
  function ocupacaoDia(q, dia) { return ocupadas(q.id, dia, soma(dia, 1)); }

  /* valida um pedido; devolve texto de erro ou "" */
  function validar(ci, co, adultos, criancas) {
    if (!ci || !co) return "Escolha a data de entrada e a de saída.";
    if (ci < hoje()) return "A entrada não pode ser antes de hoje.";
    if (co <= ci) return "A saída precisa ser depois da entrada.";
    if (noites(ci, co) > 30) return "Para estadias acima de 30 noites, fale com a pousada.";
    if (ci > soma(hoje(), P.diasAFrente)) return "As datas abrem até " + P.diasAFrente + " dias à frente.";
    if (adultos < 1) return "Informe ao menos 1 adulto.";
    return "";
  }

  function codigo() {
    var al = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = ""; for (var i = 0; i < 5; i++) s += al[Math.floor(Math.random() * al.length)];
    return reservas().some(function (r) { return r.cod === s; }) ? codigo() : s;
  }
  function criar(d) {
    var q = quarto(d.quartoId); if (!q || livres(q, d.ci, d.co) < 1) return null;
    var p = preco(q, d.ci, d.co), r = {
      id: "r" + Date.now() + Math.floor(Math.random() * 1000), cod: codigo(), quartoId: q.id, quartoNome: q.nome, ci: d.ci, co: d.co,
      adultos: d.adultos, criancas: d.criancas || 0, nome: d.nome, tel: d.tel, obs: d.obs || "", total: p.total, noites: p.noites,
      status: "reservada", origem: d.origem || "site", criadoEm: Date.now()
    };
    var l = reservas(); l.push(r); salvarReservas(l); return r;
  }
  function porCodigo(c) { c = String(c || "").trim().toUpperCase(); return reservas().filter(function (r) { return r.cod === c; })[0] || null; }
  function mudar(id, patch) {
    var l = reservas(); l.forEach(function (r) { if (r.id === id) Object.keys(patch).forEach(function (k) { r[k] = patch[k]; }); }); salvarReservas(l);
  }
  function addBloqueio(b) { var l = bloqueios(); l.push({ id: "b" + Date.now(), quartoId: b.quartoId, ini: b.ini, fim: b.fim, motivo: b.motivo || "" }); salvarBloqueios(l); }
  function delBloqueio(id) { salvarBloqueios(bloqueios().filter(function (b) { return b.id !== id; })); }
  function limparTudo() { try { localStorage.removeItem(KR); localStorage.removeItem(KB); localStorage.removeItem(KS); } catch (e) {} semear(); }

  /* reservas de exemplo a partir de hoje, para a demonstração já abrir com movimento */
  function semear() {
    if (lerJSON(KS, false)) return;
    var h = hoje(), nomes = ["Ana Ferreira", "Bruno Lima", "Carla Moreira", "Diego Alves", "Elisa Nunes", "Fábio Costa", "Gabi Rocha"];
    var plano = [["jardim", -1, 3], ["jardim", 2, 5], ["mar", 0, 2], ["mar", 3, 6], ["familia", 1, 4], ["familia", 5, 8], ["bangalo", 2, 5], ["jardim", 4, 7], ["jardim", 4, 6], ["mar", 6, 9]];
    var l = [];
    plano.forEach(function (p, i) {
      var ci = soma(h, p[1]), co = soma(h, p[2]), q = quarto(p[0]);
      l.push({ id: "s" + i, cod: "DEMO" + (i + 1), quartoId: q.id, quartoNome: q.nome, ci: ci, co: co, adultos: 2, criancas: 0, nome: nomes[i % nomes.length], tel: "12990000" + ("00" + i).slice(-3),
        obs: "", total: preco(q, ci, co).total, noites: noites(ci, co), status: p[1] <= 0 ? "hospedada" : "reservada", origem: i % 3 === 2 ? "WhatsApp" : "site", criadoEm: Date.now() - i * 3600000 });
    });
    salvarReservas(l); gravar(KS, true);
  }

  window.Reservas = {
    P: P, quartos: P.quartos, quarto: quarto, dstr: dstr, parse: parse, soma: soma, noites: noites, hoje: hoje, dataLonga: dataLonga, brl: brl, soDigitos: soDigitos,
    DIAS: DIAS, MESES: MESES, reservas: reservas, bloqueios: bloqueios, precoNoite: precoNoite, preco: preco, livres: livres, ocupacaoDia: ocupacaoDia,
    validar: validar, criar: criar, porCodigo: porCodigo, mudar: mudar, addBloqueio: addBloqueio, delBloqueio: delBloqueio, limparTudo: limparTudo, semear: semear, ativa: ativa
  };
  semear();
})();
