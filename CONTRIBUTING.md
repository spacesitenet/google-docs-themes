# Contributing

Thanks for your interest in improving Google Docs Themes.

## Local Setup

No dependency install is required.

1. Load the repository as an unpacked Chrome extension.
2. Open or refresh Google Docs.
3. Make your changes.
4. Reload the extension from `chrome://extensions`.

## Development Guidelines

- Keep the extension dependency-free unless a dependency is clearly justified.
- Avoid adding a build step unless it solves a real maintenance problem.
- Keep Google Docs CSS overrides as narrow as possible.
- Prefer color/background/border changes over layout changes.
- Do not collect or transmit user data.
- Do not commit packaged `.zip` or `.crx` files.

## Testing Checklist

Before opening a pull request:

- Run `node --check src/themes.js src/content.js popup/popup.js` if Node is installed.
- Run `powershell -ExecutionPolicy Bypass -File scripts/package.ps1`.
- Load the unpacked extension in Chrome.
- Test the Docs home page.
- Test an open Google Docs document.
- Test theme switching, favorites, and custom theme saving.
- Open Docs menus and side panels to check dynamic UI surfaces.

## Pull Requests

Please keep pull requests focused. Include screenshots or a short screen recording for UI/theme changes when possible.
