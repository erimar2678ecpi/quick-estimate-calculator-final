# Quick Estimate Calculator

This React project is a transportation cost estimator built for a final-week guided practice on bug fixing, debugging, visual design, and deployment.

## What Changed

- Increased the global type scale and rebuilt the layout so the text is easier to read on desktop and mobile.
- Redesigned the interface with a stronger hero section, polished cards, improved spacing, clearer contrast, and a more presentation-ready chart area.
- Fixed a stale-data bug where the previous estimate stayed visible after the user changed the service hours.
- Prevented accidental duplicate history entries by disabling the save action after the current estimate is stored.
- Split `Reset Form` from `Clear History` so users can correct the current input without losing saved estimates.
- Improved accessibility with connected labels, helper text, and error messaging on inputs.

## Bug Fixing Process Used

1. Reproduced the issue by testing the calculator flow manually.
2. Identified the cause in component state and event handling.
3. Applied a focused fix in `App.js` and supporting components.
4. Updated tests in `src/App.test.js` to cover the corrected behavior.
5. Rebuilt the UI to address teacher feedback about small font sizes and overall aesthetics.

## Debugging Techniques Practiced

- Input validation to catch empty, invalid, and oversized hour values.
- State inspection while tracing user actions such as calculate, reset, save, and clear history.
- Component-level testing with React Testing Library.
- Browser developer tools for layout inspection, responsive checks, and console review during local testing.

## Available Scripts

In the project directory, run:

### `npm start`

Starts the development server at `http://localhost:3000`.

### `npm test -- --watch=false`

Runs the test suite one time instead of watch mode.

### `npm run build`

Creates a production build in the `build` folder.

## Deployment Setup

This project is configured for both GitHub Pages and Netlify.

### GitHub Pages

Repository: `erimar2678ecpi/quick-estimate-calculator-final`

Live URL:

- `https://erimar2678ecpi.github.io/quick-estimate-calculator-final/`

The project includes:

- `homepage` in `package.json` set to the correct GitHub Pages path
- `.github/workflows/deploy-pages.yml` to build and deploy automatically on every push to `main`

GitHub Pages deployment process:

1. Push the latest code to the `main` branch.
2. GitHub Actions installs dependencies using Node 22.
3. The app is built with `npm run build`.
4. The `build` folder is published to GitHub Pages automatically.

### Netlify

1. Push the project to GitHub.
2. In Netlify, choose **Add new site** and import the GitHub repository.
3. Confirm these settings:
   - Build command: `npm run build`
   - Publish directory: `build`
4. Deploy the site.

The redirect rule in `netlify.toml` sends all routes to `index.html`, which is the standard SPA setup.

## Recommended Environment

Create React App works best on active LTS Node versions. This project now declares support for:

- Node `20.x`
- Node `22.x`

## Project Files

- `src/App.js`: estimator workflow, validation, history, and chart data.
- `src/App.css`: full visual redesign and responsive styling.
- `src/components/Textfield.js`: accessible input component with helper and error text.
- `src/App.test.js`: tests for rendering, validation, calculation, and saved-estimate behavior.
- `netlify.toml`: deployment configuration for Netlify.
