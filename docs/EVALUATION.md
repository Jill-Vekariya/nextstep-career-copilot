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

The runner first checks that the selected model supports `generateContent` for the configured Google project. It saves per-case JSON under `evaluation-results/` and writes the execution time, model, score and validation outcome below. Keep personal resumes and credentials out of the repository.
