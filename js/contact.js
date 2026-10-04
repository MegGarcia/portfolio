/* Contact form submission.
   Posts to a Google Apps Script web app (see google-apps-script/README.md).
   Paste your deployment URL into FORM_ENDPOINT below. Until then, the form
   validates and shows a friendly notice but does not send. */
(function () {
  "use strict";

  // TODO: paste your Apps Script Web App URL here after deploying.
  var FORM_ENDPOINT = "";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = document.getElementById("form-status");
  var submit = form.querySelector('[type="submit"]');

  function setStatus(msg, state) {
    if (!status) return;
    status.textContent = msg;
    status.setAttribute("data-state", state || "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var data = {
      formType: "contact",
      name: (form.elements.name && form.elements.name.value || "").trim(),
      email: (form.elements.email && form.elements.email.value || "").trim(),
      message: (form.elements.message && form.elements.message.value || "").trim()
    };

    if (!data.name || !data.email || !data.message) {
      setStatus("Please fill in your name, email, and a message.", "err");
      return;
    }

    if (!FORM_ENDPOINT) {
      setStatus(
        "This form isn't connected yet. Email me at MeganGarcia2024@gmail.com in the meantime!",
        "err"
      );
      return;
    }

    if (submit) { submit.disabled = true; }
    setStatus("Sending…", "");

    fetch(FORM_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data)
    })
      .then(function () {
        form.reset();
        setStatus("🎉  Your message has been sent!", "ok");
      })
      .catch(function () {
        setStatus("⚠️  Something went wrong. Try again later.", "err");
      })
      .then(function () {
        if (submit) { submit.disabled = false; }
      });
  });
})();
