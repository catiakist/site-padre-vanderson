(function(){
  var V = window.NOVENA_VIDEOS || {};
  var el = document.getElementById('galeria-novena');
  if(!el) return;
  var datas = {1:'18/11',2:'19/11',3:'20/11',4:'21/11',5:'22/11',6:'23/11',7:'24/11',8:'25/11',9:'26/11'};
  function norm(u){ u = String(u||'').trim(); if(u && !/^https?:\/\//i.test(u)) u = 'https://' + u; return u; }
  function ytid(u){ var m = u.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/); return m ? m[1] : ''; }
  var cards = [];
  for(var d=1; d<=9; d++){
    var u = norm(V[d]); if(!u) continue;
    var id = ytid(u);
    var media = id
      ? '<div style="position:relative;aspect-ratio:16/9;background:#000;overflow:hidden"><img src="https://img.youtube.com/vi/'+id+'/hqdefault.jpg" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"><span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><span style="width:52px;height:52px;border-radius:50%;background:rgba(179,146,76,.95);display:flex;align-items:center;justify-content:center;color:#20180a;font-size:20px;padding-left:3px">&#9654;</span></span></div>'
      : '<div style="aspect-ratio:16/9;background:#20180a;display:flex;align-items:center;justify-content:center;color:#b3924c;font-size:30px">&#9654;</div>';
    cards.push('<a href="'+u+'" target="_blank" rel="noopener" style="display:block;background:#fff;border:1px solid rgba(179,146,76,.35);border-radius:12px;overflow:hidden;text-decoration:none;box-shadow:0 6px 16px rgba(0,0,0,.08)">'+media+'<div style="padding:12px 14px"><strong style="display:block;color:#3a2d14;font-size:1.05rem;font-family:\'Cormorant Garamond\',Georgia,serif">'+d+'º dia</strong><span style="color:#8a7a52;font-size:.9rem">'+datas[d]+' &middot; Assistir &#8599;</span></div></a>');
  }
  var wrap = el.closest('[data-galeria-wrap]');
  if(!cards.length){ el.innerHTML = ''; if(wrap) wrap.setAttribute('hidden',''); return; }
  el.innerHTML = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:16px;text-align:left">' + cards.join('') + '</div>';
  if(wrap) wrap.removeAttribute('hidden');
})();
