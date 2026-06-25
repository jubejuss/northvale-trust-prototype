/* ==========================================================================
   Page interactions: news rendering, FAQ accordion, contact form,
   eligibility quiz.
   ========================================================================== */
(function () {
  "use strict";

  /* --- Shared news data (single source; maps to a WP_Query later) --------- */
  var IMG = "assets/img/news.jpg";
  var NEWS = [
    { date: "20 Mar 2026", title: "February Grants List",     href: "news-article.html",
      excerpt: "We have been delighted to welcome our new Grants Manager, Rhea Patel, to the Trust. In this blog, Rhea reflects on her first months." },
    { date: "19 Nov 2025", title: "November Grants List",      href: "#",
      excerpt: "We know how tough the current funding climate is for charities across the sector. We've been listening closely and doing all we can to support them." },
    { date: "12 Sep 2025", title: "Celebrating 2024/25",       href: "#",
      excerpt: "We are pleased to announce the launch of our Annual Report for 2024/25, a landmark year celebrating our 75th anniversary." },
    { date: "18 Feb 2025", title: "Recruitment: Grants Manager", href: "#",
      excerpt: "Are you passionate about making a difference through impactful funding? We're looking for a Grants Manager to join our team." },
    { date: "28 Jun 2025", title: "June Grants List",          href: "#",
      excerpt: "A huge well done to our June grantees. We awarded £1.25m in grants to 18 charities, nine of them new to us." },
    { date: "11 Mar 2025", title: "February 2025 Grant List",  href: "#",
      excerpt: "An incredible year: 50 grants made, 19 new charities supported, and £3.6m in grants awarded." }
  ];

  function cardHTML(item) {
    return (
      '<a class="card" href="' + item.href + '">' +
        '<div class="card__image" style="background-image:url(\'' + IMG + '\')"></div>' +
        '<div class="card__body">' +
          '<p class="card__date">' + item.date + "</p>" +
          '<h3 class="card__title">' + item.title + "</h3>" +
          '<p class="card__excerpt">' + item.excerpt + "</p>" +
          '<span class="card__more">Read more &rarr;</span>' +
        "</div>" +
      "</a>"
    );
  }

  document.querySelectorAll("[data-news-grid]").forEach(function (grid) {
    var limit = parseInt(grid.getAttribute("data-news-grid"), 10);
    var items = isNaN(limit) ? NEWS : NEWS.slice(0, limit);
    grid.innerHTML = items.map(cardHTML).join("");
  });

  /* --- FAQ accordion ------------------------------------------------------ */
  document.querySelectorAll(".accordion__trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var panel = document.getElementById(trigger.getAttribute("aria-controls"));
      var expanded = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!expanded));
      if (panel) { panel.hidden = expanded; }
    });
  });

  /* --- Contact form ------------------------------------------------------- */
  var form = document.querySelector("[data-contact-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".form__status");
      if (status) {
        status.hidden = false;
        status.textContent = "Thank you. Your enquiry has been received – we will be in touch shortly.";
        status.focus();
      }
      form.reset();
    });
  }

  /* --- Eligibility quiz --------------------------------------------------- */
  var quiz = document.querySelector("[data-quiz]");
  if (quiz) {
    var QUESTIONS = [
      { q: "Does your charity operate with a national reach across England, Scotland and Wales (or at least two English regions)?",
        options: [
          { label: "Yes — we work nationally or across multiple regions", pass: true },
          { label: "No — we work in a single location or local authority", pass: false }
        ] },
      { q: "Is your organisation a registered charity or CIO?",
        options: [
          { label: "Yes — we are a registered charity or CIO", pass: true },
          { label: "No — we are another type of organisation", pass: false }
        ] },
      { q: "Does your work fall within one of our funding categories?",
        options: [
          { label: "Yes — youth, welfare, heritage or conservation", pass: true },
          { label: "No — our work sits outside these areas", pass: false }
        ] },
      { q: "Is your work primarily for residents of London or Northern Ireland?",
        options: [
          { label: "No — our beneficiaries are elsewhere in the UK", pass: true },
          { label: "Yes — mainly London or Northern Ireland", pass: false }
        ] },
      { q: "Are you seeking project or core funding for the organisation (not for an individual)?",
        options: [
          { label: "Yes — funding for our charity's work", pass: true },
          { label: "No — funding for an individual", pass: false }
        ] }
    ];

    var step = 0;
    var answers = [];

    function renderQuestion() {
      var item = QUESTIONS[step];
      var pct = Math.round((step / QUESTIONS.length) * 100);
      quiz.innerHTML =
        '<p class="eyebrow eyebrow--accent">Question ' + (step + 1) + " of " + QUESTIONS.length + "</p>" +
        '<div class="quiz__progress"><div class="quiz__progress-bar" style="width:' + pct + '%"></div></div>' +
        '<h2 class="quiz__question">' + item.q + "</h2>" +
        '<div class="quiz__options" role="radiogroup">' +
          item.options.map(function (o, i) {
            var checked = answers[step] === i ? " checked" : "";
            var sel = answers[step] === i ? " quiz__option--selected" : "";
            return '<label class="quiz__option' + sel + '">' +
              '<input type="radio" name="q" value="' + i + '"' + checked + " />" +
              "<span>" + o.label + "</span></label>";
          }).join("") +
        "</div>" +
        '<div class="quiz__nav">' +
          '<button class="btn btn--ghost" type="button" data-back' + (step === 0 ? " disabled" : "") + ">&larr; Back</button>" +
          '<button class="btn btn--primary" type="button" data-next>' +
            (step === QUESTIONS.length - 1 ? "See result" : "Next question &rarr;") +
          "</button>" +
        "</div>";

      quiz.querySelectorAll('input[name="q"]').forEach(function (input) {
        input.addEventListener("change", function () { answers[step] = parseInt(input.value, 10); });
      });
      var back = quiz.querySelector("[data-back]");
      var next = quiz.querySelector("[data-next]");
      if (back) back.addEventListener("click", function () { if (step > 0) { step--; renderQuestion(); } });
      if (next) next.addEventListener("click", function () {
        if (answers[step] === undefined) { return; }
        if (step < QUESTIONS.length - 1) { step++; renderQuestion(); }
        else { renderResult(); }
      });
    }

    function renderResult() {
      var eligible = answers.every(function (a, i) { return QUESTIONS[i].options[a].pass; });
      quiz.innerHTML = eligible
        ? '<p class="quiz__result-icon" aria-hidden="true">✅</p>' +
          '<h2 class="quiz__question">You look eligible to apply</h2>' +
          '<p class="prose" style="margin-bottom:var(--space-7)">Based on your answers, your charity appears to meet our basic eligibility criteria. The next step is to complete an Expression of Interest.</p>' +
          '<div class="btn-group"><a class="btn btn--primary" href="contact.html">Start an enquiry</a>' +
          '<a class="btn btn--ghost" href="faq.html">Read the FAQ</a></div>'
        : '<p class="quiz__result-icon" aria-hidden="true">ℹ️</p>' +
          '<h2 class="quiz__question">You may not be eligible</h2>' +
          '<p class="prose" style="margin-bottom:var(--space-7)">Based on your answers, your work may fall outside what we currently fund. Please review our funding categories and FAQ – you are welcome to get in touch if you are unsure.</p>' +
          '<div class="btn-group"><a class="btn btn--primary" href="faq.html">Read the FAQ</a>' +
          '<a class="btn btn--ghost" href="index.html">Funding categories</a></div>';
    }

    renderQuestion();
  }
})();
