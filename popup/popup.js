(function initPopup() {
  const themeApi = globalThis.GoogleDocsDarkmodeThemes;
  const {
    STORAGE_KEYS,
    DEFAULT_THEME_ID,
    DEFAULT_THEMES,
    getThemeById,
    normalizeCustomTheme
  } = themeApi;

  const colorFields = [
    ["appBackground", "App"],
    ["toolbar", "Toolbar"],
    ["panel", "Panels"],
    ["page", "Page"],
    ["text", "Text"],
    ["mutedText", "Muted"],
    ["link", "Links"],
    ["accent", "Accent"],
    ["border", "Border"]
  ];

  const state = {
    enabled: true,
    selectedThemeId: DEFAULT_THEME_ID,
    customTheme: normalizeCustomTheme(),
    favoriteThemeIds: []
  };

  const enabledToggle = document.getElementById("enabledToggle");
  const themeGrid = document.getElementById("themeGrid");
  const favoritesGrid = document.getElementById("favoritesGrid");
  const favoritesEmpty = document.getElementById("favoritesEmpty");
  const preview = document.getElementById("themePreview");
  const customThemeForm = document.getElementById("customThemeForm");
  const copyPresetButton = document.getElementById("copyPresetButton");
  const saveCustomButton = document.getElementById("saveCustomButton");
  const toast = document.getElementById("toast");

  let toastTimeout = 0;

  function getPreviewPattern(pattern) {
    const patterns = {
      polka:
        "radial-gradient(circle at 12px 12px, var(--preview-accent) 0 3px, transparent 4px), radial-gradient(circle at 34px 30px, var(--preview-panel) 0 4px, transparent 5px)",
      tinyDots:
        "radial-gradient(circle at 10px 10px, var(--preview-accent) 0 1.5px, transparent 2px)",
      gridDots:
        "linear-gradient(90deg, var(--preview-line) 1px, transparent 1px), linear-gradient(180deg, var(--preview-line) 1px, transparent 1px), radial-gradient(circle, var(--preview-accent) 0 2px, transparent 3px)",
      sunbeams:
        "radial-gradient(circle at 18% 12%, var(--preview-glow), transparent 24%), linear-gradient(120deg, transparent 0 42%, var(--preview-line) 42% 44%, transparent 44% 100%)",
      confetti:
        "radial-gradient(circle at 16px 18px, var(--preview-accent) 0 3px, transparent 4px), linear-gradient(35deg, transparent 0 44%, var(--preview-panel) 44% 53%, transparent 53% 100%)",
      notebook:
        "linear-gradient(90deg, transparent 0 48px, var(--preview-accent) 48px 50px, transparent 50px), linear-gradient(180deg, transparent 0 27px, var(--preview-line) 27px 28px, transparent 28px)"
    };

    return patterns[pattern] || "";
  }

  function getCardPattern(pattern) {
    return getPreviewPattern(pattern)
      .replaceAll("--preview-accent", "--card-accent")
      .replaceAll("--preview-panel", "--card-panel")
      .replaceAll("--preview-line", "--card-line")
      .replaceAll("--preview-glow", "--card-glow");
  }

  function hexToRgba(hex, alpha) {
    const normalized = hex.replace("#", "");
    const value = Number.parseInt(normalized, 16);
    const red = (value >> 16) & 255;
    const green = (value >> 8) & 255;
    const blue = value & 255;

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }

  function getAvailableThemes() {
    return [...DEFAULT_THEMES, normalizeCustomTheme(state.customTheme)];
  }

  function getTheme(themeId) {
    if (themeId === "custom") return normalizeCustomTheme(state.customTheme);
    return getThemeById(themeId);
  }

  function getCurrentTheme() {
    return getTheme(state.selectedThemeId);
  }

  function isFavorite(themeId) {
    return state.favoriteThemeIds.includes(themeId);
  }

  function showToast(message) {
    window.clearTimeout(toastTimeout);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimeout = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  function setPreview(theme) {
    preview.style.setProperty("--preview-app", theme.colors.appBackground);
    preview.style.setProperty("--preview-toolbar", theme.colors.toolbar);
    preview.style.setProperty("--preview-panel", theme.colors.panel);
    preview.style.setProperty("--preview-page", theme.colors.page);
    preview.style.setProperty("--preview-text", theme.colors.text);
    preview.style.setProperty("--preview-muted", theme.colors.mutedText);
    preview.style.setProperty("--preview-accent", theme.colors.accent);
    preview.style.setProperty("--preview-border", theme.colors.border);
    preview.style.setProperty("--preview-line", theme.colors.pageLine);
    preview.style.setProperty("--preview-glow", theme.colors.pageGlow);
    preview.style.setProperty("--preview-pattern", getPreviewPattern(theme.decoration?.pattern) || "none");
    preview.classList.toggle("has-decoration", Boolean(theme.decoration));
  }

  function setStoredValues(values, callback) {
    chrome.storage.sync.set(values, callback);
  }

  function selectTheme(themeId) {
    state.selectedThemeId = themeId;
    setStoredValues({ [STORAGE_KEYS.selectedThemeId]: themeId });
    updateUi();
  }

  function toggleFavorite(themeId) {
    if (isFavorite(themeId)) {
      state.favoriteThemeIds = state.favoriteThemeIds.filter((id) => id !== themeId);
    } else {
      state.favoriteThemeIds = [themeId, ...state.favoriteThemeIds].slice(0, 12);
    }

    setStoredValues({ [STORAGE_KEYS.favoriteThemeIds]: state.favoriteThemeIds });
    updateUi();
  }

  function createThemeCard(theme, options = {}) {
    const card = document.createElement("article");
    card.className = "theme-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Use ${theme.name}`);
    card.dataset.themeId = theme.id;
    card.dataset.fun = theme.decoration ? "true" : "false";
    card.style.setProperty("--card-accent", theme.colors.accent);
    card.style.setProperty("--card-panel", theme.colors.panel);
    card.style.setProperty("--card-line", theme.colors.pageLine);
    card.style.setProperty("--card-glow", theme.colors.pageGlow);
    card.style.setProperty("--card-pattern", getCardPattern(theme.decoration?.pattern) || "none");

    const favoriteLabel = isFavorite(theme.id) ? "Remove favorite" : "Save favorite";
    card.innerHTML = `
      <div class="theme-card-top">
        <div class="theme-select">
          <span class="theme-name">${theme.name}${theme.decoration ? "<em>Fun</em>" : ""}</span>
          <small>${theme.description}</small>
        </div>
        <button class="favorite-button" type="button" aria-label="${favoriteLabel}" title="${favoriteLabel}">
          ${isFavorite(theme.id) ? "★" : "☆"}
        </button>
      </div>
      <div class="swatches" aria-hidden="true">
        <i class="swatch" style="background:${theme.colors.toolbar}"></i>
        <i class="swatch" style="background:${theme.colors.page}"></i>
        <i class="swatch" style="background:${theme.colors.text}"></i>
        <i class="swatch" style="background:${theme.colors.accent}"></i>
        <i class="swatch" style="background:${theme.colors.chip}"></i>
      </div>
    `;

    card.addEventListener("click", () => selectTheme(theme.id));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectTheme(theme.id);
      }
    });

    card.querySelector(".favorite-button").addEventListener("click", (event) => {
      event.stopPropagation();
      toggleFavorite(theme.id);
    });

    if (theme.id === state.selectedThemeId) card.classList.add("is-active");
    if (options.compact) card.classList.add("is-compact");

    return card;
  }

  function renderThemeCards() {
    const allThemesFragment = document.createDocumentFragment();
    themeGrid.textContent = "";

    getAvailableThemes().forEach((theme) => {
      allThemesFragment.appendChild(createThemeCard(theme));
    });

    themeGrid.appendChild(allThemesFragment);
  }

  function renderFavoriteCards() {
    const favoriteThemes = state.favoriteThemeIds
      .map(getTheme)
      .filter((theme) => theme && theme.id);

    favoritesGrid.textContent = "";
    favoritesEmpty.hidden = favoriteThemes.length > 0;
    favoritesGrid.hidden = favoriteThemes.length === 0;

    const fragment = document.createDocumentFragment();
    favoriteThemes.forEach((theme) => {
      fragment.appendChild(createThemeCard(theme, { compact: true }));
    });
    favoritesGrid.appendChild(fragment);
  }

  function renderCustomForm() {
    const fragment = document.createDocumentFragment();
    customThemeForm.textContent = "";

    colorFields.forEach(([key, label]) => {
      const wrapper = document.createElement("div");
      wrapper.className = "color-field";
      wrapper.innerHTML = `
        <label for="custom-${key}">${label}</label>
        <input id="custom-${key}" name="${key}" type="color" value="${state.customTheme.colors[key]}">
      `;
      wrapper.querySelector("input").addEventListener("input", () => {
        const draftTheme = buildCustomThemeFromInputs();
        setPreview(draftTheme);
      });
      fragment.appendChild(wrapper);
    });

    customThemeForm.appendChild(fragment);
  }

  function buildCustomThemeFromInputs() {
    const formData = new FormData(customThemeForm);
    const colors = { ...normalizeCustomTheme(state.customTheme).colors };

    colorFields.forEach(([key]) => {
      colors[key] = formData.get(key) || colors[key];
    });

    colors.selection = hexToRgba(colors.accent, 0.34);
    colors.pageLine = hexToRgba(colors.accent, 0.12);
    colors.pageGlow = hexToRgba(colors.accent, 0.16);

    return normalizeCustomTheme({ colors });
  }

  function fillCustomInputs(theme) {
    colorFields.forEach(([key]) => {
      const input = customThemeForm.elements[key];
      if (input) input.value = theme.colors[key];
    });
  }

  function updateUi() {
    enabledToggle.checked = state.enabled;
    setPreview(getCurrentTheme());
    renderFavoriteCards();
    renderThemeCards();
  }

  function loadState() {
    chrome.storage.sync.get(
      {
        [STORAGE_KEYS.enabled]: true,
        [STORAGE_KEYS.selectedThemeId]: DEFAULT_THEME_ID,
        [STORAGE_KEYS.customTheme]: normalizeCustomTheme(),
        [STORAGE_KEYS.favoriteThemeIds]: ["dark-mode", "pink-pop", "mint-sticker"]
      },
      (settings) => {
        state.enabled = settings[STORAGE_KEYS.enabled] !== false;
        state.selectedThemeId = settings[STORAGE_KEYS.selectedThemeId] || DEFAULT_THEME_ID;
        state.customTheme = normalizeCustomTheme(settings[STORAGE_KEYS.customTheme]);
        state.favoriteThemeIds = Array.isArray(settings[STORAGE_KEYS.favoriteThemeIds])
          ? settings[STORAGE_KEYS.favoriteThemeIds]
          : [];

        renderCustomForm();
        fillCustomInputs(state.customTheme);
        updateUi();
      }
    );
  }

  enabledToggle.addEventListener("change", () => {
    state.enabled = enabledToggle.checked;
    setStoredValues({ [STORAGE_KEYS.enabled]: state.enabled });
    updateUi();
  });

  copyPresetButton.addEventListener("click", () => {
    fillCustomInputs(getCurrentTheme());
    setPreview(buildCustomThemeFromInputs());
  });

  saveCustomButton.addEventListener("click", () => {
    state.customTheme = buildCustomThemeFromInputs();
    state.selectedThemeId = "custom";
    setStoredValues(
      {
        [STORAGE_KEYS.customTheme]: state.customTheme,
        [STORAGE_KEYS.selectedThemeId]: "custom"
      },
      () => showToast("Custom theme saved")
    );
    fillCustomInputs(state.customTheme);
    updateUi();
  });

  loadState();
})();
