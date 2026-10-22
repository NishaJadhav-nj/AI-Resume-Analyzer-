"""
Curated skills taxonomy used for skill extraction, ATS keyword analysis,
and job-description matching. Organized by category so the frontend can
group results meaningfully.
"""

SKILLS_DB = {
    "Programming Languages": [
        "python", "javascript", "typescript", "java", "c++", "c#", "go", "golang",
        "rust", "ruby", "php", "swift", "kotlin", "scala", "r", "matlab", "sql",
        "html", "css", "bash", "shell scripting", "perl", "dart", "objective-c",
    ],
    "Frameworks & Libraries": [
        "react", "angular", "vue", "next.js", "nuxt.js", "django", "flask",
        "fastapi", "spring", "spring boot", "express", "node.js", ".net",
        "asp.net", "rails", "laravel", "tensorflow", "pytorch", "keras",
        "scikit-learn", "pandas", "numpy", "jquery", "bootstrap", "tailwind",
        "redux", "graphql", "svelte",
    ],
    "Cloud & DevOps": [
        "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "terraform",
        "jenkins", "ci/cd", "github actions", "gitlab ci", "ansible", "puppet",
        "chef", "cloudformation", "helm", "prometheus", "grafana", "linux",
        "nginx", "load balancing", "microservices", "serverless",
    ],
    "Data & Databases": [
        "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch",
        "dynamodb", "cassandra", "oracle", "sqlite", "data warehousing",
        "etl", "airflow", "spark", "hadoop", "kafka", "snowflake", "tableau",
        "power bi", "looker", "data modeling", "big data",
    ],
    "AI / Machine Learning": [
        "machine learning", "deep learning", "nlp", "natural language processing",
        "computer vision", "neural networks", "llm", "large language models",
        "reinforcement learning", "data science", "mlops", "generative ai",
        "prompt engineering", "opencv", "hugging face", "transformers",
    ],
    "Project & Process": [
        "agile", "scrum", "kanban", "jira", "confluence", "waterfall",
        "product management", "project management", "sprint planning",
        "stakeholder management", "risk management", "pmp", "six sigma",
    ],
    "Design": [
        "figma", "sketch", "adobe xd", "photoshop", "illustrator",
        "ui/ux", "ui design", "ux research", "wireframing", "prototyping",
        "user research", "design systems",
    ],
    "Soft Skills": [
        "leadership", "communication", "teamwork", "problem solving",
        "critical thinking", "collaboration", "adaptability", "time management",
        "mentoring", "presentation skills", "negotiation", "conflict resolution",
        "decision making", "creativity",
    ],
    "Testing & QA": [
        "unit testing", "integration testing", "selenium", "cypress", "jest",
        "pytest", "test automation", "tdd", "bdd", "quality assurance",
        "manual testing", "load testing",
    ],
    "Business & Analytics": [
        "excel", "google analytics", "a/b testing", "kpi tracking",
        "financial modeling", "forecasting", "market research", "seo",
        "sem", "crm", "salesforce", "hubspot",
    ],
}

# Flat lookup: normalized skill -> category
SKILL_TO_CATEGORY = {
    skill: category
    for category, skills in SKILLS_DB.items()
    for skill in skills
}

ALL_SKILLS = sorted(SKILL_TO_CATEGORY.keys(), key=len, reverse=True)

# Strong action verbs used to score bullet-point quality
ACTION_VERBS = [
    "led", "built", "designed", "architected", "launched", "implemented",
    "optimized", "reduced", "increased", "improved", "automated", "created",
    "developed", "managed", "delivered", "drove", "spearheaded", "scaled",
    "streamlined", "negotiated", "mentored", "engineered", "deployed",
    "analyzed", "established", "pioneered", "transformed", "accelerated",
    "orchestrated", "cut", "grew", "generated", "saved", "achieved",
]

SECTION_HEADERS = {
    "summary": ["summary", "objective", "profile", "about me"],
    "experience": ["experience", "work experience", "employment history",
                   "professional experience", "work history"],
    "education": ["education", "academic background", "qualifications"],
    "skills": ["skills", "technical skills", "core competencies", "expertise"],
    "projects": ["projects", "personal projects", "key projects"],
    "certifications": ["certifications", "certificates", "licenses"],
    "awards": ["awards", "honors", "achievements"],
}
