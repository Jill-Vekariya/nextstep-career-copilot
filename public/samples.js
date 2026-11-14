// Fictional examples created for this project. No real candidate data.
export const samples = [
 {name:'Software engineer',track:'tech',resume:`Alex Morgan — Software Engineer
SUMMARY
Frontend engineer with three years of experience building accessible web applications.
EXPERIENCE
Software Engineer, Northline Software, 2023–present
Built reusable React components and documented them for a team of six developers.
Reduced dashboard load time from 4.2 seconds to 2.1 seconds by splitting bundles and caching API responses.
Wrote Jest tests and reviewed pull requests across the frontend team.
PROJECTS
Built a TypeScript expense tracker with authentication and CSV export.
SKILLS
JavaScript, TypeScript, React, HTML, CSS, Jest, Git, REST APIs.
EDUCATION
BSc Computer Science, 2022.`,job:`Frontend Software Engineer
Build accessible React and TypeScript interfaces. Write automated tests with Jest and Playwright. Collaborate with design, use Git for code review, and improve application performance. Experience with CI/CD and WCAG accessibility is preferred. Explain technical choices clearly and document reusable components.`},
 {name:'Fresh graduate',track:'graduate',resume:`Priya Shah — Computer Science Graduate
SUMMARY
Recent graduate seeking a junior data analyst role. Interested in using data to explain operational patterns.
EDUCATION
BSc Computer Science, 2026.
PROJECTS
Analyzed 2,000 fictional retail transactions with Python and Pandas for a class project.
Created an Excel dashboard showing monthly sales and product categories.
Cleaned missing values and presented findings to classmates.
EXPERIENCE
College library volunteer: maintained the weekly lending spreadsheet and supported visitors.
SKILLS
Python, Pandas, Excel, basic statistics, presentation skills.`,job:`Junior Data Analyst
Use SQL, Python, Pandas and Excel to prepare datasets and investigate trends. Create Power BI dashboards, document assumptions, and communicate findings to business teams. A relevant degree and project portfolio are welcome; professional experience is not required.`},
 {name:'Career changer',track:'changer',resume:`Jordan Lee — Customer Support Team Lead
SUMMARY
Customer operations professional moving toward product operations.
EXPERIENCE
Customer Support Team Lead, BrightDesk, 2021–present.
Led a team of eight support specialists and coordinated weekly quality reviews.
Reduced first-response time from 12 hours to 5 hours by redesigning ticket triage.
Grouped recurring customer issues and shared weekly findings with product managers.
Created onboarding checklists and trained new support specialists.
SKILLS
Zendesk, Excel, stakeholder communication, process documentation, customer research.
EDUCATION
BA Communications, 2020.`,job:`Product Operations Associate
Coordinate product launches, synthesize customer feedback, document processes, and track adoption metrics. Work with product managers and customer support. Comfortable with SQL, Jira, dashboards and cross-functional communication. Demonstrated process improvement and stakeholder coordination are valued.`},
 {name:'Pharma & regulatory',track:'pharma',resume:`Sam Patel — Analytical R&D Scientist
SUMMARY
Analytical scientist with four years of experience supporting pharmaceutical development.
EXPERIENCE
Analytical R&D Scientist, Example Pharma, 2022–present.
Performed HPLC method development and validation for assay and related substances.
Prepared validation protocols and reports following approved SOPs.
Supported stability testing and documented OOS investigations with the quality team.
Reviewed chromatograms and maintained laboratory records.
SKILLS
HPLC, dissolution, method validation, analytical documentation, stability studies.
EDUCATION
MSc Pharmaceutical Analysis, 2022.`,job:`Senior Scientist — Analytical Development
Lead HPLC method development and validation following ICH Q2(R2) and ICH Q14. Prepare analytical sections for ANDA submissions, support stability programs and OOS investigations, and coordinate method transfer. Experience in data integrity, dissolution and technical documentation is required.`},
 {name:'Different career fit',track:'general',resume:`Taylor Green — Retail Sales Associate
SUMMARY
Retail associate with two years of experience helping customers and organizing store operations.
EXPERIENCE
Sales Associate, Market Square, 2024–present.
Assisted customers with product selection and handled checkout transactions.
Maintained stock records and prepared weekly inventory counts.
Coordinated weekend shift handovers with colleagues.
SKILLS
Customer service, point-of-sale systems, inventory tracking, communication.
EDUCATION
Diploma in Business Administration, 2024.`,job:`Machine Learning Engineer
Build production machine learning systems using Python, PyTorch and SQL. Deploy models on AWS, design evaluation pipelines, implement MLOps practices and monitor data drift. Three years of applied machine learning experience and strong statistics knowledge are required.`}
];
export const exampleReport={
 report:{summary:'Your React, TypeScript and performance work gives you a clear starting point for this frontend role. The resume shows useful engineering impact, but Playwright, CI/CD and WCAG are not evidenced. Make your existing work easier to assess and add those terms only when you can back them up.',category_scores:{skills:29,experience:24,impact:15,clarity:8},score:76,
 strengths:[{point:'A measurable performance improvement supports the role’s priorities.',evidence:'Reduced dashboard load time from 4.2 seconds to 2.1 seconds by splitting bundles and caching API responses.'},{point:'Your component work connects directly to reusable interface development.',evidence:'Built reusable React components and documented them for a team of six developers.'}],
 keyword_gaps:[{keyword:'Playwright',reason:'The role asks for browser-level automated tests.',action:'If you have used Playwright, add a concrete example. Otherwise, build a small end-to-end testing project.'},{keyword:'CI/CD',reason:'The description prefers delivery-pipeline experience.',action:'Document your contribution to a real pipeline if applicable; otherwise practice setting one up.'},{keyword:'WCAG',reason:'The role explicitly mentions accessibility standards.',action:'If relevant, describe an accessibility audit and the WCAG criteria you addressed.'}],
 improvements:[{priority:'High',issue:'Accessibility is claimed without a supporting example.',evidence:'Frontend engineer with three years of experience building accessible web applications.',action:'Add a truthful example of keyboard navigation, semantic HTML, or accessibility testing, including what you personally changed.'},{priority:'Medium',issue:'Testing experience could be easier to assess.',evidence:'Wrote Jest tests and reviewed pull requests across the frontend team.',action:'Specify which features or behaviors the tests covered, using only verified details.'}],
 rewrites:[{original:'Built reusable React components and documented them for a team of six developers.',revised:'Developed and documented reusable React components for a six-developer team.'}],
 interview_questions:['Walk through the changes that reduced dashboard load time from 4.2 seconds to 2.1 seconds.','How did you decide which behaviors to test with Jest?','How would you verify keyboard accessibility in a reusable React component?'],
 plan:['Put the quantified performance bullet near the top of your experience section.','Add a concrete accessibility example if you can verify it.','Create a small Playwright test suite to demonstrate the currently unevidenced testing skill.','Review every added keyword against work or projects you can explain in an interview.']},
 meta:{source:'illustrative',model:'Handwritten example — not an AI result',promptVersion:'v2',promptName:'Evidence first',language:'English',track:'tech',createdAt:'2026-11-14T00:00:00.000Z'}
};
