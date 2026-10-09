/* Dados da pousada e da marca. Para vender a outra pousada ou hotel, troque só este arquivo.
   As cores, o logotipo e os textos do site inteiro saem daqui (ou da tela marca.html, que guarda
   uma versão de teste no navegador). */
window.MARCA = {
  nome: "Pousada Sal & Serra",
  curto: "Sal & Serra",
  inicial: "S",
  slogan: "Entre a serra e o mar",
  cidade: "Juquehy · São Sebastião, SP",
  endereco: "Rua Exemplo, 123 · Juquehy · São Sebastião · SP",
  whatsapp: "5512900000000", // 55 + DDD + número
  instagram: "@salaeserra.demo",
  // cinco cores com função fixa: mar (texto e fundos escuros), mata (ação principal),
  // agua (detalhes), sol (destaque), sal (fundo claro)
  cores: { mar: "#0b2b3c", mata: "#2f6b4f", agua: "#1f7a8c", sol: "#f2b632", sal: "#f6f9f8" }
};

window.POUSADA = {
  checkin: "14:00",
  checkout: "12:00",
  diasAFrente: 270,
  fimDeSemana: 0.15, // acréscimo na sexta e no sábado
  altaTemporada: { meses: [12, 1, 7], acrescimo: 0.25 }, // dezembro, janeiro e julho
  quartos: [
    { id: "jardim", nome: "Chalé Jardim", qtd: 3, cap: 2, diaria: 480, area: 22, cama: "1 cama queen",
      desc: "Chalé térreo com varanda para o jardim, ar-condicionado e frigobar.", itens: ["Varanda", "Ar-condicionado", "Café da manhã"] },
    { id: "mar", nome: "Suíte Vista Mar", qtd: 2, cap: 3, diaria: 690, area: 30, cama: "1 queen + 1 solteiro",
      desc: "Suíte no andar alto, janela larga para a praia e banheira de hidromassagem.", itens: ["Vista para o mar", "Hidromassagem", "Café da manhã"] },
    { id: "familia", nome: "Família Mata", qtd: 2, cap: 5, diaria: 820, area: 44, cama: "1 queen + 3 solteiro",
      desc: "Dois ambientes, cozinha pequena e deck privativo em contato com a mata.", itens: ["2 ambientes", "Cozinha pequena", "Deck privativo"] },
    { id: "bangalo", nome: "Bangalô Deck", qtd: 1, cap: 2, diaria: 890, area: 36, cama: "1 king",
      desc: "Bangalô isolado com deck, rede e ofurô, para quem quer silêncio.", itens: ["Ofurô", "Deck e rede", "Café no quarto"] }
  ]
};
