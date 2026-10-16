/* FHI Ingeniería — main.js */
(function () {
  "use strict";

  /* ---------- Page loader (logo) ---------- */
  const loader = document.querySelector("#page-loader");
  if (loader) {
    document.documentElement.classList.add("is-loading");
    const MIN_MS = 700;
    const started = performance.now();
    const hide = () => {
      const wait = Math.max(0, MIN_MS - (performance.now() - started));
      window.setTimeout(() => {
        loader.classList.add("is-done");
        document.documentElement.classList.remove("is-loading");
        loader.setAttribute("aria-busy", "false");
        window.setTimeout(() => loader.remove(), 600);
      }, wait);
    };
    if (document.readyState === "complete") hide();
    else window.addEventListener("load", hide, { once: true });
  }

  /* ---------- Header scroll ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Solid header on legal pages or when no hero */
  if (header && (header.dataset.solid === "true" || !document.querySelector(".hero"))) {
    header.classList.add("is-solid");
  }

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    mobileNav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        mobileNav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      const loc = document.documentElement.lang === "en" ? "en-US" : "es-CL";
      el.textContent =
        prefix +
        (decimals ? val.toFixed(decimals) : Math.floor(val).toLocaleString(loc)) +
        suffix;
      if (p < 1) requestAnimationFrame(step);
      else
        el.textContent =
          prefix +
          (decimals ? target.toFixed(decimals) : Math.floor(target).toLocaleString(loc)) +
          suffix;
    };
    requestAnimationFrame(step);
  };

  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach((c) => {
      const prefix = c.dataset.prefix || "";
      const suffix = c.dataset.suffix || "";
      c.textContent = prefix + c.dataset.count + suffix;
    });
  }

  /* ---------- Project filters ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card[data-category]");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const cat = btn.dataset.filter;
      projectCards.forEach((card) => {
        const match = cat === "all" || card.dataset.category === cat;
        card.classList.toggle("is-hidden", !match);
      });
    });
  });

  /* ---------- Map pins / legend ---------- */
  const pins = document.querySelectorAll(".map-pin");
  const legendItems = document.querySelectorAll(".map-legend__item");
  const activatePin = (id) => {
    pins.forEach((p) => p.classList.toggle("is-active", p.dataset.pin === id));
    legendItems.forEach((l) =>
      l.classList.toggle("is-active", l.dataset.pin === id)
    );
  };
  pins.forEach((p) =>
    p.addEventListener("click", () => activatePin(p.dataset.pin))
  );
  legendItems.forEach((l) =>
    l.addEventListener("click", () => activatePin(l.dataset.pin))
  );

  /* ---------- Contact form validation (Formspree) ---------- */
  const form = document.querySelector("#contact-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach((field) => {
        const group = field.closest(".form-group");
        const ok = field.value.trim() !== "";
        if (field.type === "email") {
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!re.test(field.value.trim())) {
            group && group.classList.add("is-error");
            valid = false;
            return;
          }
        }
        if (group) group.classList.toggle("is-error", !ok);
        if (!ok) valid = false;
      });
      if (!valid) return;

      const btn = form.querySelector('[type="submit"]');
      const original = btn ? btn.textContent : "";
      if (btn) {
        btn.disabled = true;
        btn.textContent = form.dataset.sending || "Enviando…";
      }

      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          const success = document.querySelector(".form-success");
          if (success) success.classList.add("is-visible");
          form.reset();
        } else {
          alert(form.dataset.error || "Error al enviar. Intente nuevamente.");
        }
      } catch (err) {
        alert(form.dataset.error || "Error de conexión. Intente nuevamente.");
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.textContent = original;
        }
      }
    });

    form.querySelectorAll("input, textarea, select").forEach((field) => {
      field.addEventListener("input", () => {
        const group = field.closest(".form-group");
        if (group) group.classList.remove("is-error");
      });
    });
  }

  /* ---------- Cookie banner ---------- */
  const cookie = document.querySelector(".cookie-banner");
  if (cookie && !localStorage.getItem("fhi_cookies")) {
    setTimeout(() => cookie.classList.add("is-visible"), 800);
  }
  document.querySelectorAll("[data-cookie-accept]").forEach((btn) => {
    btn.addEventListener("click", () => {
      localStorage.setItem("fhi_cookies", "all");
      if (cookie) cookie.classList.remove("is-visible");
    });
  });
  document.querySelectorAll("[data-cookie-reject]").forEach((btn) => {
    btn.addEventListener("click", () => {
      localStorage.setItem("fhi_cookies", "necessary");
      if (cookie) cookie.classList.remove("is-visible");
    });
  });
  document.querySelectorAll("[data-cookie-reset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      localStorage.removeItem("fhi_cookies");
      if (cookie) cookie.classList.add("is-visible");
      else window.location.reload();
    });
  });

  /* ---------- Client portal login (UI / placeholder auth) ---------- */
  const portalForm = document.querySelector("#portal-form");
  if (portalForm) {
    portalForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = portalForm.querySelector("#portal-email");
      const pass = portalForm.querySelector("#portal-pass");
      const msg = document.querySelector("#portal-msg");
      let ok = true;
      [email, pass].forEach((field) => {
        const group = field.closest(".form-group");
        const valid =
          field.type === "email"
            ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())
            : field.value.trim() !== "";
        if (group) group.classList.toggle("is-error", !valid);
        if (!valid) ok = false;
      });
      if (!ok || !msg) return;
      const lang = document.documentElement.lang === "en" ? "en" : "es";
      msg.hidden = false;
      msg.classList.add("is-error");
      msg.textContent =
        lang === "en"
          ? "We could not validate these credentials. Please confirm your email and password with your FHI project lead, or write to portal@fhi.cl."
          : "No fue posible validar estas credenciales. Confirme su email y contraseña con su jefe de proyecto FHI, o escriba a portal@fhi.cl.";
    });
  }

  /* ---------- Download modal ---------- */
  const modal = document.querySelector("#download-modal");
  document.querySelectorAll("[data-download]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!modal) return;
      const title = btn.dataset.downloadTitle || "";
      const titleEl = modal.querySelector("[data-modal-title]");
      if (titleEl) titleEl.textContent = title;
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    });
  });
  if (modal) {
    modal.querySelectorAll("[data-modal-close]").forEach((el) => {
      el.addEventListener("click", () => {
        modal.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Current year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Layered hero parallax (logo between layers) ---------- */
  const layeredHero = document.querySelector("[data-hero-layered]");
  if (layeredHero && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const onHeroScroll = () => {
      const rect = layeredHero.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const progress = Math.min(1, Math.max(0, 1 - rect.bottom / (view + rect.height)));
      layeredHero.style.setProperty("--hero-logo-y", `${progress * 36}px`);
      layeredHero.style.setProperty("--hero-fg-y", `${progress * 18}px`);
    };
    window.addEventListener("scroll", onHeroScroll, { passive: true });
    onHeroScroll();
  }
})();
