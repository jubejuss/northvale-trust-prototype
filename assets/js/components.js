/* ==========================================================================
   Shared layout components – single source of truth for navbar + footer.
   Injected client-side so every page stays in sync. When ported to
   WordPress these become header.php / footer.php (or block template parts).

   Each page sets <body data-page="home|about|faq|news|contact"> to drive the
   active nav state. Pure JS injection (no fetch) so it also works over file://.
   ========================================================================== */
(function () {
  "use strict";

  var NAV_ITEMS = [
    { key: "home", label: "Home", href: "index.html" },
    { key: "about", label: "About us", href: "about.html" },
    { key: "faq", label: "FAQ", href: "faq.html" },
    { key: "news", label: "News", href: "news.html" },
    { key: "contact", label: "Contact", href: "contact.html" }
  ];

  var current = document.body.getAttribute("data-page");
  if (current === null) { current = "home"; }

  function navLinks() {
    return NAV_ITEMS.map(function (item) {
      var active = item.key === current ? ' aria-current="page"' : "";
      return '<a href="' + item.href + '"' + active + ">" + item.label + "</a>";
    }).join("");
  }

  function renderNavbar() {
    return (
      '<div class="navbar__inner">' +
        '<a class="navbar__logo" href="index.html">' +
          '<span class="navbar__mark" aria-hidden="true">N</span>' +
          '<span class="navbar__brand">The Northvale Trust</span>' +
        "</a>" +
        '<button class="navbar__toggle" type="button" aria-label="Toggle menu" aria-expanded="false" aria-controls="primary-nav">' +
          "<span></span><span></span><span></span>" +
        "</button>" +
        '<nav id="primary-nav" class="navbar__links" aria-label="Primary">' +
          navLinks() +
        "</nav>" +
      "</div>"
    );
  }

  function renderFooter() {
    return (
      '<div class="container">' +
        '<div class="footer__grid">' +
          '<div class="footer__col">' +
            '<div class="footer__brand"><span class="navbar__mark" aria-hidden="true">N</span> The Northvale Trust</div>' +
            "<ul>" +
              "<li><p>Northvale House</p></li>" +
              "<li><p>40 Charterhouse Street</p></li>" +
              "<li><p>London EC1M 6JN</p></li>" +
            "</ul>" +
          "</div>" +
          '<div class="footer__col">' +
            "<h4>Contact</h4>" +
            "<ul>" +
              '<li><a href="mailto:grants@northvale.org">grants@northvale.org</a></li>' +
              '<li><a href="tel:+442079460321">+44 (0) 20 7946 0321</a></li>' +
            "</ul>" +
          "</div>" +
          '<div class="footer__col">' +
            "<h4>Explore</h4>" +
            "<ul>" +
              '<li><a href="about.html">About us</a></li>' +
              '<li><a href="faq.html">FAQ</a></li>' +
              '<li><a href="news.html">News</a></li>' +
              '<li><a href="#">Grants data</a></li>' +
            "</ul>" +
          "</div>" +
          '<div class="footer__col">' +
            "<h4>Legal</h4>" +
            "<ul>" +
              '<li><a href="#">Cookies</a></li>' +
              '<li><a href="#">Privacy Policy</a></li>' +
              '<li><a href="#">Terms of use</a></li>' +
            "</ul>" +
          "</div>" +
        "</div>" +
        '<div class="footer__bottom">' +
          "Company limited by guarantee No. 8421006. Charity registered in England and Wales No. 1199240." +
        "</div>" +
      "</div>"
    );
  }

  var header = document.getElementById("site-header");
  var footer = document.getElementById("site-footer");
  if (header) { header.className = "navbar"; header.innerHTML = renderNavbar(); }
  if (footer) { footer.className = "footer"; footer.innerHTML = renderFooter(); }

  /* Mobile menu toggle */
  var toggle = document.querySelector(".navbar__toggle");
  var links = document.getElementById("primary-nav");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }
})();
