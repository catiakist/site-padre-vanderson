(function(){
  var ARROW='<svg class="arrow" width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function esc(s){var d=document.createElement('div');d.textContent=(s==null?'':s);return d.innerHTML;}
  function card(a){
    return '<a class="article-card" href="artigo.html?slug='+encodeURIComponent(a.slug)+'">'
      + '<div class="article-card__img"><img src="'+esc(a.image)+'" alt="'+esc(a.title)+'" loading="lazy"></div>'
      + '<div class="article-card__body">'
      + '<span class="article-card__tag">Artigo &middot; '+esc(a.tag)+'</span>'
      + '<h3>'+esc(a.title)+'</h3>'
      + '<p>'+esc(a.excerpt)+'</p>'
      + '<span class="textlink">Ler o artigo '+ARROW+'</span>'
      + '</div></a>';
  }
  var list = (window.ARTIGOS||[]);
  var home=document.getElementById('artigos-home');
  if(home){ home.innerHTML = list.slice(0,3).map(card).join('') || '<p class="lead">Em breve, novos textos de forma&ccedil;&atilde;o.</p>'; }
  var all=document.getElementById('artigos-lista');
  if(all){ all.innerHTML = list.map(card).join('') || '<p class="lead">Em breve, novos textos.</p>'; }
  var reader=document.getElementById('artigo-conteudo');
  if(reader){
    var slug=new URLSearchParams(location.search).get('slug');
    var a=list.filter(function(x){return x.slug===slug;})[0];
    if(!a){ reader.innerHTML='<p class="lead">Artigo n&atilde;o encontrado. <a class="textlink" href="artigos.html">Ver todos os artigos</a>.</p>'; return; }
    document.title = a.title + ' · Padre Vanderson';
    var img = a.image ? '<div class="artigo__cover"><img src="'+esc(a.image)+'" alt="'+esc(a.title)+'"></div>' : '';
    reader.innerHTML =
        '<p class="eyebrow">'+esc(a.tag)+' &middot; '+esc(a.dateBR)+' &middot; '+a.readingMin+' min de leitura</p>'
      + '<h1 class="artigo__title">'+esc(a.title)+'</h1>'
      + img
      + '<div class="artigo__body">'+a.html+'</div>'
      + '<p class="artigo__back"><a class="textlink" href="artigos.html">&larr; Ver todos os artigos</a></p>';
  }
})();
