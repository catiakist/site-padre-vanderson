/* Padre Vanderson — interações do site (compartilhado entre páginas) */
(function () {
  "use strict";

  /* ---- cabeçalho: sombra ao rolar ---- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- menu móvel ---- */
  const menu = document.getElementById("mobileMenu");
  const openBtn = document.querySelector("[data-menu-open]");
  const setMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", String(!open));
    if (openBtn) openBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (openBtn) openBtn.addEventListener("click", () => setMenu(true));
  document.querySelectorAll("[data-menu-close]").forEach((el) =>
    el.addEventListener("click", () => setMenu(false))
  );

  /* ---- revelação ao rolar ---- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach((el) => {
      const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
      const i = siblings.indexOf(el);
      if (i > 0) el.style.transitionDelay = Math.min(i, 4) * 70 + "ms";
      io.observe(el);
    });
  }

  const GAL =
    window.GALERIA && Array.isArray(window.GALERIA.categories) ? window.GALERIA.categories : null;
  const withCat = (c) => c.photos.map((p) => ({ t: p.t, full: p.full, cat: c.label }));

  /* ---- home: capas de álbum ---- */
  const albumsBox = document.getElementById("galleryAlbums");
  if (albumsBox && GAL) {
    const frag = document.createDocumentFragment();
    GAL.forEach((c) => {
      if (!c.photos.length) return;
      const a = document.createElement("a");
      a.className = "album";
      a.href = "galeria.html?cat=" + encodeURIComponent(c.slug);
      const img = document.createElement("img");
      img.src = c.cover || c.photos[0].full;
      img.alt = c.label;
      img.loading = "lazy";
      img.decoding = "async";
      const scrim = document.createElement("span");
      scrim.className = "album__scrim";
      const cap = document.createElement("span");
      cap.className = "album__cap";
      cap.innerHTML =
        "<b>" + c.label + "</b><em>" + c.count + (c.count === 1 ? " foto ›" : " fotos ›") + "</em>";
      a.append(img, scrim, cap);
      frag.appendChild(a);
    });
    albumsBox.replaceChildren(frag);
  }

  /* ---- página da galeria: grade por categorias + lightbox ---- */
  const galleryGrid = document.getElementById("gallery");
  const filtersBox = document.getElementById("galleryFilters");
  const lb = document.getElementById("lightbox");
  if (galleryGrid && lb && GAL) {
    const cats = GAL;
    const all = cats.flatMap(withCat);

    let current = all;
    let lbIndex = 0;
    const lbImg = lb.querySelector("img");
    const lbCap = document.getElementById("lbCap");

    const renderGrid = (list) => {
      const frag = document.createDocumentFragment();
      list.forEach((p, idx) => {
        const btn = document.createElement("button");
        btn.className = "gallery__item";
        btn.type = "button";
        btn.setAttribute("aria-label", "Abrir foto — " + p.cat);
        const img = document.createElement("img");
        img.src = p.t;
        img.alt = p.cat;
        img.loading = "lazy";
        img.decoding = "async";
        btn.appendChild(img);
        btn.addEventListener("click", () => openLb(idx));
        frag.appendChild(btn);
      });
      galleryGrid.replaceChildren(frag);
    };

    const showLb = () => {
      const p = current[lbIndex];
      lbImg.src = p.full;
      lbImg.alt = p.cat;
      if (lbCap) lbCap.innerHTML = "<b>" + p.cat + "</b> · " + (lbIndex + 1) + " / " + current.length;
    };
    const openLb = (i) => {
      lbIndex = i;
      showLb();
      lb.classList.add("open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };
    const closeLb = () => {
      lb.classList.remove("open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lbImg.src = "";
    };
    const step = (d) => {
      lbIndex = (lbIndex + d + current.length) % current.length;
      showLb();
    };

    const setFilter = (list, btn) => {
      current = list;
      lbIndex = 0;
      renderGrid(list);
      filtersBox.querySelectorAll(".gallery__filter").forEach((x) => x.classList.remove("active"));
      btn.classList.add("active");
    };
    const addFilter = (label, list) => {
      const b = document.createElement("button");
      b.className = "gallery__filter";
      b.type = "button";
      b.textContent = label;
      b.addEventListener("click", () => setFilter(list, b));
      filtersBox.appendChild(b);
      return b;
    };

    if (filtersBox) {
      const urlCat = new URLSearchParams(location.search).get("cat");
      const todas = addFilter("Todas", all);
      let start = todas;
      let startList = all;
      cats.forEach((c) => {
        const list = withCat(c);
        const b = addFilter(c.label, list);
        if (urlCat && c.slug === urlCat) {
          start = b;
          startList = list;
        }
      });
      setFilter(startList, start);
    } else {
      renderGrid(all);
    }

    lb.addEventListener("click", (e) => {
      if (e.target === lb || e.target.closest("[data-lb-close]")) return closeLb();
      if (e.target.closest("[data-lb-prev]")) return step(-1);
      if (e.target.closest("[data-lb-next]")) return step(1);
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "ArrowRight") step(1);
    });

    // deslizar (swipe) para trocar de foto no celular
    let touchX = 0, touchY = 0;
    lb.addEventListener("touchstart", (e) => {
      const t = e.changedTouches[0];
      touchX = t.clientX; touchY = t.clientY;
    }, { passive: true });
    lb.addEventListener("touchend", (e) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchX, dy = t.clientY - touchY;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ---- fechar menu com Esc ---- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu && menu.classList.contains("open")) setMenu(false);
  });

  /* ---- formulário de pedido de oração (envio por e-mail) ---- */
  const form = document.getElementById("prayerForm");
  if (form) {
    const success = document.getElementById("prayerSuccess");
    const firstNameSpan = document.getElementById("successName");
    const errorBox = document.getElementById("formError");
    const submitBtn = form.querySelector('button[type="submit"]');

    const showError = (msg) => {
      if (!errorBox) return;
      errorBox.textContent = msg;
      errorBox.hidden = false;
      errorBox.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    };
    const hideError = () => {
      if (errorBox) errorBox.hidden = true;
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      hideError();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const endpoint = (window.SITE_CONFIG && window.SITE_CONFIG.formEndpoint) || "";
      if (!endpoint) {
        console.warn(
          "Pedido não enviado: falta configurar SITE_CONFIG.formEndpoint em config.js (link do Formspree)."
        );
        showError("O envio ainda não foi ativado. Tente novamente mais tarde.");
        return;
      }

      const nome = (new FormData(form).get("Nome") || "").toString().trim();
      const originalLabel = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.classList.add("is-loading");
      submitBtn.textContent = "Enviando…";

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        if (res.ok) {
          if (firstNameSpan) firstNameSpan.textContent = nome ? ", " + nome.split(/\s+/)[0] : "";
          form.hidden = true;
          if (success) {
            success.hidden = false;
            success.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
          }
        } else {
          showError("Não consegui enviar agora. Confira os campos e tente de novo.");
        }
      } catch (err) {
        showError("Sem conexão para enviar. Verifique a internet e tente de novo.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove("is-loading");
        submitBtn.innerHTML = originalLabel;
      }
    });

    const again = document.getElementById("sendAgain");
    if (again) {
      again.addEventListener("click", () => {
        form.reset();
        hideError();
        if (success) success.hidden = true;
        form.hidden = false;
        form.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      });
    }
  }
})();
