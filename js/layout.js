/* Topo, faixa de demonstração e rodapé iguais em todas as páginas. */
(function () {
  "use strict";
  var itens = [["index.html", "Início"], ["reservar.html", "Reservar"], ["minha-reserva.html", "Minha reserva"], ["marca.html", "Marca"], ["painel.html", "Painel"]];
  function topo(atual) {
    return '<div class="selo-demo">Amostra de demonstração · novapicks · dados fictícios · <a href="painel.html">painel da pousada</a> · <a href="marca.html">sistema de marca</a></div>' +
      '<header class="topo"><div class="wrap topo-int"><a href="index.html" aria-label="Pousada, página inicial" data-logo="44" style="text-decoration:none"></a><nav aria-label="Principal">' +
      itens.map(function (i) { return '<a href="' + i[0] + '"' + (i[0] === atual ? ' aria-current="page"' : "") + ">" + i[1] + "</a>"; }).join("") + "</nav></div></header>";
  }
  function rodape() {
    return '<footer class="rodape"><div class="wrap"><div class="rodape-int"><div data-logo="40" data-neg></div>' +
      '<p><span data-marca="cidade"></span><br><span data-marca="instagram"></span></p>' +
      '<a class="btn btn-sol" id="rodape-zap" href="#" target="_blank" rel="noopener">Falar no WhatsApp</a></div>' +
      '<p class="nota-demo">Amostra de demonstração criada pela novapicks, com dados fictícios. Não é uma pousada real e nenhuma reserva é cobrada.</p></div></footer>';
  }
  var t = document.getElementById("topo"), r = document.getElementById("rodape");
  if (t) t.innerHTML = topo(t.dataset.atual || "");
  if (r) r.innerHTML = rodape();
  var z = document.getElementById("rodape-zap");
  if (z) z.href = "https://wa.me/" + window.MARCA.whatsapp + "?text=" + encodeURIComponent("Olá! Vi o site e quero saber mais sobre a pousada.");
  if (window.Marca) window.Marca.aplicar();
})();
