# Contributing to JetSet Travel

Thank you for your interest in contributing to JetSet Travel! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Test your changes:
   - Run linting: `npm run lint`
   - Build the project: `npm run build`
   - Run tests: `node --test tests/*.test.js`
   - Test locally: `npm run dev`

## Contribution Guidelines

### Code Quality
- All code must pass linting: `npm run lint`
- Must build successfully: `npm run build`
- All tests must pass
- Follow existing code style and patterns
- Write clear, descriptive commit messages

### Content & Localization
- This project supports multiple languages (EN, RU)
- When adding content, ensure bilingual consistency
- Test bilingual behavior locally
- Verify no regressions in canonical URLs and hreflang

### SEO & Structured Data
- JSON-LD must validate at https://validator.schema.org/
- Meta titles and descriptions must be within length limits
- Canonical URLs must be correct
- Sitemap must be updated if adding new URLs

### Pull Request Process

1. Create a PR with a clear, descriptive title
2. Fill out the PR template completely
3. Link any related issues
4. Include screenshots/recordings for UI changes
5. Ensure all checks pass (linting, build, tests)
6. Request review from maintainers
7. Address review feedback promptly

### Reporting Issues

- Check existing issues before creating a new one
- Use the appropriate issue template (Bug, Feature, Documentation)
- Provide detailed information and steps to reproduce
- Include environment details (OS, browser, Node version)
- Add screenshots when relevant

## Code of Conduct

Please be respectful and constructive in all interactions. We're all here to build something great together!

## Questions?

Feel free to open a discussion or issue if you have questions about contributing.