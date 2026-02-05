const DEFAULT_LANG = "EN";
const SUPPORTED_LANGS = ["EN", "UA", "PL", "RU"];

const BASE_PATH = (() => {
  const marker = "/franchise-ALTSETING";
  const path = window.location.pathname;
  const index = path.indexOf(marker);
  if (index === -1) {
    return ".";
  }
  return path.slice(0, index + marker.length);
})();

const getValue = (obj, path) =>
  path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);

const setText = (data) => {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const value = getValue(data, key);
    if (value !== undefined) {
      el.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.dataset.i18nHtml;
    const value = getValue(data, key);
    if (value !== undefined) {
      el.innerHTML = value;
    }
  });

  document.querySelectorAll("[data-i18n-list]").forEach((el) => {
    const key = el.dataset.i18nList;
    const items = getValue(data, key);
    if (Array.isArray(items)) {
      el.innerHTML = "";
      items.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        el.appendChild(li);
      });
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    const value = getValue(data, key);
    if (value !== undefined) {
      el.setAttribute("placeholder", value);
    }
  });

  document.querySelectorAll("[data-i18n-options]").forEach((el) => {
    const key = el.dataset.i18nOptions;
    const options = getValue(data, key);
    if (Array.isArray(options)) {
      el.innerHTML = "";
      options.forEach((optionText) => {
        const option = document.createElement("option");
        option.textContent = optionText;
        option.value = optionText;
        el.appendChild(option);
      });
    }
  });
};

const ICONS = {
  group: `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">
      <circle cx="6" cy="7" r="2" />
      <circle cx="18" cy="7" r="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M2 20c0-3 3-5 6-5" />
      <path d="M22 20c0-3-3-5-6-5" />
      <path d="M6 20c0-3 3-5 6-5s6 2 6 5" />
    </svg>
  `,
  capital: `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">
      <circle cx="12" cy="12" r="7" />
      <path d="M8 10h8" />
      <path d="M8 14h8" />
    </svg>
  `,
  legal: `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">
      <path d="M4 20h16" />
      <path d="M6 20V6h12v14" />
      <path d="M9 6V4h6v2" />
    </svg>
  `,
  chair: `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">
      <path d="M12 4v12" />
      <path d="M5 8h14" />
      <path d="M7 20h10" />
      <path d="M9 16h6" />
    </svg>
  `,
  vote: `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">
      <path d="M4 12h16" />
      <path d="M7 8l5 4-5 4" />
      <path d="M17 8v8" />
    </svg>
  `,
  operations: `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">
      <path d="M4 7h16" />
      <path d="M4 12h10" />
      <path d="M4 17h16" />
      <circle cx="18" cy="12" r="2" />
    </svg>
  `,
  profit: `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="1.6">
      <path d="M4 16l6-6 4 4 6-6" />
      <path d="M18 8h4v4" />
    </svg>
  `,
};

const renderInfographic = (data) => {
  const container = document.querySelector("[data-infographic]");
  if (!container) {
    return;
  }

  const steps = data.infographic?.steps;
  if (!Array.isArray(steps)) {
    return;
  }

  container.innerHTML = "";
  steps.forEach((step) => {
    const card = document.createElement("div");
    card.className = "infographic-step";

    const iconWrapper = document.createElement("div");
    iconWrapper.className = "icon";
    iconWrapper.innerHTML = ICONS[step.icon] || ICONS.group;

    const title = document.createElement("h3");
    title.textContent = step.title;

    const text = document.createElement("p");
    text.textContent = step.text;

    card.appendChild(iconWrapper);
    card.appendChild(title);
    card.appendChild(text);

    container.appendChild(card);
  });
};

const updateLanguageSwitcher = (lang) => {
  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });
};

const loadLanguage = async (lang) => {
  const safeLang = SUPPORTED_LANGS.includes(lang) ? lang : DEFAULT_LANG;
  const url = `${BASE_PATH}/data/${safeLang.toLowerCase()}.json`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    if (safeLang !== DEFAULT_LANG) {
      return loadLanguage(DEFAULT_LANG);
    }
    return;
  }

  const data = await response.json();
  setText(data);
  renderInfographic(data);
  updateLanguageSwitcher(safeLang);
  localStorage.setItem("altseting-lang", safeLang);
};

const initLanguage = () => {
  const stored = localStorage.getItem("altseting-lang") || DEFAULT_LANG;
  loadLanguage(stored);

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => {
      loadLanguage(button.dataset.lang);
    });
  });
};

initLanguage();
