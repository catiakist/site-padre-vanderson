# Site do Padre Vanderson — Painel de Artigos (/admin)

O site agora tem um PAINEL onde o padre escreve e publica artigos sozinho,
num editor visual, sem mexer em código. Endereço do painel: SEU-SITE/admin/

------------------------------------------------------------------
PARTE 1 — ATIVAÇÃO (uma única vez, ~15 min)
------------------------------------------------------------------
O painel precisa que o site fique no Netlify ligado ao GitHub (não serve o
"arrastar e soltar"). Passo a passo:

1. Crie uma conta grátis no GitHub (github.com) e no Netlify (netlify.com).
2. No GitHub, crie um repositório novo e envie para ele TODO o conteúdo
   desta pasta (os arquivos do site + as pastas content/ e admin/).
3. No Netlify: "Add new site" > "Import from Git" > escolha esse repositório.
   O Netlify já lê o arquivo netlify.toml e publica sozinho.
4. Ainda no Netlify, ative o login do painel:
   - Menu "Identity" > "Enable Identity".
   - Em Identity > Registration: deixe "Invite only".
   - Em Identity > Services > "Git Gateway": clique "Enable Git Gateway".
5. Convide o padre: Identity > "Invite users" > e-mail dele. Ele recebe um
   convite, cria a senha e pronto.

------------------------------------------------------------------
PARTE 2 — DIA A DIA (como o padre publica um artigo)
------------------------------------------------------------------
1. Acessar  SEU-SITE/admin/  e entrar com e-mail e senha.
2. Clicar em "Artigos" > "New Artigo".
3. Preencher: Título, Data, Categoria, Imagem de capa (opcional),
   Resumo e o Texto.
4. Clicar em "Publish". Em 1–2 minutos o artigo aparece no site,
   na página de Artigos e na página inicial.

Pronto. Nada de código.

------------------------------------------------------------------
OBSERVAÇÕES
------------------------------------------------------------------
- Os artigos ficam guardados na pasta content/artigos (um arquivo por texto).
- O formulário de pedido de oração já está configurado (Formspree).
- Dúvidas na ativação? Peça ajuda — dá para fazer isso junto, passo a passo.

------------------------------------------------------------------
NOVO — O painel agora edita TAMBÉM as seções do site
------------------------------------------------------------------
Dentro do painel (/admin), além de "Artigos", há "Conteúdo do site":
  - Capa e lema
  - Quem é o Padre
  - A Palavra de hoje
  - Agenda (adicionar/remover encontros)
  - Orações (Reze comigo)
  - Faixa do WhatsApp
  - Links e redes (YouTube, Instagram, Canal do WhatsApp)
Basta abrir a ficha, alterar e clicar em "Publish". O site atualiza sozinho.
(A galeria de fotos pelo painel é o próximo passo.)
