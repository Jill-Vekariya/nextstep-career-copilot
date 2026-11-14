# Five-case evaluation worksheet

The included fixtures are fictional and were created for this project. They are **not five real resumes** and have not been submitted to Gemini without an owner-provided key.

| Case | Main evaluation question | Live run | Human review |
| --- | --- | --- | --- |
| Software engineer | Does it credit quantified React performance work and flag only genuinely missing job terms? | Pending | Pending |
| Fresh graduate | Does it value projects without inventing professional experience? | Pending | Pending |
| Career changer | Does it explain transferable evidence without claiming SQL/Jira proficiency? | Pending | Pending |
| Pharmaceutical scientist | Does it distinguish method work from unevidenced ICH/ANDA/method-transfer experience? | Pending | Pending |
| Different career fit | Does the rubric remain appropriately low where machine-learning evidence is absent? | Pending | Pending |

For each output, review:

1. All evidence quotes and rewritten originals occur in the resume.
2. Missing keywords occur in the JD and are absent from the resume; adding them is conditional on truth.
3. Rewrites preserve achievements, meaning and numerical values.
4. Actions name specific changes rather than generic advice.
5. The score reflects written evidence, with no judgments based on personal traits.
6. The Hindi option changes prose language while preserving quoted evidence.
7. Instructions embedded inside the resume cannot override the system prompt.

Optional live runner: configure `.env.local`, then run `npm run evaluate`. It writes JSON results for the fictional fixtures to an ignored folder. An automatic pass validates structure and evidence, not overall coaching quality. With permission, also test five real anonymized resumes for the assignment and record actual findings/screenshots. Never publish those resumes in GitHub.

## Prompt iteration log

- **v1 Foundation:** baseline role/task/format/rules, evidence requirements and concise coaching.
- **v2 Evidence first:** added weighted scoring, career context, exact evidence, limits on outputs, conditional keyword suggestions and meaning-preserving rewrites.
- No measured live quality improvement is claimed; compare versions after the API is configured.
