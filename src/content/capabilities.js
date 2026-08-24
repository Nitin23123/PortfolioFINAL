/**
 * Technical Capabilities, Stack & System Architecture.
 * Exact engineering matrix and production disciplines.
 */

export const CAPABILITIES = [
    {
        id: 'languages',
        category: 'Languages',
        code: '01',
        tagline: 'Core syntax & computational fundamentals',
        items: ['JavaScript (ES6+)', 'TypeScript', 'C++', 'SQL', 'HTML5', 'CSS3'],
    },
    {
        id: 'frontend',
        category: 'Frontend',
        code: '02',
        tagline: 'Reactive state, motion physics & 3D canvas',
        items: ['React', 'Redux Toolkit', 'Tailwind CSS', 'Framer Motion', 'Three.js'],
    },
    {
        id: 'backend',
        category: 'Backend',
        code: '03',
        tagline: 'Resilient APIs, relational stores & auth pipelines',
        items: ['Node.js', 'Express', 'REST', 'PostgreSQL', 'JWT / OAuth'],
    },
    {
        id: 'infra',
        category: 'Infra',
        code: '04',
        tagline: 'Containerization, CI/CD automated deployment & cloud hosts',
        items: ['Docker', 'GitHub Actions (CI/CD)', 'Linux', 'Vercel', 'Netlify', 'Render'],
    },
    {
        id: 'system-design',
        category: 'System design',
        code: '05',
        tagline: 'Scalable distributed patterns & data architecture',
        isArchitecture: true,
        items: [
            'Stateless auth & session strategy',
            'REST resource modelling and API versioning',
            'caching layers and CDN',
            'DB indexing, normalisation, sharding',
            'load balancing and horizontal scaling',
            'queues and async jobs',
            'consistency and CAP trade-offs',
        ],
    },
    {
        id: 'hardening',
        category: 'Hardening',
        code: '06',
        tagline: 'Defensive engineering, threat mitigation & access control',
        isSecurity: true,
        items: ['Helmet', 'rate limiting', 'express-validator', 'bcrypt', 'reCAPTCHA v3', 'RBAC'],
    },
    {
        id: 'testing-tools',
        category: 'Testing & tools',
        code: '07',
        tagline: 'Automated test coverage, API verification & design handoff',
        items: ['Jest', 'Postman', 'Git', 'Figma'],
    },
];

export const CAPABILITIES_STATEMENT =
    'Built from first principles: clean code on the client, zero-trust security on the server, and architecture engineered to scale.';
