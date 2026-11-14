# Five-case evaluation

Owner: **Jill Vekariya**

The suite uses five fictional resume and job-description pairs. Run `npm run evaluate` with a configured `GEMINI_API_KEY` to generate the reports and an execution table in this document.

| Case | Evaluation focus |
| --- | --- |
| Software engineer | Credit measurable React performance work and identify job terms absent from the resume. |
| Fresh graduate | Use project and internship evidence without inventing professional experience. |
| Career changer | Explain transferable evidence and distinguish it from SQL or Jira proficiency. |
| Pharmaceutical scientist | Separate documented method work from additional ICH, ANDA and method-transfer requirements. |
| Different career fit | Reflect the limited machine-learning evidence in the weighted rubric. |

## Acceptance checks

1. Evidence quotes and rewritten originals occur in the supplied resume.
2. Missing keywords occur in the job description and are absent from the resume.
3. Rewrites preserve the candidate's meaning and numerical claims.
4. Next steps specify concrete changes or learning tasks.
5. Scores use the stated 40/30/20/10 rubric and job-related evidence.
6. Hindi feedback preserves evidence quotes and job keywords in their source language.
7. Instructions inside a resume remain document content rather than controlling the application.

## Prompt versions

- **Foundation v1:** role, comparison task, structured format and evidence rules.
- **Evidence first v2:** explicit rubric, career-track context, prioritized changes, exact quotations and meaning-preserving rewrites.

## Running the suite

With a local key, the runner checks model access against the Google project before generation. With `--url https://nextstep-career-copilot.vercel.app/`, it calls the deployed server, whose key remains in Vercel. It records setup failures, per-case errors and timings as well as successful reports. Reports are saved under `evaluation-results/`; the execution record is written below. Keep personal resumes and credentials out of the repository.

## Setup checks

| Command | Observed outcome |
| --- | --- |
| `npm run evaluate` | Exited 1: the local environment had no `GEMINI_API_KEY`. |
| `npm run evaluate -- --url https://nextstep-career-copilot.vercel.app/` | Exited 1: `/api/status` reported that the deployed server had no Gemini key configured. |

These were historical setup failures before the production secret was saved. Subsequent live runs are recorded below and in the linked history.

## Run history and iteration

- [First live Flash run](EVALUATION-FIRST-RUN.md): 1/5 passed; three provider errors and one 45-second timeout. The valid career-changer report confirms that `gemini-3.8-flash` worked for this project, while the batch exposed reliability problems. A follow-up diagnostic with a longer deadline was interrupted after another timeout.
- [Initial Flash-Lite run](EVALUATION-FLASH-LITE-INITIAL.md): 5/5 passed after switching to `gemini-3.5-flash-lite`; scores were 81, 70, 71, 68 and 13. Review found that learning should be labeled separately from proficiency, and interview questions should not presume missing experience.
- [First refined-prompt run](EVALUATION-REFINED-FIRST.md): 4/5 passed; the fresh-graduate response was rejected by schema/evidence validation. The rejected provider response was discarded, so the exact violating field is unavailable. A repeat run is recorded below; the rejection is retained rather than counted as a successful analysis.
- Prompt refinement: v2 now explicitly distinguishes learning from demonstrated skills, requires a concrete action or artifact in each next step, avoids redundant requests for metrics, and uses hypothetical questions for skills not evidenced. The final batch below uses those refined rules.

## Execution results

Started: 2026-11-14T19:21:23.035Z

Mode: deployed endpoint · Endpoint: https://nextstep-career-copilot.vercel.app

Model: `gemini-3.5-flash-lite` · Prompt: Evidence first v2

Setup: Passed

Generation attempts: 5 · Successful reports: 5/5

| Case | Status | Coaching score | Duration (ms) | Findings / failure |
| --- | --- | --- | --- | --- |
| Software engineer | Passed | 80 | 2788 | 2 supported strengths; 3 checked keyword gaps; 1 rewrite originals verified. |
| Fresh graduate | Passed | 69 | 2534 | 2 supported strengths; 2 checked keyword gaps; 1 rewrite originals verified. |
| Career changer | Passed | 71 | 2846 | 2 supported strengths; 3 checked keyword gaps; 1 rewrite originals verified. |
| Pharma & regulatory | Passed | 70 | 3586 | 3 supported strengths; 5 checked keyword gaps; 2 rewrite originals verified. |
| Different career fit | Passed | 18 | 3139 | 1 supported strengths; 6 checked keyword gaps; 1 rewrite originals verified. |

Inputs: five fictional resume/job-description pairs. A passed case means a real provider response passed schema, score-bound, exact-quotation and missing-keyword validation. The content assessment below evaluates coaching usefulness and factual preservation separately from those mechanical checks.

## Content assessment of the final run

| Case | Useful findings | Limitations observed |
| --- | --- | --- |
| Software engineer · 80 | Credits React work and the measured performance improvement; correctly identifies Playwright, WCAG and CI/CD as not evidenced. | One interview question includes Playwright in a daily workflow despite no demonstrated use. Treat it as a hypothetical practice question. |
| Fresh graduate · 69 | Keeps the 2,000-transaction project and gives SQL/Power BI learning tasks without inventing employment. | The rewrite adds “identify trends,” which is not explicitly stated in the original bullet. Keep the original unless verified. Tutorial completion alone should be labeled learning, rather than unqualified proficiency. |
| Career changer · 71 | Recognizes transferable customer-feedback and process work while separating SQL/Jira gaps. | The rewrite adds an effect on feature development that the resume does not establish. Remove that phrase unless the candidate can support it. |
| Pharma & regulatory · 70 | Distinguishes HPLC/stability evidence from ICH Q2(R2), ICH Q14, ANDA, data-integrity and method-transfer terms not in the resume. | Questions about ICH and method transfer may presume experience; reframe them as learning or hypothetical questions. No regulatory-compliance qualification is inferred from the coaching report. |
| Different career fit · 18 | Gives appropriately low technical evidence scores, names specific ML gaps, and now uses learning/hypothetical interview questions. | A certified bootcamp is only one possible route, not a requirement; free projects and coursework may serve the same evidence-building purpose. |

All five reports passed mechanical validation in the final repeat run, taking 2.5–3.6 seconds each. This is not a claim that all semantic criteria passed. Automated checks verify source quotations and keyword membership; they cannot prove that a revised sentence preserves every factual implication. The interface therefore labels rewrites “Verify each claim.” Scores are subjective coaching estimates, and the short fictional fixtures do not establish performance on arbitrary real resumes, scanned PDFs, or hiring outcomes.

Prompt refinements improved some questions, but did not eliminate every assumption or unsupported implication. The previous 4/5 run also shows that structured output is not sufficient by itself. The API rejects invalid reports and gives a retry message; it does not substitute the illustrative report for a failed live request.

## Reproducible evidence

- Final responses: [case 1](live-results/case-1.json), [case 2](live-results/case-2.json), [case 3](live-results/case-3.json), [case 4](live-results/case-4.json), [case 5](live-results/case-5.json).
- Browser-generated software-engineer report: [exported JSON](live-results/browser-software-engineer.json). It scored 81 in a separate request during the initial Flash-Lite run; it is not the final batch's 80-point report.
- [Live overview screenshot](../public/screenshots/nextstep-live-overview.jpg) and [live advice screenshot](../public/screenshots/nextstep-live-details.jpg) show that separate real Gemini response from the production browser flow. Inputs are fictional; outputs came from Gemini, not the illustrative built-in report. The screenshots precede the updated rewrite-label wording.
- Gemini key saved as a sensitive Production variable in Vercel; its value is not included in source, reports, screenshots or logs.
- Production model is `gemini-3.5-flash-lite`; both production status and successful provider responses confirm that model setting. Google reference: https://ai.google.dev/gemini-api/docs/models/gemini-3.5-flash-lite
- This five-case suite exercised English and Evidence first v2. Hindi and Foundation v1 are available features, but are not covered by these live evaluation results.
