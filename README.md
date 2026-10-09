# Reserva direta para pousadas e hotéis (amostra novapicks)

Demonstração para vender a pousadas e hotéis: site com reserva direta e um sistema de marca. HTML, CSS e JavaScript puros, sem build e sem servidor. Português do Brasil, preços em reais, dados fictícios (Pousada Sal & Serra, Juquehy).

- `index.html`: site da pousada, com busca de datas, quartos e perguntas frequentes.
- `reservar.html`: escolha de datas, hóspedes e quarto; mostra só quartos livres, preço por noite (fim de semana e alta temporada), confirmação com código, mensagem pronta para o WhatsApp e arquivo de calendário.
- `minha-reserva.html`: consulta e cancelamento pelo código (teste com `DEMO1`).
- `painel.html`: mapa de ocupação de 14 dias, reservas com check-in e check-out, bloqueio de datas.
- `marca.html`: sistema de marca. Logotipo (selo, negativa, uma cor, avatar), paleta com contraste, tipografia, post de Instagram em PNG, placa de QR e assinatura de e-mail. Trocar a paleta ou o nome aqui muda o site inteiro.

## Como vender para outra pousada
Edite `js/dados.js`: nome, cidade, WhatsApp, cores, quartos, quantidades, diárias e regras de preço. O logotipo, o site e as peças de marca se atualizam sozinhos.

## Limitações
Os dados de reservas e a marca de teste ficam no `localStorage` do navegador. Em produção entram um banco online, login no painel, envio automático do Pix do sinal e fotos reais dos quartos. Não há tema escuro nesta amostra.

## Rodar localmente
`python -m http.server 8000` na pasta e abrir http://127.0.0.1:8000
