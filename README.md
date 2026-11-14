# NextStep — AI Career Copilot

A responsive resume coaching product built for the ApnoAI advanced assignment. It compares a resume with a target job description using Google Gemini and gives evidence-backed feedback.

Live app: https://nextstep-career-copilot.vercel.app/

Source: https://github.com/Jill-Vekariya/nextstep-career-copilot

**Current live state:** deployed and publicly accessible in sample mode. Configure the Gemini server secret and redeploy to activate real analysis. The initial deployment was uploaded directly to Vercel; automatic Git deployments require linking this repository to the Vercel project.

## Advanced features

- **PDF/TXT import:** self-hosted PDF.js extracts text locally, up to 5 MB and 15 pages. Scanned/image-only PDFs need OCR, which is not included.
- **Prompt versioning:** Foundation v1 and Evidence first v2; prompts live in `lib/prompts.js`, never supplied by the client.
- **Optional local report history:** up to 10 reports, including quoted excerpts; never saves original resume/JD input. Per-report and bulk deletion.
- **English/Hindi feedback:** original evidence and job keywords stay in their source language.
- **Report export:** Print / Save as PDF through the browser, plus JSON download.
- **Dark mode**, responsive layout, career-track presets, five fictional resume/JD fixtures and a clearly labeled handwritten sample report.
- **Server-side Gemini key**, JSON schema, nested response validation, quote/keyword verification, bounded inputs, timeouts and friendly errors.

The coaching score is a weighted model estimate (skills 40 + experience 30 + impact 20 + clarity 10), **not a real ATS score or hiring prediction**. No achievements or metrics should be invented. Verify every suggestion yourself.

## Run locally

Requires Node.js 22 or later and npm. Node 24 was used for verification.

```sh
npm ci
npm run build
cp .env.example .env.local
# Edit .env.local with your own key; never commit this file.
npm run dev
```

Open the localhost URL/port for your environment (default port 3000). You can explore the illustrative sample without a key. PDF.js assets are generated during `npm run build`.

```sh
npm test       # backend validation and mocked-provider checks
npm run evaluate  # five live fictional fixtures; requires a real key
```

Live evaluation output is written to ignored `evaluation-results/`. Review scores, specificity, unsupported claims, truthful rewrites and language quality manually. Do not represent mocked tests as live Gemini tests.

## Deploy on Vercel + GitHub

1. Create a GitHub repository named `ai-career-copilot-girish`. Upload the **contents** of this project (not its parent folder, `node_modules`, `.env.local`, `.vercel` or test output). The provided ZIP includes `package.json`, `vercel.json`, `api/`, `lib/`, `public/`, scripts and tests.
2. In Vercel, choose **Add New → Project**, import that repository, and select **Other** for the framework. `vercel.json` supplies `npm run build` and `public` as the output directory; `api/*.js` provides Node functions.
3. Add `GEMINI_API_KEY` as a **Secret** for Production (and a separate Preview value if your policy requires one). Enter the key directly in Vercel, not in ChatGPT or browser HTML.
4. Optionally set `GEMINI_MODEL` as Config to a `generateContent`-capable model available in your AI Studio project. Default: `gemini-3.8-flash`. Availability, quotas and free-tier eligibility vary by project/model. This project's default model has not been tested with your account.
5. Deploy. For secret changes after deployment, redeploy. Open the live URL, ensure the top bar says Gemini configured, and run a fictional sample. That status only confirms a key exists; a successful analysis confirms provider access.
6. Run five live evaluations (or use the five sample pairs in the UI), record your observations in `docs/EVALUATION.md`, and take screenshots. Finally test the deployed URL in a private browser session.

**CLI alternative**, once authenticated to your own Vercel account: inspect the intended project/team, link this exact project, add the secret using Vercel's secure prompt, and deploy with `vercel --prod`. Do not pass secrets as command arguments. See current Vercel CLI help for flags.

## Security and privacy

`process.env.GEMINI_API_KEY` is used **only in server code**. Writing it into static HTML would neither work correctly nor protect it. The browser talks to `/api/analyze`; only the server talks to Google. No API key belongs in the public repository or downloaded report.

PDFs are parsed on the device. Clicking Analyze sends extracted resume text and the job description to this app's server and Google Gemini. Remove unnecessary personal details, use resumes with permission, and review your Gemini account's terms before submitting sensitive data. The app does not intentionally persist raw input or log it, but hosting/AI providers process requests under their own policies. Saved reports contain excerpts and must be deleted on shared devices.

The memory-based request limit is **best effort per function instance**, not a distributed abuse barrier. For a public launch, configure Vercel Firewall/rate limiting and provider spending/quota controls. Origin checks are defense in depth, not authentication. There is no account system or cross-device history. Content is rendered with `textContent`, not model HTML.

## Project layout

- `public/`: frontend, sample fixtures and local PDF.js assets.
- `api/analyze.js`: Vercel server endpoint.
- `api/status.js`: configuration presence only; no secrets returned.
- `lib/`: prompts, schema, validation and Gemini REST integration.
- `tests/`: Node built-in tests using a mocked provider.
- `docs/`: evaluation and submission notes.

## Verified and pending

See `docs/VERIFICATION.md`. This package does not contain a Gemini API key. Live AI and five real-resume evaluations still require an owner-provided key and human review. Vercel production deployment and anonymous access have been verified.

## Official references

- Gemini API: https://aistudio.google.com/api-reference/generate-content/generate-content
- Gemini models: https://aistudio.google.com/docs/models
- API key setup: https://aistudio.google.com/apikey
- Vercel environment variables: https://vercel.com/docs/environment-variables
- Vercel Node.js functions: https://vercel.com/docs/functions/runtimes/node-js
- Vercel project import: https://vercel.com/new

PDF.js is Apache-2.0; its license is copied to `public/vendor/PDFJS-LICENSE.txt` during build.
