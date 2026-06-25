(function () {

  var depth = window.location.pathname.split('/').filter(Boolean).length;
  var prefix = '';
  for (var i = 0; i < depth; i++) prefix += '../';
  var JSON_URL = prefix + 'assets/projects.json';
  var IMAGE_BASE = null;

  // ── To migrate to R2, replace the 3 lines above with: ──
  var JSON_URL = "https://pub-1612ce92f47846d6a9d03b13c28efc2a.r2.dev/projects.json";
  var IMAGE_BASE = "https://pub-1612ce92f47846d6a9d03b13c28efc2a.r2.dev/mages/";

  function detectLang() {
    return window.location.pathname.indexOf('/en') !== -1 ? 'en' : 'el';
  }

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function imageUrl(filename) {
    if (IMAGE_BASE) return IMAGE_BASE + filename;
    return prefix + 'assets/images/' + filename;
  }

  function projectLink(slug, lang) {
  var path = window.location.pathname;

  // Homepage: el.html or en.html
  if (path.match(/\/(el|en)\.html$/) || path.match(/\/$/)) {
    return lang + '/projects/project.html?project=' + slug;
  }

  // List page: el/projects.html or en/projects.html
  if (path.match(/\/projects\.html$/)) {
    return 'projects/project.html?project=' + slug;
  }

  // Already on a detail page (shouldn't link to another but just in case)
  return 'project.html?project=' + slug;
}

  function buildCard(p, lang, href) {
    var title = p[lang] || p.el;
    var card = document.createElement('div');
    card.className = 'project';
    card.innerHTML =
      '<a href="' + href + '">' +
        '<div class="img-wrap">' +
          '<img src="' + imageUrl(p.image) + '" alt="' + title + '" loading="lazy" />' +
        '</div>' +
        '<p>' + title + '</p>' +
      '</a>';
    return card;
  }

  function renderGrid(container, projects, lang) {
    var grid = document.createElement('div');
    grid.className = 'projects-list';
    projects.forEach(function (p) {
      grid.appendChild(buildCard(p, lang, projectLink(p.slug, lang)));
    });
    container.innerHTML = '';
    container.appendChild(grid);
  }

  function setMeta(attrName, attrValue, content) {
    var el = document.querySelector('meta[' + attrName + '="' + attrValue + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attrName, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  function renderDetail(projects, lang) {
    var detailEl = document.getElementById('projectDetail');
    if (!detailEl) return;

    var slug = getParam('project');
    if (!slug) {
      detailEl.innerHTML = '<p style="text-align:center;padding:2rem;">Project not found.</p>';
      return;
    }

    var p = null;
    for (var i = 0; i < projects.length; i++) {
      if (projects[i].slug === slug) { p = projects[i]; break; }
    }
    if (!p) {
      detailEl.innerHTML = '<p style="text-align:center;padding:2rem;">Project not found.</p>';
      return;
    }

    var title       = p[lang] || p.el;
    var description = p['description_' + lang] || p['description_el'] || '';
    var externalUrl = p['url'] || '';
    var pageUrl     = window.location.href;
    var imgUrl      = imageUrl(p.image);

    document.title = title + ' | Σπύρογλου ΗΛΜΕ — Ηλεκτρόλογος Πάρος';

    setMeta('name',     'description',       title + ' — Ηλεκτρολογικές εγκαταστάσεις Σπύρογλου ΗΛΜΕ, Πάρος');
    setMeta('property', 'og:title',          title + ' | Σπύρογλου ΗΛΜΕ');
    setMeta('property', 'og:description',    title + ' — Ηλεκτρολογικές εγκαταστάσεις Σπύρογλου ΗΛΜΕ, Πάρος');
    setMeta('property', 'og:image',          imgUrl);
    setMeta('property', 'og:url',            pageUrl);
    setMeta('name',     'twitter:title',     title + ' | Σπύρογλου ΗΛΜΕ');
    setMeta('name',     'twitter:description', title + ' — Ηλεκτρολογικές εγκαταστάσεις Σπύρογλου ΗΛΜΕ, Πάρος');
    setMeta('name',     'twitter:image',     imgUrl);

    var langEn = document.getElementById('lang-en');
    var langEl = document.getElementById('lang-el');
    if (langEn) langEn.href = '../../en/projects/project.html?project=' + slug;
    if (langEl) langEl.href = '../../el/projects/project.html?project=' + slug;

    var descHtml = description
      ? '<p class="project-description">' + description + '</p>'
      : '';

    var linkHtml = externalUrl
      ? '<a class="project-link" href="' + externalUrl + '" target="_blank" rel="noopener">Visit Project ↗</a>'
      : '';

    detailEl.innerHTML =
      '<div class="projectt-container">' +
      '<div class="image-wrapper">' +
        '<img src="' + imgUrl + '" alt="' + title + '" />' +
      '</div>' +
      '<div class="social-buttons">' +
        '<a class="social-share facebook" href="https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(pageUrl) + '" target="_blank" rel="noopener">' +
          '<svg viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>' +
          
          '</a>' +
          '<a class="social-share twitter" href="https://twitter.com/intent/tweet?url=' + encodeURIComponent(pageUrl) + '&text=' + encodeURIComponent(title) + '" target="_blank" rel="noopener">' +
            '<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' +
            
          '</a>' +
          '<a class="social-share whatsapp" href="https://wa.me/?text=' + encodeURIComponent(title + ' ' + pageUrl) + '" target="_blank" rel="noopener">' +
            '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>' +
            
          '</a>' +
        '</div>' +
        '<br>' +
        '<h1>' + title + '</h1>' +
        descHtml +
        linkHtml +
      '</div>';
  }

  function run(projects) {
    var lang = detectLang();

    var homeEl = document.getElementById('projectsHome');
    if (homeEl) {
      var featured = projects.filter(function (p) { return p.homepage; });
      renderGrid(homeEl, featured, lang);
    }

    var listEl = document.getElementById('projectList');
    if (listEl) {
      renderGrid(listEl, projects, lang);
    }

    renderDetail(projects, lang);
  }

  fetch(JSON_URL)
    .then(function (r) { return r.json(); })
    .then(run)
    .catch(function (e) { console.error('projects.js: could not load projects.json', e); });

})();