/* Faz o preview do painel mostrar o artigo com a cara real do site */
(function () {
  if (typeof CMS === 'undefined') return;

  // Fontes e CSS reais do site, aplicados dentro do preview
  CMS.registerPreviewStyle('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Mulish:wght@400;500;600;700;800&display=swap');
  CMS.registerPreviewStyle('/styles.css');
  // Pequenos ajustes só para o quadro do preview
  CMS.registerPreviewStyle('/admin/preview.css');

  var h = window.h;

  function ArtigoPreview(props) {
    var e = props.entry;
    var tag = e.getIn(['data', 'tag']) || 'Artigo';
    var title = e.getIn(['data', 'title']) || 'Título do artigo';
    var imgPath = e.getIn(['data', 'image']);
    var img = imgPath ? props.getAsset(imgPath) : null;

    return h('div', { className: 'preview-page' },
      h('article', { className: 'preview-artigo' },
        h('p', { className: 'eyebrow' }, tag),
        h('h1', { className: 'artigo__title' }, title),
        img ? h('div', { className: 'artigo__cover' }, h('img', { src: img.toString(), alt: '' })) : null,
        h('div', { className: 'artigo__body' }, props.widgetFor('body'))
      )
    );
  }

  CMS.registerPreviewTemplate('artigos', ArtigoPreview);
})();
