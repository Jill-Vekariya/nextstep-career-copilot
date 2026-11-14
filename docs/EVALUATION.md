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

Both checks stopped before generation. The five cases therefore have no provider-generated scores, and no live-analysis screenshots have been captured for this run.

## Execution results

Started: 2026-11-14T15:11:50.180Z

Mode: deployed endpoint · Endpoint: https://nextstep-career-copilot.vercel.app

Model: `gemini-3.8-flash` · Prompt: Evidence first v2

Setup: Blocked: The deployed server has no GEMINI_API_KEY configured.

Generation attempts: 0 · Successful reports: 0/5

| Case | Status | Coaching score | Duration (ms) | Findings / failure |
| --- | --- | --- | --- | --- |
| Software engineer | Not run | — | — | Blocked: The deployed server has no GEMINI_API_KEY configured. |
| Fresh graduate | Not run | — | — | Blocked: The deployed server has no GEMINI_API_KEY configured. |
| Career changer | Not run | — | — | Blocked: The deployed server has no GEMINI_API_KEY configured. |
| Pharma & regulatory | Not run | — | — | Blocked: The deployed server has no GEMINI_API_KEY configured. |
| Different career fit | Not run | — | — | Blocked: The deployed server has no GEMINI_API_KEY configured. |

Inputs: five fictional resume/job-description pairs. A passed case means a real provider response passed schema, score-bound, exact-quotation and missing-keyword validation. Coaching usefulness and factual preservation still need a separate content assessment.
