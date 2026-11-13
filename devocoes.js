window.renderDevocao = function(slug){
  var el = document.getElementById('devocao'); if(!el) return;
  var d = (window.DEVOCOES||{})[slug];
  if(!d){ el.innerHTML = '<p class="lead">Conte&uacute;do em breve.</p>'; return; }
  document.title = d.titulo + ' · Padre Vanderson';
  var corpo = (d.html && d.html.trim())
    ? d.html
    : '<p class="lead">Esta devo&ccedil;&atilde;o estar&aacute; dispon&iacute;vel em breve. Volte logo. 🙏</p>';
  el.innerHTML = '<p class="eyebrow">Devo&ccedil;&atilde;o</p>'
    + '<h1 class="artigo__title">' + d.titulo + '</h1>'
    + '<div class="artigo__body">' + corpo + '</div>';
};
