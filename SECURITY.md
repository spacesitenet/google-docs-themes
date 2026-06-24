# Security Policy

## Supported Versions

Security fixes are accepted for the latest version on the main branch.

## Reporting A Vulnerability

Please do not open a public issue for a suspected security vulnerability.

Instead, contact the maintainer privately or create a minimal private report with:

- A description of the vulnerability
- Steps to reproduce
- Affected browser/version
- Any relevant screenshots or proof of concept

## Security Design

Google Docs Themes is designed to be local and minimal:

- No backend service
- No analytics
- No ads
- No remote code loading
- No document content collection
- Minimal permissions: `storage` and `https://docs.google.com/*`

## Scope

Relevant issues include:

- Unintended data collection or transmission
- Unsafe remote code loading
- Permission expansion
- Cross-site scripting introduced by extension UI changes
- Unsafe handling of Chrome extension APIs
