# Google Docs Themes

Dark mode, focus themes, and custom writing styles for Google Docs.

Google Docs Themes is a Manifest V3 Chrome extension that lets users restyle Google Docs with polished dark themes, bright/fun writing themes, favorites, and custom color controls.

## Features

- Dark mode for Google Docs documents and the Docs home page
- A growing library of built-in themes, including focus themes and playful color palettes
- Favorite themes for quick access
- Custom theme editor with saved colors
- Live theme updates through `chrome.storage.sync`
- No account, backend, analytics, or tracking
- No build step required

## Install Locally

1. Clone or download this repository.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select this project folder.
6. Open or refresh Google Docs.

## Package For Chrome Web Store

Run the packaging script from the project root:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/package.ps1
```

This creates `google-docs-themes-1.0.0.zip`, containing only the extension files needed for upload.

## Project Structure

```text
manifest.json          Chrome extension manifest
src/themes.js          Built-in theme catalog and shared storage keys
src/content.js         Google Docs theming content script
popup/                 Popup UI for theme selection and custom colors
icons/                 Extension icons
scripts/package.ps1    Store upload package script
```

## Privacy

This extension stores only theme preferences in Chrome sync storage. It does not collect, transmit, sell, or share user data.

See `PRIVACY.md` for the full privacy statement.

Hosted privacy policy:

```text
https://spacesitenet.github.io/google-docs-themes/privacy.html
```

## Website

The lightweight project site lives in `site/` and is deployed with GitHub Pages through `.github/workflows/pages.yml`.

After pushing to GitHub, enable Pages with **GitHub Actions** as the source in the repository settings.

## Contributing

Contributions are welcome. Please keep changes focused, test in Google Docs, and avoid adding dependencies unless they are clearly necessary.

## License

MIT License. See `LICENSE`.
