(function(){
  var V = window.NOVENA_VIDEOS || {};
  var el = document.getElementById('video-dia');
  if(!el) return;
  var now = new Date();
  var hoje = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  var inicio = new Date(2026,10,18); // 18/11/2026 = 1º dia
  var diff = Math.round((hoje - inicio)/86400000);
  var dia = (diff>=0 && diff<=8) ? diff+1 : null;
  var url = dia ? (V[dia]||'').trim() : '';
  var wrap = el.closest('[data-video-wrap]');
  if(dia && url){
    el.innerHTML = '<a href="'+url+'" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:10px;background:#b3924c;color:#20180a;font-weight:700;padding:14px 26px;border-radius:10px;text-decoration:none;font-size:1.05rem;box-shadow:0 8px 22px rgba(0,0,0,.18)">&#9654;&nbsp; Assistir ao vídeo do '+dia+'º dia</a>';
    if(wrap) wrap.removeAttribute('hidden');
  } else {
    el.innerHTML = '';
    if(wrap) wrap.setAttribute('hidden','');
  }
})();
