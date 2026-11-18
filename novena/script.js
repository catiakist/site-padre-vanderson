const CONFIG = {
  // Configure no Supabase para compartilhar as intenções entre todos os visitantes.
  supabaseUrl: 'https://vjccdnwgaeytdppbhtgb.supabase.co',
  supabaseAnonKey: 'sb_publishable_eo5n00wo3lSwtWu2EvKoiA_HTRJGu6R',
  year: 2026,
};
const $ = (s) => document.querySelector(s);
const today = new Date();
const currentDay = today.getFullYear() === CONFIG.year && today.getMonth() === 10 && today.getDate() >= 18 && today.getDate() <= 26 ? today.getDate() - 17 : null;
if (!currentDay) document.querySelector('#todayButton').innerHTML = 'Começar pelo 1º dia <span aria-hidden="true">→</span>'; 
let selectedDay = Number(new URLSearchParams(location.search).get('dia')) || currentDay || 1;
selectedDay = Math.min(9, Math.max(1, selectedDay));
const done = new Set(JSON.parse(localStorage.getItem('novena-gracas-completed') || '[]').filter(n => n >= 1 && n <= 9));
let fontSize = Number(localStorage.getItem('novena-gracas-font-size') || 19);
const escapeHTML = str => String(str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dayLink = n => { const url = new URL(window.location.href); url.searchParams.set('dia', n); url.hash = 'oracao'; return url.toString(); };
function section(label, title, text) {return `<section class="prayer-section"><div class="prayer-label">${label}</div><h3>${title}</h3><p>${escapeHTML(text)}</p></section>`;}
function selectDay(n, scroll = false) {
  selectedDay = Math.min(9, Math.max(1, n));
  const d = NOVENA[selectedDay - 1];
  const url = new URL(location.href); url.searchParams.set('dia', selectedDay); history.replaceState({}, '', url);
  $('#prayerTitle').textContent = `${selectedDay}º dia — ${d.titulo}`;
  $('#prayerDate').textContent = `${17 + selectedDay} de novembro de ${CONFIG.year} · ${d.subtitulo}`;
  $('#prayerBody').innerHTML = `
    ${section('INÍCIO DA ORAÇÃO', 'Sinal da Cruz', TRADITIONAL.sinal)}
    ${section('INVOCAÇÃO', 'Vinde, Espírito Santo', TRADITIONAL.espirito)}
    <section class="prayer-section bible"><div class="prayer-label">PALAVRA DE DEUS</div><h3>Leitura bíblica do dia</h3><p class="reference">${escapeHTML(BIBLE_PASSAGES[selectedDay-1].ref)}</p><blockquote class="scripture-text">${escapeHTML(BIBLE_PASSAGES[selectedDay-1].texto)}</blockquote><p class="scripture-note">Tradução auxiliar própria em português, para acompanhar a oração; não é reprodução de uma edição bíblica oficial. Para ler a passagem completa, consulte <strong>${escapeHTML(d.ref)}</strong> na sua Bíblia.</p></section>
    ${section('REFLEXÃO', 'Levar a Palavra à vida', d.tema)}
    <section class="prayer-section"><div class="prayer-label">PARA REZAR COM A VIDA</div><h3>Perguntas para o coração</h3><ul>${d.perguntas.map(q => `<li>${escapeHTML(q)}</li>`).join('')}</ul></section>
    ${section('TESTEMUNHO', 'Santa Catarina Labouré', d.historia)}
    ${section('REZEMOS POR', 'Intenção do dia', d.intencao)}
    ${section('TERÇO COM A NOVENA', 'Mistério para contemplar', d.misterio)}
    ${section('A FÉ EM OBRAS', 'Gesto concreto', d.gesto)}
    ${section('ORAÇÃO DO DIA', 'Nossa Senhora das Graças', d.oracao)}
    ${section('ORAÇÃO TRADICIONAL', 'Invocação da Medalha Milagrosa', TRADITIONAL.invocacao)}
    ${section('ORAÇÃO FINAL', 'Magnificat — Cântico de Maria (Lc 1,46–55)', TRADITIONAL.magnificat)}
    ${section('CONCLUSÃO', 'Sinal da Cruz', TRADITIONAL.sinal)}
    <p class="editorial">As reflexões, intenções e orações próprias deste site são textos originais. Os trechos bíblicos destacados são traduções auxiliares próprias; as referências permitem consultar a passagem completa na Bíblia de sua escolha. A formulação do Magnificat acima é uma paráfrase devocional, não uma transcrição de edição bíblica específica.</p>`;
  $('#completed').checked = done.has(selectedDay);
  $('#nextDay').disabled = selectedDay === 9;
  $('#nextDay').textContent = selectedDay === 9 ? 'Último dia da novena' : 'Próximo dia →';
  $('#prayerBody').style.fontSize = `${fontSize}px`;
  renderDays(); updateProgress();
  if (scroll) $('#oracao').scrollIntoView({behavior:'smooth',block:'start'});
}
function renderDays() {
  $('#daysGrid').innerHTML = NOVENA.map((d,i) => {const n=i+1; return `<button class="day-card ${selectedDay===n?'active':''} ${done.has(n)?'finished':''}" data-day="${n}" aria-label="Abrir ${n}º dia: ${escapeHTML(d.titulo)}"><span class="day-number">${String(n).padStart(2,'0')}</span><span class="day-details"><small>${17+n} NOV</small><strong>${escapeHTML(d.titulo)}</strong></span><span class="day-state">${done.has(n)?'✓':'→'}</span></button>`}).join('');
  document.querySelectorAll('.day-card').forEach(btn=>btn.addEventListener('click',()=>selectDay(Number(btn.dataset.day),true)));
}
function updateProgress(){ $('#progressText').textContent = `${done.size} de 9 dias concluídos neste navegador.`; }
$('#completed').addEventListener('change', e => {if(e.target.checked)done.add(selectedDay);else done.delete(selectedDay);localStorage.setItem('novena-gracas-completed',JSON.stringify([...done]));renderDays();updateProgress();});
$('#todayButton').addEventListener('click',()=>selectDay(currentDay || 1,true));
$('#nextDay').addEventListener('click',()=>{if(selectedDay<9)selectDay(selectedDay+1,true)});
$('#largerFont').addEventListener('click',()=>{fontSize=Math.min(30,fontSize+2);$('#prayerBody').style.fontSize=`${fontSize}px`;localStorage.setItem('novena-gracas-font-size',fontSize)});
$('#smallerFont').addEventListener('click',()=>{fontSize=Math.max(16,fontSize-2);$('#prayerBody').style.fontSize=`${fontSize}px`;localStorage.setItem('novena-gracas-font-size',fontSize)});
$('#shareDay').addEventListener('click',()=>{const d=NOVENA[selectedDay-1];const msg=`🙏 ${selectedDay}º dia da Novena de Nossa Senhora das Graças — ${d.titulo}\nReze comigo: ${dayLink(selectedDay)}`;window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`,'_blank','noopener,noreferrer')});
// Mural público: Supabase quando configurado; modo de demonstração local quando não estiver.
const MURAL_DEMO_KEY = 'novena-gracas-mural-demonstracao';
const isMuralLive = Boolean(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey);
if (!isMuralLive) document.querySelector('#requestForm button[type="submit"]').textContent = 'Testar pedido nesta prévia →';
const muralHeaders = () => ({'apikey': CONFIG.supabaseAnonKey, 'Authorization': `Bearer ${CONFIG.supabaseAnonKey}`, 'Content-Type':'application/json'});
const demoSeed = [
 {id:'exemplo-1',nome:'Uma devota de Maria',pedido:'Pelas famílias que estão enfrentando dificuldades. Que Nossa Senhora das Graças fortaleça a fé, a união e a esperança.',created_at:'2026-11-16T12:00:00Z',example:true},
 {id:'exemplo-2',nome:'Um coração agradecido',pedido:'Em ação de graças por todas as bênçãos recebidas. Que saibamos reconhecer a presença de Deus em nossa vida.',created_at:'2026-11-16T11:00:00Z',example:true}
];
const localPosts = () => {try { return JSON.parse(localStorage.getItem(MURAL_DEMO_KEY) || '[]'); } catch {return []}};
function renderMural(posts){
  $('#muralPosts').innerHTML = posts.length ? posts.map(post=>`<article class="mural-post"><div class="mural-post-top"><span class="mural-avatar">✧</span><div><strong>${escapeHTML(post.nome || 'Anônimo')}</strong><small>${new Date(post.created_at).toLocaleDateString('pt-BR',{day:'2-digit',month:'short',year:'numeric'})}${post.example?' · Exemplo':''}</small></div></div><p>${escapeHTML(post.pedido)}</p><div class="mural-post-end">🙏 Rezemos por esta intenção</div></article>`).join('') : '<p class="mural-empty">Ainda não há pedidos publicados. Seja a primeira pessoa a compartilhar uma intenção.</p>';
}
async function loadMural(){
  if (!isMuralLive) {$('#muralStatus').textContent='Prévia demonstrativa: os pedidos feitos aqui ficam apenas neste navegador. O mural compartilhado será ativado após a configuração do banco de dados.'; renderMural([...localPosts(),...demoSeed]);return;}
  $('#muralStatus').textContent='Carregando intenções...';
  try {
    const response = await fetch(`${CONFIG.supabaseUrl.replace(/\/$/,'')}/rest/v1/pedidos_oracao?select=id,nome,pedido,created_at&order=created_at.desc&limit=40`,{headers:muralHeaders()});
    if (!response.ok) throw new Error('Não foi possível carregar o mural.');
    const posts=await response.json(); renderMural(posts);$('#muralStatus').textContent=posts.length?'Pedidos compartilhados com a comunidade de oração.':'Participe desta corrente de oração.';
  }catch(error){ $('#muralStatus').textContent='O mural está temporariamente indisponível. Tente novamente mais tarde.';renderMural([]);}
}
$('#requestForm').addEventListener('submit', async e => {
  e.preventDefault();
  const form=e.currentTarget;const f=new FormData(form);
  const nome=String(f.get('nome') || '').trim().slice(0,60) || 'Anônimo';
  const pedido=String(f.get('pedido') || '').trim().slice(0,700);
  if(f.get('website')) return;
  if(pedido.length<10 || !f.get('consentimento')) {$('#requestStatus').textContent='Escreva uma intenção com pelo menos 10 caracteres e confirme que ela será pública.';return;}
  const btn=form.querySelector('button[type="submit"]');btn.disabled=true;
  try {
    if (isMuralLive){
      const response=await fetch(`${CONFIG.supabaseUrl.replace(/\/$/,'')}/rest/v1/pedidos_oracao`,{method:'POST',headers:{...muralHeaders(),'Prefer':'return=minimal'},body:JSON.stringify({nome,pedido,consentiu_publicacao:true})});
      if(!response.ok) throw new Error('Falha ao publicar o pedido.');
      $('#requestStatus').textContent='Pedido enviado com sucesso! Ele aparecerá no mural após a aprovação da equipe de moderação. Que Nossa Senhora interceda por você!';
    } else {
      const post={id:`local-${Date.now()}`,nome,pedido,created_at:new Date().toISOString()};
      localStorage.setItem(MURAL_DEMO_KEY,JSON.stringify([post,...localPosts()].slice(0,40)));
      $('#requestStatus').textContent='Pedido adicionado à prévia neste navegador. Ele ainda não está visível para outras pessoas.';
    }
    form.reset();await loadMural();
  }catch(error){$('#requestStatus').textContent='Não foi possível publicar agora. Verifique a conexão e tente novamente.'}
  finally{btn.disabled=false;}
});
selectDay(selectedDay, Boolean(new URLSearchParams(location.search).get('dia')));
loadMural();
