(function (global) {
  const ALLOWED_TAGS = new Set(["BR", "STRONG", "EM", "SPAN"]);

  function sanitizeRichText(html) {
    const template = document.createElement("template");
    template.innerHTML = String(html ?? "");

    const walk = (node) => {
      if (!node || !node.childNodes) return;

      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          if (!ALLOWED_TAGS.has(child.tagName)) {
            const textNode = document.createTextNode(child.textContent || "");
            child.replaceWith(textNode);
            return;
          }

          Array.from(child.attributes).forEach((attr) => {
            child.removeAttribute(attr.name);
          });

          walk(child);
          return;
        }

        if (child.nodeType === Node.COMMENT_NODE) {
          child.remove();
        }
      });
    };

    walk(template.content);
    return template.innerHTML;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email ?? ""));
  }

  function validateLeadPayload(payload) {
    if (!payload.name) return "form.errName";
    if (!payload.phone && !payload.email) return "form.errContact";
    if (payload.email && !isValidEmail(payload.email)) return "form.errEmail";
    if (!payload.message) return "form.errMessage";
    return "";
  }

  function buildMailtoHref(emailTo, payload) {
    const subject = `WEBSITE ENQUIRY: ${payload.type || "Travel"} — ${payload.name || ""}`.trim();
    const body = [
      `Name: ${payload.name || ""}`,
      `Phone/WhatsApp: ${payload.phone || ""}`,
      `Email: ${payload.email || ""}`,
      `Type: ${payload.type || ""}`,
      `Route: ${payload.route || ""}`,
      `Dates: ${payload.dates || ""}`,
      "",
      "Message:",
      payload.message || "",
    ].join("\n");

    return `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const api = {
    buildMailtoHref,
    isValidEmail,
    sanitizeRichText,
    validateLeadPayload,
  };

  global.JetsetUtils = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
