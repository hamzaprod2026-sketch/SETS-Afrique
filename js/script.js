/* SETS AFRIQUE — Native JavaScript interactions */
(() => {
  const headerMount = document.getElementById("site-header");
  const footerMount = document.getElementById("site-footer");
  const page = document.body.dataset.page || "";

  const navItems = [
    ["Accueil", "index.html", "home"],
    ["Qui sommes-nous ?", "about.html", "about"],
    ["Services", "services.html", "services"],
    ["Flotte", "fleet.html", "fleet"],
    ["Contact", "contact.html", "contact"]
  ];

  if (headerMount) {
    headerMount.innerHTML = `
      <a class="skip-link" href="#main">Aller au contenu</a>
      <header class="site-header" id="siteHeader">
        <div class="container header-inner">
          <a class="brand" href="index.html" aria-label="SETS AFRIQUE, accueil">
            <span class="brand-mark">SA</span>
            <span class="brand-name">SETS AFRIQUE<small>TRANSPORT & LOGISTIQUE</small></span>
          </a>
          <nav class="main-nav" id="mainNav" aria-label="Navigation principale">
            ${navItems.map(([label, href, key]) => `<a href="${href}" class="${page === key ? "active" : ""}" ${page === key ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
          </nav>
          <a class="btn btn--orange header-cta" href="contact.html">Demander un devis <span>↗</span></a>
          <button class="menu-toggle" id="menuToggle" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mainNav"><span></span><span></span></button>
        </div>
      </header>`;
  }

  if (footerMount) {
    footerMount.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <a class="brand" href="index.html"><span class="brand-mark">SA</span><span class="brand-name">SETS AFRIQUE<small>TRANSPORT & LOGISTIQUE</small></span></a>
              <p>Solutions de transport routier national et international de marchandises, au départ du Maroc vers l'Afrique et l'Europe.</p>
              <a class="text-link" href="about.html" style="color:#fff;border-color:rgba(255,255,255,.2)">Découvrir l'entreprise <span>→</span></a>
            </div>
            <div class="footer-col"><h4>Navigation</h4><a href="index.html">Accueil</a><a href="about.html">Qui sommes-nous ?</a><a href="services.html">Nos services</a><a href="fleet.html">Flotte & équipements</a><a href="contact.html">Contact</a></div>
            <div class="footer-col"><h4>Nos services</h4><a href="services.html#frigorifique">Transport frigorifique</a><a href="services.html#groupage">Groupage & complet</a><a href="services.html#speciaux">Transports spéciaux</a><a href="services.html#plateau">Transport plateau</a><a href="services.html#logistique">Logistique</a></div>
            <div class="footer-col"><h4>Nous contacter</h4><p>Aït Melloul, Agadir, Maroc</p><a href="tel:+212661387977">+212 661 38 79 77</a><a href="mailto:sets.transport@gmail.com">sets.transport@gmail.com</a><p>IF : 76147750<br>RC : 10041</p></div>
          </div>
          <div class="footer-bottom"><span>© <span id="currentYear"></span> SETS AFRIQUE. Tous droits réservés.</span><span>Transport routier · Logistique · International</span></div>
        </div>
      </footer>`;
  }

  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Ouvrir le menu");
    }));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 35);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const year = document.getElementById("currentYear");
  if (year) year.textContent = new Date().getFullYear();

  // Progressive reveal; content remains visible if IntersectionObserver is unavailable.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-visible"));
  }

  // Contact form: validates in the browser and prepares a mailto message.
  const form = document.getElementById("quote-form");
  const feedback = document.getElementById("form-feedback");
  if (form && feedback) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      feedback.classList.remove("is-error", "is-success");

      if (!form.checkValidity()) {
        form.reportValidity();
        feedback.textContent = "Veuillez vérifier les champs obligatoires et votre adresse email.";
        feedback.classList.add("is-error");
        return;
      }

      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const phone = String(data.get("phone") || "").trim();
      const subject = String(data.get("subject") || "").trim();
      const message = String(data.get("message") || "").trim();

      const body = [
        "Bonjour SETS AFRIQUE,",
        "",
        "Je souhaite obtenir des informations / un devis.",
        "",
        `Nom : ${name}`,
        `Email : ${email}`,
        `Téléphone : ${phone || "Non renseigné"}`,
        `Type de demande : ${subject}`,
        "",
        "Message :",
        message
      ].join("\n");

      const mailto = `mailto:sets.transport@gmail.com?subject=${encodeURIComponent("Demande de devis - " + subject)}&body=${encodeURIComponent(body)}`;
      feedback.textContent = "Votre demande est prête. Votre application de messagerie va s'ouvrir pour finaliser l'envoi.";
      feedback.classList.add("is-success");
      window.location.href = mailto;
    });
  }

  // Make the skip link target valid across all pages.
  const main = document.querySelector("main");
  if (main && !main.id) main.id = "main";
})();
