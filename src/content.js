(function initGoogleDocsDarkmode() {
  const themeApi = globalThis.GoogleDocsDarkmodeThemes;
  const { STORAGE_KEYS, DEFAULT_THEME_ID, getThemeById, normalizeCustomTheme } = themeApi;
  const STYLE_ID = "google-docs-themes-style";
  const ROOT_CLASS = "gdd-enabled";

  let currentSettings = {
    [STORAGE_KEYS.enabled]: true,
    [STORAGE_KEYS.selectedThemeId]: DEFAULT_THEME_ID
  };

  function cssVarName(name) {
    return `--gdd-${name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
  }

  function getSelectedTheme(settings) {
    if (settings[STORAGE_KEYS.selectedThemeId] === "custom") {
      return normalizeCustomTheme(settings[STORAGE_KEYS.customTheme]);
    }

    return getThemeById(settings[STORAGE_KEYS.selectedThemeId]);
  }

  function getOrCreateStyleElement() {
    let styleElement = document.getElementById(STYLE_ID);

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = STYLE_ID;
      styleElement.setAttribute("data-extension", "google-docs-themes");
      (document.head || document.documentElement).appendChild(styleElement);
    }

    return styleElement;
  }

  function getPatternCss(pattern) {
    const patterns = {
      polka:
        "radial-gradient(circle at 12px 12px, var(--gdd-accent) 0 3px, transparent 4px), radial-gradient(circle at 34px 30px, var(--gdd-chip) 0 4px, transparent 5px)",
      tinyDots:
        "radial-gradient(circle at 10px 10px, var(--gdd-accent) 0 1.5px, transparent 2px)",
      gridDots:
        "linear-gradient(90deg, var(--gdd-page-line) 1px, transparent 1px), linear-gradient(180deg, var(--gdd-page-line) 1px, transparent 1px), radial-gradient(circle, var(--gdd-accent) 0 2px, transparent 3px)",
      sunbeams:
        "radial-gradient(circle at 18% 12%, var(--gdd-page-glow), transparent 24%), linear-gradient(120deg, transparent 0 42%, var(--gdd-page-line) 42% 44%, transparent 44% 100%)",
      confetti:
        "radial-gradient(circle at 16px 18px, var(--gdd-accent) 0 3px, transparent 4px), linear-gradient(35deg, transparent 0 44%, var(--gdd-chip) 44% 53%, transparent 53% 100%), linear-gradient(135deg, transparent 0 46%, var(--gdd-page-line) 46% 54%, transparent 54% 100%)",
      notebook:
        "linear-gradient(90deg, transparent 0 48px, var(--gdd-accent) 48px 50px, transparent 50px), linear-gradient(180deg, transparent 0 27px, var(--gdd-page-line) 27px 28px, transparent 28px)"
    };

    return patterns[pattern] || "";
  }

  function getNavArtCss(nav) {
    const art = {
      bubbles:
        "radial-gradient(circle at 20% 50%, var(--gdd-accent) 0 8px, transparent 9px), radial-gradient(circle at 48% 35%, var(--gdd-chip) 0 12px, transparent 13px), radial-gradient(circle at 78% 58%, var(--gdd-page-glow) 0 18px, transparent 19px)",
      sun:
        "radial-gradient(circle at 28% 52%, var(--gdd-accent) 0 14px, transparent 15px), linear-gradient(90deg, transparent 0 55%, var(--gdd-page-line) 55% 58%, transparent 58%)",
      leaf:
        "radial-gradient(ellipse at 34% 55%, var(--gdd-accent) 0 18px, transparent 19px), radial-gradient(ellipse at 66% 45%, var(--gdd-chip) 0 15px, transparent 16px)",
      sparkle:
        "linear-gradient(45deg, transparent 0 43%, var(--gdd-accent) 43% 57%, transparent 57%), linear-gradient(-45deg, transparent 0 43%, var(--gdd-page-glow) 43% 57%, transparent 57%)",
      halftone:
        "radial-gradient(circle, var(--gdd-accent) 0 3px, transparent 4px), radial-gradient(circle, var(--gdd-chip) 0 2px, transparent 3px)"
    };

    return art[nav] || "";
  }

  function buildDecorationCss(theme) {
    if (!theme.decoration) return "";

    const patternCss = getPatternCss(theme.decoration.pattern);
    const navArtCss = getNavArtCss(theme.decoration.nav);

    return `
:root.${ROOT_CLASS} .docs-homescreen-container,
:root.${ROOT_CLASS} .docs-homescreen-homepage,
:root.${ROOT_CLASS} .docs-editor-container {
  background-image: ${patternCss || "none"} !important;
  background-size: 46px 46px !important;
  background-blend-mode: soft-light !important;
}

:root.${ROOT_CLASS} .docs-homescreen-header {
  background-image: ${navArtCss || "none"} !important;
  background-size: 96px 38px !important;
  background-position: right 92px top 8px !important;
  background-repeat: no-repeat !important;
  background-blend-mode: soft-light !important;
}
`;
  }

  function buildCss(theme) {
    const vars = Object.entries(theme.colors)
      .map(([key, value]) => `${cssVarName(key)}: ${value};`)
      .join("\n");
    const decorationCss = buildDecorationCss(theme);

    return `
:root.${ROOT_CLASS} {
${vars}
  --gdd-shadow: rgba(0, 0, 0, 0.52);
  --gdd-canvas-filter: ${theme.colors.canvasFilter || "invert(0.92) hue-rotate(180deg) brightness(0.92) contrast(0.96)"};
  --gdd-focus-ring: 0 0 0 2px var(--gdd-accent), 0 0 0 5px var(--gdd-page-glow);
  color-scheme: ${theme.colors.colorScheme || "dark"};
}

:root.${ROOT_CLASS},
:root.${ROOT_CLASS} body,
:root.${ROOT_CLASS} c-wiz,
:root.${ROOT_CLASS} [role="main"],
:root.${ROOT_CLASS} [role="application"],
:root.${ROOT_CLASS} [role="banner"],
:root.${ROOT_CLASS} [role="navigation"],
:root.${ROOT_CLASS} header,
:root.${ROOT_CLASS} nav,
:root.${ROOT_CLASS} main,
:root.${ROOT_CLASS} .docs-homescreen-container,
:root.${ROOT_CLASS} .docs-homescreen-homepage,
:root.${ROOT_CLASS} .docs-homescreen-grid,
:root.${ROOT_CLASS} .docs-homescreen-list,
:root.${ROOT_CLASS} .docs-homescreen-header,
:root.${ROOT_CLASS} .docs-homescreen-hero,
:root.${ROOT_CLASS} .docs-homescreen-topbar,
:root.${ROOT_CLASS} .docs-homescreen-templates-templateview,
:root.${ROOT_CLASS} .docs-homescreen-templateview,
:root.${ROOT_CLASS} .docs-homescreen-templates-templateview-container,
:root.${ROOT_CLASS} .docs-homescreen-templates-templateview-preview,
:root.${ROOT_CLASS} .docs-homescreen-templates-templateview-title,
:root.${ROOT_CLASS} .docs-homescreen-start,
:root.${ROOT_CLASS} .docs-homescreen-section,
:root.${ROOT_CLASS} .docs-homescreen-item-section,
:root.${ROOT_CLASS} .docs-homescreen-templates-bar,
:root.${ROOT_CLASS} .docs-homescreen-leftmenu,
:root.${ROOT_CLASS} .docs-homescreen-floater-header,
:root.${ROOT_CLASS} .docs-homescreen-floater,
:root.${ROOT_CLASS} .docs-homescreen-material-bar-enabled,
:root.${ROOT_CLASS} [class*="docs-homescreen" i][class*="header" i],
:root.${ROOT_CLASS} [class*="docs-homescreen" i][class*="hero" i],
:root.${ROOT_CLASS} [class*="docs-homescreen" i][class*="template" i],
:root.${ROOT_CLASS} [class*="docs-homescreen" i][class*="start" i],
:root.${ROOT_CLASS} [class*="docs-homescreen" i][class*="nav" i],
:root.${ROOT_CLASS} [class*="docs-homescreen" i][class*="menu" i],
:root.${ROOT_CLASS} [class*="freebird" i],
:root.${ROOT_CLASS} [class^="gb_"],
:root.${ROOT_CLASS} [class*=" gb_"] {
  background: var(--gdd-app-background) !important;
  color: var(--gdd-text) !important;
}

:root.${ROOT_CLASS} a,
:root.${ROOT_CLASS} .docs-link,
:root.${ROOT_CLASS} .docs-explore-widget-link,
:root.${ROOT_CLASS} [role="link"] {
  color: var(--gdd-link) !important;
}

:root.${ROOT_CLASS} ::selection {
  background: var(--gdd-selection) !important;
  color: var(--gdd-text) !important;
}

:root.${ROOT_CLASS} #docs-chrome,
:root.${ROOT_CLASS} #docs-bars,
:root.${ROOT_CLASS} #docs-header,
:root.${ROOT_CLASS} #docs-titlebar,
:root.${ROOT_CLASS} #docs-titlebar-container,
:root.${ROOT_CLASS} .docs-titlebar,
:root.${ROOT_CLASS} .docs-titlebar-container,
:root.${ROOT_CLASS} .docs-titlebar-title,
:root.${ROOT_CLASS} .docs-titlebar-title-container,
:root.${ROOT_CLASS} .docs-title-outer,
:root.${ROOT_CLASS} .docs-title-inner,
:root.${ROOT_CLASS} .docs-title-container,
:root.${ROOT_CLASS} .docs-title-input-label,
:root.${ROOT_CLASS} .docs-title-input-label-inner,
:root.${ROOT_CLASS} .docs-titlebar-badges,
:root.${ROOT_CLASS} .docs-titlebar-badges-container,
:root.${ROOT_CLASS} .docs-titlebar-button,
:root.${ROOT_CLASS} #docs-menubar,
:root.${ROOT_CLASS} #docs-toolbar-wrapper,
:root.${ROOT_CLASS} #docs-toolbar,
:root.${ROOT_CLASS} .docs-toolbar,
:root.${ROOT_CLASS} .docs-toolbar-wrapper,
:root.${ROOT_CLASS} .docs-toolbar-zoom-combobox,
:root.${ROOT_CLASS} .docs-toolbar-zoom,
:root.${ROOT_CLASS} .goog-toolbar-combo-button,
:root.${ROOT_CLASS} .goog-toolbar-combo-button-input,
:root.${ROOT_CLASS} .goog-toolbar-combo-button-caption,
:root.${ROOT_CLASS} .docs-titlebar-buttons,
:root.${ROOT_CLASS} .docs-material,
:root.${ROOT_CLASS} .docs-material-gm-labeled-checkbox,
:root.${ROOT_CLASS} .docs-gm .goog-toolbar,
:root.${ROOT_CLASS} .docs-gm .goog-menu,
:root.${ROOT_CLASS} .docs-gm .goog-menuitem,
:root.${ROOT_CLASS} .docs-gm .modal-dialog,
:root.${ROOT_CLASS} .docs-gm .goog-dialog,
:root.${ROOT_CLASS} .docs-explore-widget,
:root.${ROOT_CLASS} .docs-sidebar-tile,
:root.${ROOT_CLASS} .docs-document-tab,
:root.${ROOT_CLASS} .docs-document-tab-button,
:root.${ROOT_CLASS} .docs-document-tabs,
:root.${ROOT_CLASS} .docs-document-tabs-sidebar,
:root.${ROOT_CLASS} .docs-document-tabs-container,
:root.${ROOT_CLASS} .docs-document-tabs-panel,
:root.${ROOT_CLASS} .docs-tab,
:root.${ROOT_CLASS} [role="tab"],
:root.${ROOT_CLASS} [role="tablist"],
:root.${ROOT_CLASS} [aria-label*="Document tabs" i],
:root.${ROOT_CLASS} [data-tooltip*="Document tabs" i],
:root.${ROOT_CLASS} [aria-label*="Tab " i],
:root.${ROOT_CLASS} .companion-app-switcher-container,
:root.${ROOT_CLASS} .companion-app-switcher-container *,
:root.${ROOT_CLASS} .companion-app-switcher-button,
:root.${ROOT_CLASS} .companion-app-switcher-item,
:root.${ROOT_CLASS} .companion-app-switcher-pane,
:root.${ROOT_CLASS} .docs-gemini,
:root.${ROOT_CLASS} .docs-gemini-sidebar,
:root.${ROOT_CLASS} .docs-gemini-panel,
:root.${ROOT_CLASS} .docs-gemini-toolbar,
:root.${ROOT_CLASS} [class*="gemini" i],
:root.${ROOT_CLASS} [class*="bard" i],
:root.${ROOT_CLASS} [class*="companion" i],
:root.${ROOT_CLASS} [aria-label*="Gemini" i],
:root.${ROOT_CLASS} [aria-label*="Ask Gemini" i],
:root.${ROOT_CLASS} [data-tooltip*="Gemini" i],
:root.${ROOT_CLASS} [data-tooltip*="Ask Gemini" i],
:root.${ROOT_CLASS} [aria-label*="side panel" i],
:root.${ROOT_CLASS} [class*="side-panel" i],
:root.${ROOT_CLASS} [class*="sidepanel" i],
:root.${ROOT_CLASS} [class*="sidebar" i] {
  background: var(--gdd-toolbar) !important;
  color: var(--gdd-text) !important;
  border-color: var(--gdd-border) !important;
}

:root.${ROOT_CLASS} .docs-gm .goog-menu,
:root.${ROOT_CLASS} .docs-gm .goog-menuitem,
:root.${ROOT_CLASS} .docs-material-menu,
:root.${ROOT_CLASS} .docs-material-gm-dialog,
:root.${ROOT_CLASS} .docs-ui-toast,
:root.${ROOT_CLASS} .docs-bubble,
:root.${ROOT_CLASS} .docs-revisions-tile,
:root.${ROOT_CLASS} .docs-revisions-sidebar,
:root.${ROOT_CLASS} .docs-explore-widget,
:root.${ROOT_CLASS} .app-switcher-button,
:root.${ROOT_CLASS} .docs-omnibox-input,
:root.${ROOT_CLASS} .docs-homescreen-grid-item,
:root.${ROOT_CLASS} .docs-homescreen-list-item,
:root.${ROOT_CLASS} .docs-homescreen-template,
:root.${ROOT_CLASS} .docs-homescreen-item,
:root.${ROOT_CLASS} .docs-homescreen-card,
:root.${ROOT_CLASS} .docs-homescreen-hero *,
:root.${ROOT_CLASS} .docs-homescreen-templates-templateview *,
:root.${ROOT_CLASS} .docs-homescreen-recent-docs,
:root.${ROOT_CLASS} .docs-homescreen-owner-filter-container,
:root.${ROOT_CLASS} .docs-homescreen-floater-header,
:root.${ROOT_CLASS} [role="dialog"],
:root.${ROOT_CLASS} [role="menu"],
:root.${ROOT_CLASS} [role="menuitem"],
:root.${ROOT_CLASS} [role="listbox"],
:root.${ROOT_CLASS} [role="option"],
:root.${ROOT_CLASS} [role="tooltip"],
:root.${ROOT_CLASS} [role="button"][aria-haspopup],
:root.${ROOT_CLASS} .goog-menu,
:root.${ROOT_CLASS} .goog-menu *,
:root.${ROOT_CLASS} .goog-menuitem,
:root.${ROOT_CLASS} .goog-popup,
:root.${ROOT_CLASS} .goog-menu-button-dropdown,
:root.${ROOT_CLASS} .docs-material-menu,
:root.${ROOT_CLASS} .docs-material-menu *,
:root.${ROOT_CLASS} .docs-material-popup,
:root.${ROOT_CLASS} .docs-material-tooltip,
:root.${ROOT_CLASS} [class*="menu" i][style*="position"],
:root.${ROOT_CLASS} [class*="popup" i][style*="position"],
:root.${ROOT_CLASS} [class*="popover" i],
:root.${ROOT_CLASS} [class*="tooltip" i],
:root.${ROOT_CLASS} [style*="background-color: rgb(255, 255, 255)"],
:root.${ROOT_CLASS} [style*="background: rgb(255, 255, 255)"],
:root.${ROOT_CLASS} [style*="background-color: rgb(248, 249, 250)"],
:root.${ROOT_CLASS} [style*="background: rgb(248, 249, 250)"],
:root.${ROOT_CLASS} [style*="background-color: rgb(241, 243, 244)"],
:root.${ROOT_CLASS} [style*="background: rgb(241, 243, 244)"],
:root.${ROOT_CLASS} [style*="background-color: #fff"],
:root.${ROOT_CLASS} [style*="background: #fff"],
:root.${ROOT_CLASS} [style*="background-color: #ffffff"],
:root.${ROOT_CLASS} [style*="background: #ffffff"],
:root.${ROOT_CLASS} [style*="background-color:white"],
:root.${ROOT_CLASS} [style*="background-color: white"],
:root.${ROOT_CLASS} [style*="background: white"],
:root.${ROOT_CLASS} .gdd-auto-surface {
  background: var(--gdd-panel) !important;
  color: var(--gdd-text) !important;
  border-color: var(--gdd-border) !important;
}

:root.${ROOT_CLASS} .gdd-auto-soft-surface {
  background: var(--gdd-toolbar) !important;
  color: var(--gdd-text) !important;
  border-color: var(--gdd-border) !important;
}

:root.${ROOT_CLASS} .gdd-auto-text {
  color: var(--gdd-text) !important;
}

:root.${ROOT_CLASS} .gdd-auto-border {
  border-color: var(--gdd-border) !important;
}

:root.${ROOT_CLASS} .goog-toolbar-button,
:root.${ROOT_CLASS} .goog-toolbar-menu-button,
:root.${ROOT_CLASS} .goog-toolbar-toggle-button,
:root.${ROOT_CLASS} .goog-menuitem,
:root.${ROOT_CLASS} .docs-title-input,
:root.${ROOT_CLASS} .docs-title-input-label,
:root.${ROOT_CLASS} .docs-title-input-label-inner,
:root.${ROOT_CLASS} .docs-title-widget,
:root.${ROOT_CLASS} .docs-title-save-label,
:root.${ROOT_CLASS} .docs-menubar .goog-control,
:root.${ROOT_CLASS} .docs-gm .goog-control,
:root.${ROOT_CLASS} .docs-material-button,
:root.${ROOT_CLASS} .docs-homescreen-material-button,
:root.${ROOT_CLASS} .docs-homescreen-button,
:root.${ROOT_CLASS} .docs-homescreen-list-item-title,
:root.${ROOT_CLASS} .docs-homescreen-grid-item-title,
:root.${ROOT_CLASS} .docs-homescreen-grid-item-owner,
:root.${ROOT_CLASS} .docs-homescreen-list-item-owner,
:root.${ROOT_CLASS} [class*="docs-homescreen"],
:root.${ROOT_CLASS} [class*="appsMaterial"],
:root.${ROOT_CLASS} [class*="goog-"],
:root.${ROOT_CLASS} [class*="gb_"],
:root.${ROOT_CLASS} input,
:root.${ROOT_CLASS} textarea,
:root.${ROOT_CLASS} select {
  color: var(--gdd-text) !important;
  border-color: var(--gdd-border) !important;
}

:root.${ROOT_CLASS} .goog-toolbar-button-hover,
:root.${ROOT_CLASS} .goog-toolbar-menu-button-hover,
:root.${ROOT_CLASS} .goog-toolbar-toggle-button-hover,
:root.${ROOT_CLASS} .goog-menuitem-highlight,
:root.${ROOT_CLASS} .docs-material-button:hover,
:root.${ROOT_CLASS} .docs-homescreen-material-button:hover,
:root.${ROOT_CLASS} .docs-homescreen-list-item:hover,
:root.${ROOT_CLASS} .docs-homescreen-grid-item:hover,
:root.${ROOT_CLASS} .docs-menubar .goog-control-hover,
:root.${ROOT_CLASS} [role="button"]:hover,
:root.${ROOT_CLASS} [role="menuitem"]:hover {
  background: var(--gdd-chip) !important;
  color: var(--gdd-text) !important;
}

:root.${ROOT_CLASS} .docs-material-button,
:root.${ROOT_CLASS} .docs-homescreen-material-button {
  background-color: var(--gdd-chip) !important;
  border-color: var(--gdd-border) !important;
  color: var(--gdd-text) !important;
}

:root.${ROOT_CLASS} button *,
:root.${ROOT_CLASS} [role="button"] *,
:root.${ROOT_CLASS} .docs-material-button *,
:root.${ROOT_CLASS} .docs-homescreen-material-button *,
:root.${ROOT_CLASS} [aria-label*="Upgrade" i],
:root.${ROOT_CLASS} [aria-label*="Upgrade" i] *,
:root.${ROOT_CLASS} [data-tooltip*="Upgrade" i],
:root.${ROOT_CLASS} [data-tooltip*="Upgrade" i] *,
:root.${ROOT_CLASS} [aria-label*="Share" i],
:root.${ROOT_CLASS} [aria-label*="Share" i] *,
:root.${ROOT_CLASS} [data-tooltip*="Share" i],
:root.${ROOT_CLASS} [data-tooltip*="Share" i] * {
  color: var(--gdd-text) !important;
}

:root.${ROOT_CLASS} [aria-label*="Share" i].gdd-auto-surface,
:root.${ROOT_CLASS} [aria-label*="Share" i].gdd-auto-soft-surface,
:root.${ROOT_CLASS} [data-tooltip*="Share" i].gdd-auto-surface,
:root.${ROOT_CLASS} [data-tooltip*="Share" i].gdd-auto-soft-surface,
:root.${ROOT_CLASS} [aria-label*="Upgrade" i].gdd-auto-surface,
:root.${ROOT_CLASS} [aria-label*="Upgrade" i].gdd-auto-soft-surface,
:root.${ROOT_CLASS} [data-tooltip*="Upgrade" i].gdd-auto-surface,
:root.${ROOT_CLASS} [data-tooltip*="Upgrade" i].gdd-auto-soft-surface {
  background: transparent !important;
  background-color: transparent !important;
  box-shadow: none !important;
}

:root.${ROOT_CLASS} #docs-titlebar-container .gdd-auto-surface,
:root.${ROOT_CLASS} #docs-titlebar-container .gdd-auto-soft-surface,
:root.${ROOT_CLASS} #docs-titlebar-container .gdd-auto-border,
:root.${ROOT_CLASS} .docs-titlebar .gdd-auto-surface,
:root.${ROOT_CLASS} .docs-titlebar .gdd-auto-soft-surface,
:root.${ROOT_CLASS} .docs-titlebar .gdd-auto-border,
:root.${ROOT_CLASS} .docs-titlebar-buttons .gdd-auto-surface,
:root.${ROOT_CLASS} .docs-titlebar-buttons .gdd-auto-soft-surface,
:root.${ROOT_CLASS} .docs-titlebar-buttons .gdd-auto-border,
:root.${ROOT_CLASS} [aria-label*="Share" i] .gdd-auto-surface,
:root.${ROOT_CLASS} [aria-label*="Share" i] .gdd-auto-soft-surface,
:root.${ROOT_CLASS} [data-tooltip*="Share" i] .gdd-auto-surface,
:root.${ROOT_CLASS} [data-tooltip*="Share" i] .gdd-auto-soft-surface,
:root.${ROOT_CLASS} [aria-label*="Upgrade" i] .gdd-auto-surface,
:root.${ROOT_CLASS} [aria-label*="Upgrade" i] .gdd-auto-soft-surface,
:root.${ROOT_CLASS} [data-tooltip*="Upgrade" i] .gdd-auto-surface,
:root.${ROOT_CLASS} [data-tooltip*="Upgrade" i] .gdd-auto-soft-surface {
  background: transparent !important;
  background-color: transparent !important;
  border-color: transparent !important;
  box-shadow: none !important;
}

:root.${ROOT_CLASS} #docs-title-input,
:root.${ROOT_CLASS} .docs-title-input,
:root.${ROOT_CLASS} input.docs-title-input {
  background: transparent !important;
  background-color: transparent !important;
  color: var(--gdd-text) !important;
  border-color: transparent !important;
  box-shadow: none !important;
  caret-color: var(--gdd-accent) !important;
}

:root.${ROOT_CLASS} .docs-title-input-label,
:root.${ROOT_CLASS} .docs-title-input-label.gdd-auto-surface,
:root.${ROOT_CLASS} .docs-title-input-label.gdd-auto-soft-surface,
:root.${ROOT_CLASS} .docs-title-input-label-inner,
:root.${ROOT_CLASS} .docs-title-input-label-inner.gdd-auto-surface,
:root.${ROOT_CLASS} .docs-title-input-label-inner.gdd-auto-soft-surface,
:root.${ROOT_CLASS} .docs-title-untitled {
  background: transparent !important;
  background-color: transparent !important;
  color: var(--gdd-text) !important;
  border-color: transparent !important;
  box-shadow: none !important;
  outline: none !important;
}

:root.${ROOT_CLASS} .docs-titlebar-title,
:root.${ROOT_CLASS} .docs-titlebar-title-container,
:root.${ROOT_CLASS} .docs-title-outer,
:root.${ROOT_CLASS} .docs-title-inner,
:root.${ROOT_CLASS} .docs-title-container,
:root.${ROOT_CLASS} .docs-title-input-label,
:root.${ROOT_CLASS} .docs-title-input-label-inner {
  overflow: visible !important;
}

:root.${ROOT_CLASS} #docs-titlebar-container input,
:root.${ROOT_CLASS} .docs-titlebar input,
:root.${ROOT_CLASS} .docs-titlebar-container input {
  background: transparent !important;
  color: var(--gdd-text) !important;
}

:root.${ROOT_CLASS} button:focus-visible,
:root.${ROOT_CLASS} [role="button"]:focus-visible,
:root.${ROOT_CLASS} input:focus,
:root.${ROOT_CLASS} textarea:focus,
:root.${ROOT_CLASS} select:focus {
  box-shadow: var(--gdd-focus-ring) !important;
  outline: none !important;
}

:root.${ROOT_CLASS} .docs-parent-collections-container,
:root.${ROOT_CLASS} .docs-icon-img,
:root.${ROOT_CLASS} .goog-toolbar-button .docs-icon,
:root.${ROOT_CLASS} .goog-toolbar-menu-button .docs-icon,
:root.${ROOT_CLASS} .docs-material .docs-icon {
  filter: brightness(0) invert(0.88) !important;
}

:root.${ROOT_CLASS} svg,
:root.${ROOT_CLASS} path,
:root.${ROOT_CLASS} [class*="icon" i] {
  color: var(--gdd-muted-text) !important;
  fill: currentColor !important;
}

:root.${ROOT_CLASS} .docs-editor-container,
:root.${ROOT_CLASS} .docs-horizontal-ruler,
:root.${ROOT_CLASS} .docs-vertical-ruler,
:root.${ROOT_CLASS} .kix-appview-editor,
:root.${ROOT_CLASS} .kix-appview-editor-container,
:root.${ROOT_CLASS} .kix-appview-editor-tiled-background,
:root.${ROOT_CLASS} .kix-rotatingtilemanager,
:root.${ROOT_CLASS} .kix-rotatingtilemanager-content,
:root.${ROOT_CLASS} .kix-page-paginated,
:root.${ROOT_CLASS} .kix-page-compact {
  background: var(--gdd-app-background) !important;
}

:root.${ROOT_CLASS} .kix-page,
:root.${ROOT_CLASS} .kix-page-content-wrapper,
:root.${ROOT_CLASS} .kix-page-paginated .kix-page {
  background-color: var(--gdd-page) !important;
  background-image:
    linear-gradient(90deg, var(--gdd-page-line) 1px, transparent 1px),
    linear-gradient(180deg, var(--gdd-page-line) 1px, transparent 1px) !important;
  background-size: 44px 44px !important;
  box-shadow:
    inset 4px 0 0 var(--gdd-accent),
    0 0 0 1px var(--gdd-border),
    0 20px 52px var(--gdd-shadow),
    0 0 42px var(--gdd-page-glow) !important;
}

:root.${ROOT_CLASS} .kix-canvas-tile-content,
:root.${ROOT_CLASS} .kix-canvas-tile-selection,
:root.${ROOT_CLASS} .kix-canvas-tile-annotation,
:root.${ROOT_CLASS} .kix-appview-editor canvas,
:root.${ROOT_CLASS} .kix-rotatingtilemanager canvas {
  filter: var(--gdd-canvas-filter) !important;
}

:root.${ROOT_CLASS} .kix-cursor,
:root.${ROOT_CLASS} .kix-cursor-caret,
:root.${ROOT_CLASS} .kix-cursor-caret::before,
:root.${ROOT_CLASS} .kix-selection-overlay {
  border-color: var(--gdd-accent) !important;
  color: var(--gdd-accent) !important;
}

:root.${ROOT_CLASS} .docs-ruler-background,
:root.${ROOT_CLASS} .docs-ruler-face,
:root.${ROOT_CLASS} .docs-ruler-mask,
:root.${ROOT_CLASS} .docs-ruler-marker {
  background-color: var(--gdd-toolbar) !important;
  border-color: var(--gdd-border) !important;
  color: var(--gdd-muted-text) !important;
}

:root.${ROOT_CLASS} .docs-gm .goog-menuitem-disabled,
:root.${ROOT_CLASS} .docs-gm .goog-toolbar-button-disabled,
:root.${ROOT_CLASS} .docs-gm .goog-toolbar-menu-button-disabled,
:root.${ROOT_CLASS} .docs-submenuitem-disabled,
:root.${ROOT_CLASS} .docs-material-button-disabled {
  color: var(--gdd-muted-text) !important;
  opacity: 0.68 !important;
}

:root.${ROOT_CLASS} .docs-gm .modal-dialog-title,
:root.${ROOT_CLASS} .docs-gm .modal-dialog-content,
:root.${ROOT_CLASS} .docs-help-panel,
:root.${ROOT_CLASS} .docs-chat-pane,
:root.${ROOT_CLASS} .docs-comment-thread,
:root.${ROOT_CLASS} .docos-anchoreddocoview,
:root.${ROOT_CLASS} .docos-streamdocoview,
:root.${ROOT_CLASS} .docos-input-textarea,
:root.${ROOT_CLASS} .docs-sidebars,
:root.${ROOT_CLASS} .docs-sidebar,
:root.${ROOT_CLASS} .docs-sidebar *,
:root.${ROOT_CLASS} .docs-companion-app-switcher-container,
:root.${ROOT_CLASS} .docs-companion-app-switcher,
:root.${ROOT_CLASS} .companion-app-switcher,
:root.${ROOT_CLASS} .companion-app-switcher *,
:root.${ROOT_CLASS} .companion-collapser-button,
:root.${ROOT_CLASS} .companion-collapser-button *,
:root.${ROOT_CLASS} .script-application-sidebar,
:root.${ROOT_CLASS} iframe[src*="docs.google.com"] {
  background: var(--gdd-panel) !important;
  color: var(--gdd-text) !important;
  border-color: var(--gdd-border) !important;
}

:root.${ROOT_CLASS} input,
:root.${ROOT_CLASS} textarea,
:root.${ROOT_CLASS} select,
:root.${ROOT_CLASS} [contenteditable="true"] {
  background-color: var(--gdd-toolbar) !important;
  color: var(--gdd-text) !important;
  caret-color: var(--gdd-accent) !important;
}

:root.${ROOT_CLASS} #docs-title-input,
:root.${ROOT_CLASS} .docs-title-input,
:root.${ROOT_CLASS} input.docs-title-input,
:root.${ROOT_CLASS} .docs-title-input-label,
:root.${ROOT_CLASS} .docs-title-input-label-inner,
:root.${ROOT_CLASS} .docs-title-untitled,
:root.${ROOT_CLASS} #docs-titlebar-container input,
:root.${ROOT_CLASS} .docs-titlebar input,
:root.${ROOT_CLASS} .docs-titlebar-container input {
  background: transparent !important;
  background-color: transparent !important;
  color: var(--gdd-text) !important;
  border-color: transparent !important;
  box-shadow: none !important;
  caret-color: var(--gdd-accent) !important;
}

:root.${ROOT_CLASS} #docs-titlebar-container,
:root.${ROOT_CLASS} #docs-titlebar,
:root.${ROOT_CLASS} .docs-titlebar,
:root.${ROOT_CLASS} .docs-titlebar-container {
  background-color: var(--gdd-toolbar) !important;
  background-image: none !important;
  color: var(--gdd-text) !important;
  border-color: var(--gdd-border) !important;
}

:root.${ROOT_CLASS} #docs-titlebar-container *,
:root.${ROOT_CLASS} #docs-titlebar *,
:root.${ROOT_CLASS} .docs-titlebar *,
:root.${ROOT_CLASS} .docs-titlebar-container * {
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  border-color: transparent !important;
  box-shadow: none !important;
  filter: none !important;
  text-shadow: none !important;
}

:root.${ROOT_CLASS} #docs-titlebar-container,
:root.${ROOT_CLASS} #docs-titlebar,
:root.${ROOT_CLASS} .docs-titlebar,
:root.${ROOT_CLASS} .docs-titlebar-container,
:root.${ROOT_CLASS} #docs-titlebar-container *,
:root.${ROOT_CLASS} #docs-titlebar *,
:root.${ROOT_CLASS} .docs-titlebar *,
:root.${ROOT_CLASS} .docs-titlebar-container * {
  color: var(--gdd-text) !important;
  fill: currentColor !important;
}
${decorationCss}
`;
  }

  function parseRgbColor(value) {
    const match = value && value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/i);
    if (!match) return null;

    return {
      red: Number(match[1]),
      green: Number(match[2]),
      blue: Number(match[3]),
      alpha: match[4] === undefined ? 1 : Number(match[4])
    };
  }

  function isLightColor(color, threshold) {
    if (!color || color.alpha < 0.2) return false;
    return color.red >= threshold && color.green >= threshold && color.blue >= threshold;
  }

  function shouldSkipAutoTheme(element) {
    return (
      element === document.documentElement ||
      element.tagName === "SCRIPT" ||
      element.tagName === "STYLE" ||
      element.tagName === "LINK" ||
      element.tagName === "META" ||
      element.namespaceURI === "http://www.w3.org/2000/svg" ||
      element.tagName === "CANVAS" ||
      element.tagName === "IMG" ||
      element.tagName === "VIDEO" ||
      element.closest(".kix-canvas-tile-content, .kix-canvas-tile-selection, .kix-canvas-tile-annotation")
    );
  }

  function isProtectedControl(element) {
    return Boolean(
      element.closest(
        '#docs-titlebar, #docs-titlebar-container, [aria-label*="Share" i], [data-tooltip*="Share" i], [aria-label*="Upgrade" i], [data-tooltip*="Upgrade" i], .docs-titlebar, .docs-titlebar-container, .docs-titlebar-buttons'
      )
    );
  }

  function cleanupProtectedChrome(root = document) {
    root
      .querySelectorAll?.(
        '#docs-titlebar, #docs-titlebar-container, .docs-titlebar, .docs-titlebar-container, .docs-titlebar-buttons, [aria-label*="Share" i], [data-tooltip*="Share" i], [aria-label*="Upgrade" i], [data-tooltip*="Upgrade" i]'
      )
      .forEach((container) => {
        container
          .querySelectorAll?.(".gdd-auto-surface, .gdd-auto-soft-surface, .gdd-auto-border")
          .forEach((element) => {
            element.classList.remove("gdd-auto-surface", "gdd-auto-soft-surface", "gdd-auto-border");
          });
        container.classList.remove("gdd-auto-surface", "gdd-auto-soft-surface", "gdd-auto-border");
      });
  }

  function themeElementIfLight(element) {
    if (!(element instanceof Element) || shouldSkipAutoTheme(element)) return;

    if (isProtectedControl(element)) {
      element.classList.remove("gdd-auto-surface", "gdd-auto-soft-surface", "gdd-auto-border");
    }

    const styles = getComputedStyle(element);
    const background = parseRgbColor(styles.backgroundColor);
    const text = parseRgbColor(styles.color);
    const borderTop = parseRgbColor(styles.borderTopColor);
    const borderRight = parseRgbColor(styles.borderRightColor);
    const borderBottom = parseRgbColor(styles.borderBottomColor);
    const borderLeft = parseRgbColor(styles.borderLeftColor);

    if (!isProtectedControl(element) && isLightColor(background, 245)) {
      element.classList.add("gdd-auto-surface");
    } else if (!isProtectedControl(element) && isLightColor(background, 232)) {
      element.classList.add("gdd-auto-soft-surface");
    }

    if (text && text.alpha >= 0.2 && text.red < 96 && text.green < 96 && text.blue < 96) {
      element.classList.add("gdd-auto-text");
    }

    if ([borderTop, borderRight, borderBottom, borderLeft].some((border) => isLightColor(border, 220))) {
      element.classList.add("gdd-auto-border");
    }
  }

  function scanLightSurfaces(root = document.body) {
    if (!root || !document.documentElement.classList.contains(ROOT_CLASS)) return;

    cleanupProtectedChrome(document);
    if (root instanceof Element) themeElementIfLight(root);
    root.querySelectorAll?.("*").forEach(themeElementIfLight);
    cleanupProtectedChrome(document);
  }

  let scanFrame = 0;
  let pendingScanRoot = null;

  function scheduleSurfaceScan(root = document.body) {
    pendingScanRoot =
      pendingScanRoot === document.body || root === document.body ? document.body : root || document.body;

    if (scanFrame) return;

    scanFrame = requestAnimationFrame(() => {
      const rootToScan = pendingScanRoot || document.body;
      scanFrame = 0;
      pendingScanRoot = null;
      scanLightSurfaces(rootToScan);
    });
  }

  function scheduleHydrationScans() {
    [150, 500, 1200, 2500, 5000].forEach((delay) => {
      setTimeout(() => scheduleSurfaceScan(document.body), delay);
    });
  }

  function applyTheme(settings) {
    const enabled = settings[STORAGE_KEYS.enabled] !== false;
    document.documentElement.classList.toggle(ROOT_CLASS, enabled);

    if (!enabled) {
      const existingStyle = document.getElementById(STYLE_ID);
      if (existingStyle) existingStyle.remove();
      return;
    }

    const selectedTheme = getSelectedTheme(settings);
    getOrCreateStyleElement().textContent = buildCss(selectedTheme);
    scheduleSurfaceScan();
    scheduleHydrationScans();
  }

  function loadSettings() {
    chrome.storage.sync.get(
      {
        [STORAGE_KEYS.enabled]: true,
        [STORAGE_KEYS.selectedThemeId]: DEFAULT_THEME_ID,
        [STORAGE_KEYS.customTheme]: normalizeCustomTheme()
      },
      (settings) => {
        currentSettings = { ...currentSettings, ...settings };
        applyTheme(currentSettings);
      }
    );
  }

  applyTheme(currentSettings);
  loadSettings();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scheduleHydrationScans, { once: true });
  } else {
    scheduleHydrationScans();
  }

  const observer = new MutationObserver((mutations) => {
    if (!document.documentElement.classList.contains(ROOT_CLASS)) return;

    for (const mutation of mutations) {
      if (mutation.type === "attributes" && mutation.target instanceof Element) {
        scheduleSurfaceScan(document.body);
      }

      for (const node of mutation.addedNodes) {
        if (node instanceof Element) scheduleSurfaceScan(document.body);
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class", "style", "aria-label", "data-tooltip"]
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync") return;

    const nextSettings = { ...currentSettings };
    let shouldApply = false;

    Object.values(STORAGE_KEYS).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(changes, key)) {
        nextSettings[key] = changes[key].newValue;
        shouldApply = true;
      }
    });

    if (shouldApply) {
      currentSettings = nextSettings;
      applyTheme(currentSettings);
    }
  });
})();
