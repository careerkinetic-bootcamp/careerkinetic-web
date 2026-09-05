# CareerKinetic (Frontend)

This is the modern React frontend application for the CareerKinetic learning platform, featuring a premium glassmorphism aesthetic, rich customized page layouts, and client-side routing.


## Installation & Setup

Follow these instructions to get the project running on your local development machine.

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your system (which includes `npm`).

### 1. Install Dependencies
Open your terminal, navigate directly into the project folder (`careerkinetic-web`), and install all the necessary dependencies by running:

```bash
npm install
```

### 2. Start the Development Server
Once the installation is complete, start the active Vite local development server using:

```bash
npm run dev
```

Once the server spins up, open your browser and navigate to the `localhost` URL provided in your terminal (usually `http://localhost:5173/`).

### 3. Build for Production
When you are ready to deploy the application, generate a production-ready optimized build using:

```bash
npm run build
```

This will create an optimized frontend application bundle inside the `dist/` directory, complete with `_redirects` and `_headers` for Cloudflare Pages.

## Deployment (Cloudflare Pages)

The frontend is continuously deployed to **Cloudflare Pages** via GitHub Actions ([.github/workflows/frontend.yml](.github/workflows/frontend.yml)).

- **Production Branch (`main`)**: Deployed as the production release to [careerkinetic.com](https://careerkinetic.com).
- **Development Branch (`dev`)**: Deployed as the preview release to [dev.careerkinetic.com](https://dev.careerkinetic.com).

### Cloudflare Pages Configuration
- **SPA Routing**: Configured via `public/_redirects` (`/* /index.html 200`) so client-side routes (e.g. `/dashboard`, `/mentorship`) reload without 404s.
- **Headers & Caching**: Configured via `public/_headers`:
  - `index.html`: `Cache-Control: no-store, no-cache, must-revalidate` (instant updates on new releases).
  - `/assets/*`: `Cache-Control: public, max-age=31536000, immutable` (fingerprinted static assets).
  - Security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.

### Required GitHub Secrets
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token with Pages/Workers permissions.
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID.
- `DEV_API_URL`: Backend API endpoint for dev environment.
- `PROD_API_URL`: Backend API endpoint for prod environment.

## Technologies Used
- React 19
- Vite 8
- Cloudflare Pages & Wrangler
- Vanilla CSS (Design system, Glassmorphism, CSS Variables)
