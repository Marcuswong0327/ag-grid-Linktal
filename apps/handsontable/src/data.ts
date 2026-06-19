// Recruitment-agency domain modelled as three related "tables":
//   Companies (1) ──< Jobs (many) ──< Candidates (many)
// We use natural keys (company name, job title) as foreign keys so the
// dropdown editors can be sourced directly from the parent table. In a real
// PostgreSQL backend these would be integer/UUID ids.

export interface Company {
  name: string;
  industry: string;
  location: string;
}

export interface Job {
  jobId: string;
  title: string; // natural key (unique)
  company: string; // FK -> Company.name
  department: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract";
  openings: number;
  status: "Open" | "On hold" | "Closed";
}

export type Stage =
  | "Applied"
  | "Screening"
  | "Interview"
  | "Offer"
  | "Hired"
  | "Rejected";

export interface WorkHistory {
  role: string;
  company: string;
  period: string;
}

export interface Candidate {
  candidateId: string;
  firstName: string;
  lastName: string;
  name: string; // `${firstName} ${lastName}` (shown in grid)
  email: string;
  phone: string;
  location: string;
  job: string; // FK -> Job.title
  years: number;
  stage: Stage;
  expectedSalary: number;
  rating: number; // 1-5
  available: boolean;
  availability: string; // e.g. "Immediate", "2 weeks notice"
  lastContacted: string;
  nextFollowUp: string;
  hasCv: boolean;
  // ---- richer detail (shown in the profile panel) ----
  currentTitle: string;
  currentCompany: string;
  education: string;
  skills: string[];
  source: string;
  appliedDate: string;
  notes: string;
  history: WorkHistory[];
}

export const STAGES: Stage[] = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];

export const COMPANIES: Company[] = [
  { name: "Northwind Traders", industry: "Logistics", location: "Singapore" },
  { name: "Contoso Health", industry: "Healthcare", location: "Kuala Lumpur" },
  { name: "Fabrikam Bank", industry: "Finance", location: "Singapore" },
  { name: "Tailspin Studios", industry: "Gaming", location: "Bangkok" },
];

export const JOBS: Job[] = [
  {
    jobId: "JOB-101",
    title: "Senior Backend Engineer",
    company: "Northwind Traders",
    department: "Engineering",
    location: "Singapore",
    type: "Full-time",
    openings: 2,
    status: "Open",
  },
  {
    jobId: "JOB-102",
    title: "Logistics Analyst",
    company: "Northwind Traders",
    department: "Operations",
    location: "Singapore",
    type: "Full-time",
    openings: 1,
    status: "Open",
  },
  {
    jobId: "JOB-201",
    title: "Registered Nurse",
    company: "Contoso Health",
    department: "Clinical",
    location: "Kuala Lumpur",
    type: "Full-time",
    openings: 5,
    status: "Open",
  },
  {
    jobId: "JOB-202",
    title: "Health Data Scientist",
    company: "Contoso Health",
    department: "Data",
    location: "Kuala Lumpur",
    type: "Contract",
    openings: 1,
    status: "On hold",
  },
  {
    jobId: "JOB-301",
    title: "Risk Manager",
    company: "Fabrikam Bank",
    department: "Risk",
    location: "Singapore",
    type: "Full-time",
    openings: 1,
    status: "Open",
  },
  {
    jobId: "JOB-401",
    title: "Game Designer",
    company: "Tailspin Studios",
    department: "Design",
    location: "Bangkok",
    type: "Full-time",
    openings: 2,
    status: "Closed",
  },
];

function cand(
  id: number,
  first: string,
  last: string,
  job: string,
  partial: Partial<Omit<Candidate, "candidateId" | "firstName" | "lastName" | "name" | "email" | "job">>
): Candidate {
  const years = partial.years ?? 3;
  return {
    candidateId: `CND-${1000 + id}`,
    firstName: first,
    lastName: last,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@mail.com`,
    phone: partial.phone ?? `+65 ${8000 + id} ${1000 + id}`,
    location: partial.location ?? "Singapore",
    job,
    years,
    stage: partial.stage ?? "Applied",
    expectedSalary: partial.expectedSalary ?? 8000,
    rating: partial.rating ?? 3,
    available: partial.available ?? true,
    availability: partial.availability ?? (partial.available === false ? "2 weeks notice" : "Immediate"),
    lastContacted: partial.lastContacted ?? "2026-05-15",
    nextFollowUp: partial.nextFollowUp ?? "2026-06-20",
    hasCv: partial.hasCv ?? true,
    currentTitle: partial.currentTitle ?? "Associate",
    currentCompany: partial.currentCompany ?? "Acme Corp",
    education: partial.education ?? "B.Sc., NUS",
    skills: partial.skills ?? ["Communication", "Excel"],
    source: partial.source ?? "LinkedIn",
    appliedDate: partial.appliedDate ?? "2026-05-01",
    notes: partial.notes ?? "Awaiting recruiter review.",
    history:
      partial.history ??
      [
        { role: "Junior Analyst", company: "Globex", period: "2022–2024" },
        { role: partial.currentTitle ?? "Associate", company: partial.currentCompany ?? "Acme Corp", period: "2024–2026" },
      ],
  };
}

/** Fixed mock dataset — stable across reloads, ~45 candidates across all jobs. */
export const MOCK_CANDIDATES: Candidate[] = [
  // ---- Senior Backend Engineer (Northwind) ----
  cand(1, "Wei", "Tan", "Senior Backend Engineer", {
    years: 8, stage: "Interview", expectedSalary: 12000, rating: 5,
    location: "Singapore", currentTitle: "Backend Engineer", currentCompany: "Grab",
    education: "M.Sc. Computer Science, NUS",
    skills: ["TypeScript", "Node.js", ".NET", "PostgreSQL", "AWS", "Docker"],
    source: "Referral", appliedDate: "2026-04-12",
    notes: "Strong system design skills. Referred by Marcus Lee (Northwind). Final round scheduled.",
    history: [
      { role: "Software Engineer", company: "Shopee", period: "2018–2021" },
      { role: "Senior Engineer", company: "Grab", period: "2021–2026" },
    ],
  }),
  cand(2, "Priya", "Kumar", "Senior Backend Engineer", {
    years: 6, stage: "Offer", expectedSalary: 11500, rating: 4,
    location: "Singapore", currentTitle: "Tech Lead", currentCompany: "DBS",
    availability: "1 month notice",
    lastContacted: "2026-06-10", nextFollowUp: "2026-06-18",
    education: "B.Eng. Software Engineering, NTU",
    skills: [".NET", "C#", "SQL", "Azure", "Microservices", "Leadership"],
    source: "LinkedIn", appliedDate: "2026-03-28",
    notes: "Offer extended at $11,500/mo. Candidate considering counter-offer from current employer.",
    available: false,
    history: [
      { role: "Developer", company: "Accenture", period: "2019–2022" },
      { role: "Tech Lead", company: "DBS", period: "2022–2026" },
    ],
  }),
  cand(3, "Daniel", "Wong", "Senior Backend Engineer", {
    years: 5, stage: "Screening", expectedSalary: 10500, rating: 3,
    location: "Singapore", currentTitle: "Full Stack Developer", currentCompany: "Carousell",
    skills: ["TypeScript", "React", "Node.js", "PostgreSQL"],
    source: "Job Board", appliedDate: "2026-05-20",
    notes: "Good coding test score (88%). Scheduling technical interview.",
  }),
  cand(4, "Siti", "Rahman", "Senior Backend Engineer", {
    years: 4, stage: "Applied", expectedSalary: 9500, rating: 3,
    location: "Kuala Lumpur", currentTitle: "Backend Developer", currentCompany: "Petronas Digital",
    skills: ["Python", "Django", "PostgreSQL", "AWS"],
    source: "Agency", appliedDate: "2026-06-01",
    notes: "Open to relocation to Singapore. Agency fee applies.",
  }),
  cand(5, "Arjun", "Singh", "Senior Backend Engineer", {
    years: 7, stage: "Rejected", expectedSalary: 14000, rating: 2,
    location: "Singapore", currentTitle: "Principal Engineer", currentCompany: "Google",
    skills: ["Java", "Go", "Kubernetes", "GCP"],
    source: "LinkedIn", appliedDate: "2026-04-05",
    notes: "Salary expectations too high ($14k vs $12k budget). Declined after phone screen.",
    available: false,
  }),
  cand(6, "Mei", "Lim", "Senior Backend Engineer", {
    years: 3, stage: "Interview", expectedSalary: 9000, rating: 4,
    location: "Singapore", currentTitle: "Software Engineer", currentCompany: "Wise",
    skills: ["TypeScript", ".NET", "React", "SQL"],
    source: "Career Fair", appliedDate: "2026-05-15",
    notes: "Impressive career fair presentation. Second interview with hiring manager booked.",
  }),
  cand(7, "Marcus", "Lee", "Senior Backend Engineer", {
    years: 9, stage: "Hired", expectedSalary: 11800, rating: 5,
    location: "Singapore", currentTitle: "Staff Engineer", currentCompany: "Sea Group",
    availability: "Serving notice — start Jul 2026",
    lastContacted: "2026-06-01", nextFollowUp: "2026-07-01",
    education: "Ph.D. Computer Science, Stanford",
    skills: ["TypeScript", "Node.js", ".NET", "System Design", "Leadership"],
    source: "Referral", appliedDate: "2026-02-10",
    notes: "Hired! Start date 2026-07-01. Currently serving notice at Sea Group.",
    available: false,
    history: [
      { role: "Engineer", company: "Facebook", period: "2015–2019" },
      { role: "Senior Engineer", company: "Sea Group", period: "2019–2023" },
      { role: "Staff Engineer", company: "Sea Group", period: "2023–2026" },
    ],
  }),

  // ---- Logistics Analyst (Northwind) ----
  cand(8, "Grace", "Ng", "Logistics Analyst", {
    years: 2, stage: "Interview", expectedSalary: 5500, rating: 4,
    location: "Singapore", currentTitle: "Operations Analyst", currentCompany: "DHL",
    skills: ["Excel", "Data Analysis", "SQL", "Tableau"],
    source: "Job Board", appliedDate: "2026-05-08",
    notes: "Strong Excel modelling skills. Panel interview next week.",
  }),
  cand(9, "Hassan", "Ali", "Logistics Analyst", {
    years: 4, stage: "Screening", expectedSalary: 6000, rating: 3,
    location: "Singapore", currentTitle: "Supply Chain Coordinator", currentCompany: "Maersk",
    skills: ["Excel", "SAP", "Project Mgmt", "Communication"],
    source: "LinkedIn", appliedDate: "2026-05-22",
    notes: "SAP experience is a plus for Northwind's ERP migration.",
  }),
  cand(10, "Lena", "Chong", "Logistics Analyst", {
    years: 1, stage: "Applied", expectedSalary: 4500, rating: 3,
    location: "Singapore", currentTitle: "Graduate Trainee", currentCompany: "Keppel Logistics",
    education: "B.B.A. Supply Chain, SMU",
    skills: ["Excel", "Communication", "Data Analysis"],
    source: "Career Fair", appliedDate: "2026-06-05",
    notes: "Fresh graduate, eager and coachable.",
  }),
  cand(11, "Ravi", "Patel", "Logistics Analyst", {
    years: 3, stage: "Offer", expectedSalary: 5800, rating: 4,
    location: "Singapore", currentTitle: "Analyst", currentCompany: "FedEx",
    skills: ["Excel", "SQL", "Tableau", "Python"],
    source: "Referral", appliedDate: "2026-04-20",
    notes: "Offer sent. Waiting for signed letter.",
  }),
  cand(12, "Yuki", "Sato", "Logistics Analyst", {
    years: 5, stage: "Rejected", expectedSalary: 7000, rating: 2,
    location: "Bangkok", currentTitle: "Senior Analyst", currentCompany: "SCG Logistics",
    skills: ["Excel", "Data Analysis"],
    source: "Agency", appliedDate: "2026-03-15",
    notes: "Not willing to relocate from Bangkok.",
    available: false,
  }),

  // ---- Registered Nurse (Contoso Health) ----
  cand(13, "Aisha", "Yusof", "Registered Nurse", {
    years: 6, stage: "Interview", expectedSalary: 4500, rating: 5,
    location: "Kuala Lumpur", currentTitle: "Staff Nurse", currentCompany: "Pantai Hospital",
    education: "Diploma in Nursing, AIMST University",
    skills: ["Patient Care", "Communication", "Leadership"],
    source: "Referral", appliedDate: "2026-04-18",
    notes: "ICU experience. Highly recommended by Dr. Lim at Pantai.",
  }),
  cand(14, "Farah", "Hassan", "Registered Nurse", {
    years: 3, stage: "Screening", expectedSalary: 3800, rating: 4,
    location: "Kuala Lumpur", currentTitle: "Staff Nurse", currentCompany: "Gleneagles",
    skills: ["Patient Care", "Communication"],
    source: "Job Board", appliedDate: "2026-05-25",
    notes: "Paediatric ward background. Phone screen completed.",
  }),
  cand(15, "Nadia", "Devi", "Registered Nurse", {
    years: 8, stage: "Offer", expectedSalary: 5200, rating: 5,
    location: "Penang", currentTitle: "Senior Staff Nurse", currentCompany: "Island Hospital",
    education: "B.Sc. Nursing, Universiti Malaya",
    skills: ["Patient Care", "Leadership", "Training", "Communication"],
    source: "Agency", appliedDate: "2026-03-10",
    notes: "Offer accepted! Relocating from Penang. Start date TBC.",
    available: false,
  }),
  cand(16, "Chen", "Park", "Registered Nurse", {
    years: 2, stage: "Applied", expectedSalary: 3500, rating: 3,
    location: "Kuala Lumpur", currentTitle: "Junior Nurse", currentCompany: "KPJ Healthcare",
    skills: ["Patient Care", "Communication"],
    source: "LinkedIn", appliedDate: "2026-06-08",
    notes: "New registration, limited experience but strong references.",
  }),
  cand(17, "Omar", "Nair", "Registered Nurse", {
    years: 4, stage: "Hired", expectedSalary: 4200, rating: 4,
    location: "Kuala Lumpur", currentTitle: "Staff Nurse", currentCompany: "Sunway Medical",
    skills: ["Patient Care", "Emergency Care", "Communication"],
    source: "Referral", appliedDate: "2026-02-20",
    notes: "Hired and onboarded 2026-04-01.",
    available: false,
  }),
  cand(18, "Hana", "Garcia", "Registered Nurse", {
    years: 5, stage: "Interview", expectedSalary: 4800, rating: 4,
    location: "Kuala Lumpur", currentTitle: "Charge Nurse", currentCompany: "Prince Court",
    skills: ["Patient Care", "Leadership", "Communication"],
    source: "Job Board", appliedDate: "2026-05-01",
    notes: "Leadership experience managing a 12-bed ward.",
  }),
  cand(19, "Iqbal", "Tan", "Registered Nurse", {
    years: 1, stage: "Rejected", expectedSalary: 3200, rating: 2,
    location: "Jakarta", currentTitle: "Nursing Intern", currentCompany: "Siloam Hospital",
    skills: ["Patient Care"],
    source: "Career Fair", appliedDate: "2026-04-30",
    notes: "Insufficient clinical hours. Encourage to reapply in 6 months.",
  }),
  cand(20, "Sofia", "Lim", "Registered Nurse", {
    years: 7, stage: "Screening", expectedSalary: 5000, rating: 4,
    location: "Kuala Lumpur", currentTitle: "Clinical Instructor", currentCompany: "UM Medical Centre",
    education: "M.Sc. Nursing, Universiti Malaya",
    skills: ["Patient Care", "Training", "Leadership", "Communication"],
    source: "LinkedIn", appliedDate: "2026-05-18",
    notes: "Could also fit a nurse-educator track if Contoso expands training.",
  }),

  // ---- Health Data Scientist (Contoso) ----
  cand(21, "Vikram", "Cheng", "Health Data Scientist", {
    years: 5, stage: "Applied", expectedSalary: 9000, rating: 4,
    location: "Kuala Lumpur", currentTitle: "Data Scientist", currentCompany: "AIA",
    education: "M.Sc. Statistics, Universiti Malaya",
    skills: ["Python", "SQL", "Tableau", "Data Analysis", "Machine Learning"],
    source: "LinkedIn", appliedDate: "2026-06-02",
    notes: "Healthcare analytics portfolio attached. Job is on hold — holding candidate warm.",
  }),
  cand(22, "Elena", "Wong", "Health Data Scientist", {
    years: 3, stage: "Screening", expectedSalary: 7500, rating: 3,
    location: "Singapore", currentTitle: "Analytics Consultant", currentCompany: "Deloitte",
    skills: ["Python", "R", "SQL", "Excel", "Data Analysis"],
    source: "Agency", appliedDate: "2026-05-10",
    notes: "Consulting background, may lack deep healthcare domain knowledge.",
  }),
  cand(23, "Kenji", "Lee", "Health Data Scientist", {
    years: 6, stage: "Interview", expectedSalary: 9500, rating: 5,
    location: "Kuala Lumpur", currentTitle: "Senior Data Analyst", currentCompany: "IHH Healthcare",
    education: "Ph.D. Biostatistics, NUS",
    skills: ["Python", "R", "SQL", "Machine Learning", "Data Analysis"],
    source: "Referral", appliedDate: "2026-04-25",
    notes: "Published 3 papers on clinical trial analytics. Top candidate if role reopens.",
  }),
  cand(24, "Maya", "Goh", "Health Data Scientist", {
    years: 2, stage: "Applied", expectedSalary: 6500, rating: 3,
    location: "Bangkok", currentTitle: "Junior Data Analyst", currentCompany: "BDMS",
    skills: ["Python", "SQL", "Excel"],
    source: "Job Board", appliedDate: "2026-06-06",
    notes: "Junior profile. Consider for a future junior data role instead.",
  }),

  // ---- Risk Manager (Fabrikam Bank) ----
  cand(25, "Tariq", "Rahman", "Risk Manager", {
    years: 10, stage: "Interview", expectedSalary: 15000, rating: 5,
    location: "Singapore", currentTitle: "VP Risk", currentCompany: "OCBC",
    education: "MBA, INSEAD",
    skills: ["Leadership", "Data Analysis", "Excel", "Communication", "Project Mgmt"],
    source: "Referral", appliedDate: "2026-04-08",
    notes: "FRM certified. Final interview with CRO scheduled.",
  }),
  cand(26, "Leon", "Ng", "Risk Manager", {
    years: 8, stage: "Offer", expectedSalary: 13500, rating: 4,
    location: "Singapore", currentTitle: "Director, Market Risk", currentCompany: "Standard Chartered",
    skills: ["Leadership", "SQL", "Data Analysis", "Communication"],
    source: "LinkedIn", appliedDate: "2026-03-20",
    notes: "Verbal offer accepted. Background check in progress.",
    available: false,
  }),
  cand(27, "Bo", "Tan", "Risk Manager", {
    years: 6, stage: "Screening", expectedSalary: 12000, rating: 3,
    location: "Singapore", currentTitle: "Risk Analyst", currentCompany: "UOB",
    skills: ["Excel", "SQL", "Data Analysis", "Communication"],
    source: "Job Board", appliedDate: "2026-05-28",
    notes: "Solid technical skills but limited people-management experience.",
  }),
  cand(28, "Aaliyah", "Kumar", "Risk Manager", {
    years: 12, stage: "Rejected", expectedSalary: 18000, rating: 3,
    location: "Singapore", currentTitle: "Head of Risk", currentCompany: "HSBC",
    skills: ["Leadership", "Communication", "Project Mgmt"],
    source: "Agency", appliedDate: "2026-03-01",
    notes: "Overqualified and over budget. Referred to a CRO opening elsewhere.",
    available: false,
  }),
  cand(29, "Sam", "Ali", "Risk Manager", {
    years: 7, stage: "Applied", expectedSalary: 12500, rating: 4,
    location: "Singapore", currentTitle: "Senior Risk Manager", currentCompany: "DBS",
    skills: ["Leadership", "Data Analysis", "SQL", "Excel"],
    source: "LinkedIn", appliedDate: "2026-06-04",
    notes: "Awaiting initial phone screen.",
  }),
  cand(30, "Carlos", "Patel", "Risk Manager", {
    years: 9, stage: "Interview", expectedSalary: 14000, rating: 4,
    location: "Singapore", currentTitle: "Risk Manager", currentCompany: "Citibank",
    education: "CFA, M.Sc. Finance, LSE",
    skills: ["Leadership", "Data Analysis", "Excel", "Communication"],
    source: "Referral", appliedDate: "2026-04-15",
    notes: "Strong credit risk background. Competing with Leon for the offer slot.",
  }),

  // ---- Game Designer (Tailspin — closed role) ----
  cand(31, "Yuki", "Tanaka", "Game Designer", {
    years: 4, stage: "Rejected", expectedSalary: 7000, rating: 3,
    location: "Bangkok", currentTitle: "Level Designer", currentCompany: "Garena",
    skills: ["Figma", "Communication", "Project Mgmt"],
    source: "Job Board", appliedDate: "2026-02-15",
    notes: "Role closed before interview. Kept in talent pool for future openings.",
    available: false,
  }),
  cand(32, "Maya", "Sato", "Game Designer", {
    years: 6, stage: "Rejected", expectedSalary: 8500, rating: 4,
    location: "Bangkok", currentTitle: "Senior Game Designer", currentCompany: "Level Up Games",
    skills: ["Figma", "Leadership", "Communication"],
    source: "Referral", appliedDate: "2026-01-20",
    notes: "Strong portfolio but role filled internally at Tailspin.",
    available: false,
  }),
  cand(33, "Kenji", "Wong", "Game Designer", {
    years: 3, stage: "Hired", expectedSalary: 6500, rating: 5,
    location: "Bangkok", currentTitle: "Game Designer", currentCompany: "Indie Studio",
    skills: ["Figma", "Communication", "Project Mgmt"],
    source: "LinkedIn", appliedDate: "2026-01-05",
    notes: "Hired before role was marked closed. Already onboarded.",
    available: false,
  }),
  cand(34, "Elena", "Park", "Game Designer", {
    years: 2, stage: "Applied", expectedSalary: 5000, rating: 3,
    location: "Bangkok", currentTitle: "Junior Designer", currentCompany: "Sanook Games",
    skills: ["Figma", "Communication"],
    source: "Career Fair", appliedDate: "2026-03-01",
    notes: "Role closed — notified candidate. May fit upcoming mobile title.",
  }),
  cand(35, "Vikram", "Singh", "Game Designer", {
    years: 5, stage: "Screening", expectedSalary: 7500, rating: 4,
    location: "Singapore", currentTitle: "UX Designer", currentCompany: "Riot Games",
    skills: ["Figma", "Communication", "Leadership"],
    source: "Agency", appliedDate: "2026-02-28",
    notes: "UX-to-game-design transition candidate. Role closed but high potential.",
  }),

  // ---- Extra pipeline depth (mixed jobs) ----
  cand(36, "Nadia", "Lim", "Senior Backend Engineer", {
    years: 4, stage: "Applied", expectedSalary: 9800, rating: 3,
    location: "Singapore", currentTitle: "Developer", currentCompany: "GovTech",
    skills: ["TypeScript", ".NET", "React", "Azure"],
    source: "Job Board", appliedDate: "2026-06-10",
    notes: "Public sector background. Security clearance may be needed.",
  }),
  cand(37, "Farah", "Ng", "Registered Nurse", {
    years: 3, stage: "Interview", expectedSalary: 4000, rating: 4,
    location: "Kuala Lumpur", currentTitle: "Staff Nurse", currentCompany: "Assunta Hospital",
    skills: ["Patient Care", "Communication"],
    source: "Referral", appliedDate: "2026-05-12",
    notes: "Maternity ward experience. Available from July.",
  }),
  cand(38, "Hassan", "Wong", "Logistics Analyst", {
    years: 6, stage: "Interview", expectedSalary: 6500, rating: 4,
    location: "Singapore", currentTitle: "Senior Analyst", currentCompany: "YCH Group",
    skills: ["Excel", "SQL", "Python", "Data Analysis"],
    source: "LinkedIn", appliedDate: "2026-04-28",
    notes: "Built automated reporting pipeline at YCH. Strong technical fit.",
  }),
  cand(39, "Grace", "Tan", "Risk Manager", {
    years: 5, stage: "Screening", expectedSalary: 11000, rating: 3,
    location: "Singapore", currentTitle: "Risk Consultant", currentCompany: "EY",
    skills: ["Excel", "Data Analysis", "Communication", "Project Mgmt"],
    source: "Agency", appliedDate: "2026-05-30",
    notes: "Consulting rotation ending in August. Available Q3.",
  }),
  cand(40, "Daniel", "Lee", "Health Data Scientist", {
    years: 4, stage: "Screening", expectedSalary: 8200, rating: 4,
    location: "Kuala Lumpur", currentTitle: "Biostatistician", currentCompany: "Pfizer",
    education: "M.Sc. Biostatistics, Monash",
    skills: ["Python", "R", "SQL", "Data Analysis"],
    source: "Referral", appliedDate: "2026-05-05",
    notes: "Pharma trial analytics experience. Waiting for Contoso to reopen the req.",
  }),
  cand(41, "Priya", "Devi", "Registered Nurse", {
    years: 4, stage: "Offer", expectedSalary: 4100, rating: 4,
    location: "Kuala Lumpur", currentTitle: "Staff Nurse", currentCompany: "Columbia Asia",
    skills: ["Patient Care", "Communication", "Leadership"],
    source: "Job Board", appliedDate: "2026-04-22",
    notes: "Offer pending — second nurse offer alongside Nadia.",
  }),
  cand(42, "Marcus", "Goh", "Senior Backend Engineer", {
    years: 6, stage: "Screening", expectedSalary: 11000, rating: 4,
    location: "Singapore", currentTitle: "Platform Engineer", currentCompany: "Stripe",
    skills: ["TypeScript", "Node.js", "AWS", "Docker", "PostgreSQL"],
    source: "LinkedIn", appliedDate: "2026-05-18",
    notes: "Payments infrastructure experience. Technical screen booked for next week.",
  }),
  cand(43, "Aisha", "Patel", "Logistics Analyst", {
    years: 3, stage: "Applied", expectedSalary: 5200, rating: 3,
    location: "Singapore", currentTitle: "Operations Executive", currentCompany: "Ninja Van",
    skills: ["Excel", "Communication", "Data Analysis"],
    source: "Career Fair", appliedDate: "2026-06-09",
    notes: "Last-mile delivery ops background.",
  }),
  cand(44, "Wei", "Chong", "Game Designer", {
    years: 3, stage: "Applied", expectedSalary: 5800, rating: 3,
    location: "Bangkok", currentTitle: "UI Designer", currentCompany: "Astro Gaming",
    skills: ["Figma", "Communication"],
    source: "Job Board", appliedDate: "2026-03-20",
    notes: "UI-focused portfolio. Role closed — keep for art/UI hybrid roles.",
  }),
  cand(45, "Siti", "Nair", "Risk Manager", {
    years: 8, stage: "Applied", expectedSalary: 13000, rating: 4,
    location: "Singapore", currentTitle: "Assistant VP, Risk", currentCompany: "Maybank",
    skills: ["Leadership", "Data Analysis", "Excel", "Communication"],
    source: "Referral", appliedDate: "2026-06-07",
    notes: "Islamic finance risk specialisation. Interesting niche for Fabrikam's new desk.",
  }),
];

export function makeCandidates(): Candidate[] {
  return MOCK_CANDIDATES.map((c) => ({ ...c }));
}

// ---- Lookup helpers (the "relational" part) ----

/** job title -> company name (one hop). */
export function companyForJob(jobTitle: string): string {
  return JOBS.find((j) => j.title === jobTitle)?.company ?? "";
}

/** candidate.job -> job -> company (two-hop join). */
export function companyForCandidate(candidate: Candidate): string {
  return companyForJob(candidate.job);
}
