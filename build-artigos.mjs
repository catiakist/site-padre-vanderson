/* Gera artigos-data.js a partir dos arquivos em content/artigos/*.md
   Roda automaticamente no Netlify a cada publicação (ver netlify.toml).   */
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";

const DIR = "content/artigos";

function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function inline(s){
  s = esc(s);
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>");
  return s;
}
function mdToHtml(md){
  const lines = md.replace(/\r\n/g,"\n").split("\n");
  const out = []; let para = []; let list = []; let quote = [];
  const flushP = () => { if(para.length){ out.push("<p>"+inline(para.join(" "))+"</p>"); para=[]; } };
  const flushL = () => { if(list.length){ out.push("<ul>"+list.map(li=>"<li>"+inline(li)+"</li>").join("")+"</ul>"); list=[]; } };
  const flushQ = () => { if(quote.length){ out.push("<blockquote>"+inline(quote.join(" "))+"</blockquote>"); quote=[]; } };
  const flushAll = () => { flushP(); flushL(); flushQ(); };
  for(const raw of lines){
    const line = raw.trimEnd();
    if(!line.trim()){ flushAll(); continue; }
    let m;
    if(m = line.match(/^(#{1,4})\s+(.*)$/)){ flushAll(); const lvl=Math.min(m[1].length+1,4); out.push(`<h${lvl}>`+inline(m[2])+`</h${lvl}>`); continue; }
    if(m = line.match(/^>\s?(.*)$/)){ flushP(); flushL(); quote.push(m[1]); continue; }
    if(m = line.match(/^[-*]\s+(.*)$/)){ flushP(); flushQ(); list.push(m[1]); continue; }
    flushL(); flushQ(); para.push(line.trim());
  }
  flushAll();
  return out.join("\n");
}
function parseFront(txt){
  const m = txt.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if(!m) return { data:{}, body:txt };
  const data = {};
  for(const l of m[1].split("\n")){
    const mm = l.match(/^(\w+):\s*(.*)$/);
    if(mm){ let v=mm[2].trim(); if((v.startsWith('"')&&v.endsWith('"'))||(v.startsWith("'")&&v.endsWith("'"))) v=v.slice(1,-1); data[mm[1]]=v; }
  }
  return { data, body:m[2] };
}
function dateBR(iso){ const p=String(iso).slice(0,10).split("-"); return p.length===3 ? `${p[2]}/${p[1]}/${p[0]}` : iso; }

let files = [];
if(existsSync(DIR)) files = readdirSync(DIR).filter(f=>f.endsWith(".md"));
const artigos = files.map(f=>{
  const { data, body } = parseFront(readFileSync(`${DIR}/${f}`,"utf8"));
  const slug = f.replace(/\.md$/,"");
  const html = mdToHtml(body.trim());
  const words = body.replace(/[#>*\-]/g," ").split(/\s+/).filter(Boolean).length;
  let img = data.image || "assets/img/leitura.jpg";
  img = img.replace(/^\//,"");
  return {
    slug,
    title: data.title || "Sem título",
    date: String(data.date||"").slice(0,10),
    dateBR: dateBR(data.date||""),
    tag: data.tag || "Artigo",
    image: img,
    excerpt: data.excerpt || body.trim().split("\n").find(Boolean)?.replace(/[#>*]/g,"").slice(0,140) || "",
    anexo: (data.anexo||"").replace(/^\//,""),
    readingMin: Math.max(1, Math.round(words/200)),
    html
  };
}).sort((a,b)=> (a.date<b.date?1:a.date>b.date?-1:0));

const banner = "/* Gerado automaticamente por build-artigos.mjs — não edite à mão. */\n";
writeFileSync("artigos-data.js", banner+"window.ARTIGOS = "+JSON.stringify(artigos)+";\n");
console.log(`artigos-data.js gerado com ${artigos.length} artigo(s).`);
