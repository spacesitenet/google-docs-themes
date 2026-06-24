(function initGoogleDocsDarkmodeThemes(global) {
  const STORAGE_KEYS = {
    enabled: "gddEnabled",
    selectedThemeId: "gddSelectedThemeId",
    customTheme: "gddCustomTheme",
    favoriteThemeIds: "gddFavoriteThemeIds"
  };

  const DEFAULT_THEME_ID = "dark-mode";

  const DEFAULT_THEMES = [
    {
      id: "dark-mode",
      name: "Dark Mode",
      description: "Clean neutral dark mode with crisp Google Docs contrast.",
      colors: {
        appBackground: "#0f1115",
        toolbar: "#171a20",
        panel: "#20242c",
        page: "#15171b",
        text: "#eef1f6",
        mutedText: "#a7b0bd",
        link: "#8ab4f8",
        accent: "#8ab4f8",
        border: "#343a44",
        chip: "#2c3442",
        pageLine: "rgba(138, 180, 248, 0.10)",
        pageGlow: "rgba(138, 180, 248, 0.16)",
        selection: "rgba(138, 180, 248, 0.32)"
      }
    },
    {
      id: "deep-focus",
      name: "Deep Focus",
      description: "Low-distraction graphite with a subtle blue writing rail.",
      colors: {
        appBackground: "#0b0d10",
        toolbar: "#12161b",
        panel: "#191f26",
        page: "#101317",
        text: "#e9edf2",
        mutedText: "#9ba6b2",
        link: "#8fb7ff",
        accent: "#6ea8fe",
        border: "#2c3440",
        chip: "#222b37",
        pageLine: "rgba(110, 168, 254, 0.14)",
        pageGlow: "rgba(110, 168, 254, 0.12)",
        selection: "rgba(110, 168, 254, 0.30)"
      }
    },
    {
      id: "paper-lamp",
      name: "Paper Lamp",
      description: "Warm amber focus theme for drafting at night.",
      colors: {
        appBackground: "#18120c",
        toolbar: "#241a11",
        panel: "#302316",
        page: "#21170f",
        text: "#f3e6d1",
        mutedText: "#c4aa88",
        link: "#ffbf75",
        accent: "#f3a64a",
        border: "#4b3622",
        chip: "#3a2a1b",
        pageLine: "rgba(243, 166, 74, 0.13)",
        pageGlow: "rgba(243, 166, 74, 0.18)",
        selection: "rgba(243, 166, 74, 0.32)"
      }
    },
    {
      id: "editorial-rose",
      name: "Editorial Rose",
      description: "Magazine-style rose and ink palette with soft accents.",
      colors: {
        appBackground: "#151018",
        toolbar: "#211827",
        panel: "#2c2031",
        page: "#1b1420",
        text: "#f3eaf3",
        mutedText: "#c4a9c2",
        link: "#f0a6ca",
        accent: "#e987b4",
        border: "#4a344d",
        chip: "#3a2840",
        pageLine: "rgba(233, 135, 180, 0.13)",
        pageGlow: "rgba(233, 135, 180, 0.16)",
        selection: "rgba(233, 135, 180, 0.30)"
      }
    },
    {
      id: "forest-desk",
      name: "Forest Desk",
      description: "Muted green writing room with gentle contrast.",
      colors: {
        appBackground: "#07120e",
        toolbar: "#10201a",
        panel: "#182b23",
        page: "#0d1914",
        text: "#e5f2ea",
        mutedText: "#9db9aa",
        link: "#8de6c2",
        accent: "#64d59f",
        border: "#2b4a3d",
        chip: "#22382f",
        pageLine: "rgba(100, 213, 159, 0.12)",
        pageGlow: "rgba(100, 213, 159, 0.15)",
        selection: "rgba(100, 213, 159, 0.30)"
      }
    },
    {
      id: "blueprint",
      name: "Blueprint",
      description: "Cool technical theme with blueprint-inspired page lines.",
      colors: {
        appBackground: "#071321",
        toolbar: "#0d1d31",
        panel: "#132944",
        page: "#0b1a2c",
        text: "#e7f1ff",
        mutedText: "#9db6d1",
        link: "#8ed0ff",
        accent: "#55b8ff",
        border: "#294a70",
        chip: "#1b395d",
        pageLine: "rgba(85, 184, 255, 0.16)",
        pageGlow: "rgba(85, 184, 255, 0.16)",
        selection: "rgba(85, 184, 255, 0.32)"
      }
    },
    {
      id: "minimal-cream",
      name: "Minimal Cream",
      description: "Soft cream-on-charcoal for a warmer writing style.",
      colors: {
        appBackground: "#12110e",
        toolbar: "#1d1a15",
        panel: "#282319",
        page: "#181610",
        text: "#f4ecd8",
        mutedText: "#bdb095",
        link: "#d7b36a",
        accent: "#cab06a",
        border: "#423a29",
        chip: "#332d20",
        pageLine: "rgba(202, 176, 106, 0.11)",
        pageGlow: "rgba(202, 176, 106, 0.13)",
        selection: "rgba(202, 176, 106, 0.30)"
      }
    },
    {
      id: "oled-ink",
      name: "OLED Ink",
      description: "Near-black mode with electric blue controls.",
      colors: {
        appBackground: "#000000",
        toolbar: "#07090d",
        panel: "#0f131a",
        page: "#030405",
        text: "#f7f9ff",
        mutedText: "#aeb7c5",
        link: "#68b6ff",
        accent: "#3da5ff",
        border: "#232b36",
        chip: "#151c26",
        pageLine: "rgba(61, 165, 255, 0.12)",
        pageGlow: "rgba(61, 165, 255, 0.18)",
        selection: "rgba(61, 165, 255, 0.34)"
      }
    },
    {
      id: "zen-mist",
      name: "Zen Mist",
      description: "Quiet blue-gray palette for calm editing sessions.",
      colors: {
        appBackground: "#10161b",
        toolbar: "#17212a",
        panel: "#1f2b35",
        page: "#141c23",
        text: "#eaf1f4",
        mutedText: "#a8b8c0",
        link: "#9bd3da",
        accent: "#89c2c9",
        border: "#344753",
        chip: "#293842",
        pageLine: "rgba(137, 194, 201, 0.12)",
        pageGlow: "rgba(137, 194, 201, 0.14)",
        selection: "rgba(137, 194, 201, 0.30)"
      }
    },
    {
      id: "high-contrast",
      name: "High Contrast",
      description: "Maximum legibility with strong edges and bright focus.",
      colors: {
        appBackground: "#030507",
        toolbar: "#0d1118",
        panel: "#151d28",
        page: "#060a10",
        text: "#ffffff",
        mutedText: "#cbd6e2",
        link: "#4da3ff",
        accent: "#ffd166",
        border: "#657486",
        chip: "#253141",
        pageLine: "rgba(255, 209, 102, 0.17)",
        pageGlow: "rgba(255, 209, 102, 0.20)",
        selection: "rgba(255, 209, 102, 0.36)"
      }
    },
    {
      id: "pink-pop",
      name: "Pink Pop",
      description: "Bright pink writing room with playful bubble accents.",
      colors: {
        appBackground: "#fff1f8",
        toolbar: "#ffd6eb",
        panel: "#ffe6f2",
        page: "#fff9fc",
        text: "#421326",
        mutedText: "#8a4b68",
        link: "#c21872",
        accent: "#ff4fab",
        border: "#f5a4cc",
        chip: "#ffc2e0",
        pageLine: "rgba(255, 79, 171, 0.16)",
        pageGlow: "rgba(255, 79, 171, 0.25)",
        selection: "rgba(255, 79, 171, 0.28)",
        canvasFilter: "none",
        colorScheme: "light"
      },
      decoration: {
        pattern: "polka",
        nav: "bubbles"
      }
    },
    {
      id: "strawberry-milk",
      name: "Strawberry Milk",
      description: "Soft pink cream with tiny stationery-style dots.",
      colors: {
        appBackground: "#fff7f4",
        toolbar: "#ffe3dc",
        panel: "#fff0eb",
        page: "#fffdfb",
        text: "#40201c",
        mutedText: "#8d5b55",
        link: "#d84d67",
        accent: "#ff6f8f",
        border: "#efb2a8",
        chip: "#ffd2ca",
        pageLine: "rgba(255, 111, 143, 0.12)",
        pageGlow: "rgba(255, 111, 143, 0.22)",
        selection: "rgba(255, 111, 143, 0.25)",
        canvasFilter: "none",
        colorScheme: "light"
      },
      decoration: {
        pattern: "tinyDots",
        nav: "sun"
      }
    },
    {
      id: "mint-sticker",
      name: "Mint Sticker",
      description: "Fresh mint desk with sticker-like corner highlights.",
      colors: {
        appBackground: "#effff8",
        toolbar: "#c9f5e2",
        panel: "#ddfaef",
        page: "#fbfffd",
        text: "#12382c",
        mutedText: "#4f7d6d",
        link: "#007f68",
        accent: "#19c59a",
        border: "#91ddc5",
        chip: "#b8efd9",
        pageLine: "rgba(25, 197, 154, 0.14)",
        pageGlow: "rgba(25, 197, 154, 0.22)",
        selection: "rgba(25, 197, 154, 0.25)",
        canvasFilter: "none",
        colorScheme: "light"
      },
      decoration: {
        pattern: "gridDots",
        nav: "leaf"
      }
    },
    {
      id: "sunrise-studio",
      name: "Sunrise Studio",
      description: "Golden peach theme with warm horizon accents.",
      colors: {
        appBackground: "#fff4df",
        toolbar: "#ffd99b",
        panel: "#ffe8bd",
        page: "#fffaf0",
        text: "#3f2611",
        mutedText: "#87633d",
        link: "#bf5f00",
        accent: "#ff9f1c",
        border: "#eeb66b",
        chip: "#ffd08a",
        pageLine: "rgba(255, 159, 28, 0.14)",
        pageGlow: "rgba(255, 159, 28, 0.28)",
        selection: "rgba(255, 159, 28, 0.28)",
        canvasFilter: "none",
        colorScheme: "light"
      },
      decoration: {
        pattern: "sunbeams",
        nav: "sun"
      }
    },
    {
      id: "lavender-zine",
      name: "Lavender Zine",
      description: "Pastel purple collage feel with soft dot texture.",
      colors: {
        appBackground: "#f6f0ff",
        toolbar: "#e7d7ff",
        panel: "#f0e7ff",
        page: "#fdfbff",
        text: "#2f2146",
        mutedText: "#6d5a8d",
        link: "#7551c9",
        accent: "#9a70ff",
        border: "#c8b2f2",
        chip: "#ddccff",
        pageLine: "rgba(154, 112, 255, 0.14)",
        pageGlow: "rgba(154, 112, 255, 0.24)",
        selection: "rgba(154, 112, 255, 0.26)",
        canvasFilter: "none",
        colorScheme: "light"
      },
      decoration: {
        pattern: "confetti",
        nav: "sparkle"
      }
    },
    {
      id: "comic-notes",
      name: "Comic Notes",
      description: "Bold notebook style with halftone dots and blue ink.",
      colors: {
        appBackground: "#f7fbff",
        toolbar: "#d7ebff",
        panel: "#e8f4ff",
        page: "#ffffff",
        text: "#13233f",
        mutedText: "#506586",
        link: "#1463c2",
        accent: "#2478ff",
        border: "#9bc7f8",
        chip: "#c8e2ff",
        pageLine: "rgba(36, 120, 255, 0.16)",
        pageGlow: "rgba(36, 120, 255, 0.20)",
        selection: "rgba(36, 120, 255, 0.24)",
        canvasFilter: "none",
        colorScheme: "light"
      },
      decoration: {
        pattern: "notebook",
        nav: "halftone"
      }
    },
    {
      id: "neon-candy",
      name: "Neon Candy",
      description: "Electric pink and violet for a loud creative workspace.",
      colors: {
        appBackground: "#fff0ff",
        toolbar: "#ffc7f3",
        panel: "#ffe0fb",
        page: "#fffaff",
        text: "#3b1038",
        mutedText: "#864d83",
        link: "#c000d8",
        accent: "#ff2bd6",
        border: "#e99be4",
        chip: "#f8b8ef",
        pageLine: "rgba(255, 43, 214, 0.16)",
        pageGlow: "rgba(255, 43, 214, 0.26)",
        selection: "rgba(255, 43, 214, 0.26)",
        canvasFilter: "none",
        colorScheme: "light"
      },
      decoration: {
        pattern: "confetti",
        nav: "sparkle"
      }
    },
    {
      id: "lemon-pop",
      name: "Lemon Pop",
      description: "Sunny yellow theme with crisp graphite text.",
      colors: {
        appBackground: "#fffbe3",
        toolbar: "#fff08a",
        panel: "#fff7ba",
        page: "#fffef6",
        text: "#332b08",
        mutedText: "#766b2d",
        link: "#936900",
        accent: "#f7c600",
        border: "#e4cc63",
        chip: "#ffe36b",
        pageLine: "rgba(247, 198, 0, 0.16)",
        pageGlow: "rgba(247, 198, 0, 0.24)",
        selection: "rgba(247, 198, 0, 0.28)",
        canvasFilter: "none",
        colorScheme: "light"
      },
      decoration: {
        pattern: "sunbeams",
        nav: "sun"
      }
    },
    {
      id: "ocean-stickers",
      name: "Ocean Stickers",
      description: "Bright aqua workspace with bubbly beach-note energy.",
      colors: {
        appBackground: "#eaffff",
        toolbar: "#bdf5ff",
        panel: "#d8fbff",
        page: "#fbffff",
        text: "#0b3440",
        mutedText: "#4d7882",
        link: "#007ea7",
        accent: "#00b4d8",
        border: "#86dcec",
        chip: "#aef0fb",
        pageLine: "rgba(0, 180, 216, 0.15)",
        pageGlow: "rgba(0, 180, 216, 0.22)",
        selection: "rgba(0, 180, 216, 0.25)",
        canvasFilter: "none",
        colorScheme: "light"
      },
      decoration: {
        pattern: "polka",
        nav: "bubbles"
      }
    },
    {
      id: "grape-soda",
      name: "Grape Soda",
      description: "Purple soda-shop palette with playful sparkle accents.",
      colors: {
        appBackground: "#f2e9ff",
        toolbar: "#d9bdff",
        panel: "#eadcff",
        page: "#fcf8ff",
        text: "#2d164f",
        mutedText: "#6d5792",
        link: "#6b35d8",
        accent: "#8b5cf6",
        border: "#b99df0",
        chip: "#d1bbff",
        pageLine: "rgba(139, 92, 246, 0.15)",
        pageGlow: "rgba(139, 92, 246, 0.24)",
        selection: "rgba(139, 92, 246, 0.26)",
        canvasFilter: "none",
        colorScheme: "light"
      },
      decoration: {
        pattern: "tinyDots",
        nav: "sparkle"
      }
    },
    {
      id: "sky-doodle",
      name: "Sky Doodle",
      description: "Airy blue writing style with notebook-doodle lines.",
      colors: {
        appBackground: "#eef7ff",
        toolbar: "#cfe9ff",
        panel: "#e2f2ff",
        page: "#ffffff",
        text: "#15304f",
        mutedText: "#55708f",
        link: "#1c74d9",
        accent: "#4aa3ff",
        border: "#a8d2fb",
        chip: "#bee0ff",
        pageLine: "rgba(74, 163, 255, 0.15)",
        pageGlow: "rgba(74, 163, 255, 0.20)",
        selection: "rgba(74, 163, 255, 0.24)",
        canvasFilter: "none",
        colorScheme: "light"
      },
      decoration: {
        pattern: "notebook",
        nav: "bubbles"
      }
    },
    {
      id: "retro-arcade",
      name: "Retro Arcade",
      description: "Dark arcade purple with hot cyan and pixel-pop contrast.",
      colors: {
        appBackground: "#13051f",
        toolbar: "#251039",
        panel: "#32164b",
        page: "#1d0b2b",
        text: "#fff4ff",
        mutedText: "#c9a9d8",
        link: "#50f5ff",
        accent: "#ff4fd8",
        border: "#673585",
        chip: "#45205f",
        pageLine: "rgba(80, 245, 255, 0.14)",
        pageGlow: "rgba(255, 79, 216, 0.22)",
        selection: "rgba(80, 245, 255, 0.28)"
      },
      decoration: {
        pattern: "gridDots",
        nav: "halftone"
      }
    }
  ];

  const CUSTOM_THEME_DEFAULTS = {
    id: "custom",
    name: "Custom Theme",
    description: "Your saved Google Docs dark mode colors.",
    colors: { ...DEFAULT_THEMES[0].colors }
  };

  function getThemeById(themeId) {
    return DEFAULT_THEMES.find((theme) => theme.id === themeId) || DEFAULT_THEMES[0];
  }

  function normalizeCustomTheme(customTheme) {
    return {
      ...CUSTOM_THEME_DEFAULTS,
      colors: {
        ...CUSTOM_THEME_DEFAULTS.colors,
        ...(customTheme && customTheme.colors ? customTheme.colors : customTheme || {})
      }
    };
  }

  global.GoogleDocsDarkmodeThemes = {
    STORAGE_KEYS,
    DEFAULT_THEME_ID,
    DEFAULT_THEMES,
    CUSTOM_THEME_DEFAULTS,
    getThemeById,
    normalizeCustomTheme
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
