# Verification record — 14 November 2026

**Story:** A candidate imports/pastes a resume, adds a job description, selects a prompt/track/language, and sends text through `/api/analyze` to Gemini; validated JSON is rendered as a report that can be optionally saved locally and exported.

| Boundary/check | Status | Evidence |
| --- | --- | --- |
| Static build | Passed | `npm run build`; PDF.js and worker copied locally |
| Backend checks | Passed | `npm test`: 23 passed, 0 failed; five fictional inputs plus invalid inputs, schema/evidence checks, mocked success/errors, missing key and rate window |
| Dependency audit | Passed | `npm audit --omit=dev`: 0 vulnerabilities after upgrading PDF.js to 6.5.438 |
| UI initial page | Passed | Browser showed input controls, configuration state, privacy text and sample mode |
| Missing-key UI flow | Passed | Submit returned the clear server-key configuration message; controls became available again |
| Prompt selection | Passed | Foundation selection returned to Resume studio with v1 selected |
| Sample response rendering | Passed | Handwritten illustrative report rendered rubric, strengths, gaps, edits, rewrite, plan and interview questions |
| Local PDF extraction | Passed | Generated one-page fictional resume PDF imported successfully, with 639 extracted characters visible in the resume field |
| Real Gemini API | Pending | No owner-provided Gemini key; mocked-provider checks are not live AI verification |
| Saved live report history | Pending live flow | Implemented opt-in history; persistence of a real provider result requires configured live AI |
| Hindi feedback quality | Pending | Implemented language instruction; requires live provider and human review |
| PDF report export | Implemented, not print-output inspected | Uses browser Print / Save as PDF and print CSS |
| Five real resumes | Pending | Only fictional test fixtures are included; use permissioned/anonymized real resumes for assignment evaluation |
| GitHub publication | Source repository | https://github.com/Jill-Vekariya/nextstep-career-copilot |
| Vercel production | Passed | Deployment dpl_C72hnfuPLEZdU4yK5Tu6BkwPV6oV reached READY; anonymous HTTP checks returned 200 for HTML, frontend JS, PDF.js, worker and status |
| Live missing-key response | Passed | Anonymous POST to the deployed API returned HTTP 503 with configuration instructions |

The initial parser version had an audit finding. It was replaced with 6.5.438, and its cleanup call was updated and checked with a browser PDF import. No live coaching quality, real ATS behavior, mentor acceptance or bonus XP is claimed.
