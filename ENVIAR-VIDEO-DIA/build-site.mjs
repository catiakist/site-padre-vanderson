/* Monta index.html a partir de index.src.html + fichas em content/config/*.json
   Roda no Netlify a cada publicação (ver netlify.toml). Não altera o layout:
   só injeta os textos/links/listas nos pontos marcados.                       */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const cfg = (f, d={}) => existsSync(`content/config/${f}`) ? JSON.parse(readFileSync(`content/config/${f}`,"utf8")) : d;
const capa = cfg("capa.json"), sobre = cfg("sobre.json"), palavra = cfg("palavra.json");
const whats = cfg("whatsapp.json"), agenda = cfg("agenda.json",{encontros:[]});
const oracoes = cfg("oracoes.json",{lista:[]}), links = cfg("links.json");

const esc = s => String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const inl = s => esc(s).replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>')
                       .replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>")
                       .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g,"$1<em>$2</em>");
const paras = md => String(md||"").split(/\n{2,}/).map(p=>p.trim()).filter(Boolean)
                      .map(p=>`<p>${inl(p)}</p>`).join("\n");

let html = readFileSync("index.src.html","utf8");

/* campos simples: <!--@key-->...<!--/@--> */
const RAW = new Set(["hero_title"]);
const F = {
  hero_eyebrow: capa.hero_eyebrow, hero_title: capa.hero_title, hero_sub: capa.hero_sub,
  lema_text: capa.lema_text, lema_cite: capa.lema_cite,
  sobre_eyebrow: sobre.eyebrow,
  palavra_eyebrow: palavra.eyebrow, palavra_titulo: palavra.titulo, palavra_kicker: palavra.kicker,
  palavra_h3: palavra.h3, palavra_texto: palavra.texto,
  whats_eyebrow: whats.eyebrow, whats_titulo: whats.titulo, whats_lead: whats.lead,
  whats_card_titulo: whats.card_titulo, whats_card_texto: whats.card_texto,
  oracoes_destaque_tag: oracoes.destaque_tag, oracoes_destaque_titulo: oracoes.destaque_titulo,
};
for (const [k,v] of Object.entries(F)) {
  if (v == null) continue;
  const re = new RegExp(`<!--@${k}-->[\\s\\S]*?<!--/@-->`);
  html = html.replace(re, `<!--@${k}-->${RAW.has(k)?v:esc(v)}<!--/@-->`);
}

/* bloco Sobre */
html = html.replace("<!--@@sobre_corpo-->", paras(sobre.corpo));

/* lista Agenda */
const EVT = (e)=>`<article class="event reveal">
<div class="event__date"><b>${esc(e.dia)}</b><span>${esc(e.mes)}</span></div>
<div class="event__info">
<h3>${esc(e.titulo)}</h3>
<p>${esc(e.descricao)}</p>
</div>
<div class="event__meta">
<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M8 4v4l3 2"/><circle cx="8" cy="8" r="6"/></svg>${esc(e.hora)}
</div>
</article>`;
html = html.replace("<!--LIST:agenda-->", (agenda.encontros||[]).map(EVT).join("\n"));

/* lista Orações */
const ARROW = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const PR = (o)=>`<li><a href="${esc(o.link||'#')}"><span><i class="n">${esc(o.num)}</i> ${esc(o.titulo)}</span>${ARROW}</a></li>`;
html = html.replace("<!--LIST:oracoes-->", (oracoes.lista||[]).map(PR).join("\n"));

/* substituições globais (texto da oração em destaque + links) a partir dos padrões do template */
const GLOBAL = [
  ["Vinde, Espírito Santo, enchei os corações dos vossos fiéis e acendei neles o fogo do vosso amor. Enviai o vosso Espírito e tudo será criado, e renovareis a face da terra.", esc(oracoes.destaque_texto)],
  ["https://www.youtube.com/channel/UCvTfDBISUCdvA43TUDEplZA", links.youtube],
  ["https://www.instagram.com/padrevanderson", links.instagram],
  ["https://whatsapp.com/channel/0029VaDxDVgDzgTH6yd3kF20", links.whatsapp_canal],
];
for (const [from,to] of GLOBAL){ if(to) html = html.split(from).join(to); }

writeFileSync("index.html", html);
console.log("index.html gerado. Encontros:", (agenda.encontros||[]).length, "| Orações:", (oracoes.lista||[]).length);


/* ---- Devoções (gera devocoes-data.js) ---- */
function devInline(s){ return esc(s)
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>')
  .replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>")
  .replace(/(^|[^*])\*([^*]+)\*(?!\*)/g,"$1<em>$2</em>"); }
function devMd(md){
  const lines=String(md||"").replace(/\r\n/g,"\n").split("\n"); const out=[]; let para=[],list=[],quote=[];
  const fP=()=>{ if(para.length){ out.push("<p>"+devInline(para.join(" "))+"</p>"); para=[]; } };
  const fL=()=>{ if(list.length){ out.push("<ul>"+list.map(x=>"<li>"+devInline(x)+"</li>").join("")+"</ul>"); list=[]; } };
  const fQ=()=>{ if(quote.length){ out.push("<blockquote>"+devInline(quote.join(" "))+"</blockquote>"); quote=[]; } };
  const fA=()=>{ fP(); fL(); fQ(); };
  for(const raw of lines){ const line=raw.trimEnd(); if(!line.trim()){ fA(); continue; } let m;
    if(m=line.match(/^(#{1,4})\s+(.*)$/)){ fA(); const lvl=Math.min(m[1].length+1,4); out.push("<h"+lvl+">"+devInline(m[2])+"</h"+lvl+">"); continue; }
    if(m=line.match(/^>\s?(.*)$/)){ fP(); fL(); quote.push(m[1]); continue; }
    if(m=line.match(/^[-*]\s+(.*)$/)){ fP(); fQ(); list.push(m[1]); continue; }
    fL(); fQ(); para.push(line.trim()); }
  fA(); return out.join("\n");
}
const _dev = {};
for(const [k,f] of [["saomiguel","dev-saomiguel.json"],["novena","dev-novena.json"]]){
  const o = cfg(f, {});
  _dev[k] = { titulo: o.titulo || "", html: devMd(o.corpo||"") };
}
writeFileSync("devocoes-data.js", "/* Gerado por build-site.mjs — nao edite a mao. */\nwindow.DEVOCOES = "+JSON.stringify(_dev)+";\n");
console.log("devocoes-data.js gerado.");


/* ---- Vídeos da Novena (gera videos-data.js p/ os dois sites) ---- */
{
  const v = cfg("videos-novena.json", {});
  const map = {};
  for (let i=1;i<=9;i++){ const u=(v["dia"+i]||"").trim(); if(u) map[i]=u; }
  writeFileSync("videos-data.js", "/* Gerado por build-site.mjs */\nwindow.NOVENA_VIDEOS = "+JSON.stringify(map)+";\n");
  console.log("videos-data.js gerado com", Object.keys(map).length, "video(s).");
}
