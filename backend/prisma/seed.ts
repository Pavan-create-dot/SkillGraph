import { PrismaClient, Role, SkillDifficulty } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // ─── Clean existing data (in dependency order) ──────────────────────────
  await prisma.progress.deleteMany();
  await prisma.skillEdge.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();
  await prisma.careerGoal.deleteMany();

  console.log('✅ Cleared existing data\n');

  // ─── Career Goals (2) ───────────────────────────────────────────────────
  const [fullStackGoal, dataGoal] = await Promise.all([
    prisma.careerGoal.create({
      data: {
        name: 'Full-Stack Web Developer',
        description:
          'Build complete web applications from frontend UI to backend APIs and databases. Master modern frameworks like React and Node.js to create scalable, production-ready systems.',
      },
    }),
    prisma.careerGoal.create({
      data: {
        name: 'Data Scientist',
        description:
          'Analyze complex datasets, build machine learning models, and extract actionable insights. Develop expertise in Python, statistics, and ML frameworks to solve real-world data problems.',
      },
    }),
  ]);

  console.log(`✅ Created ${2} career goals`);

  // ─── Users (1 admin + 2 users) ──────────────────────────────────────────
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash('Password123!', saltRounds);

  const [adminUser, user1, user2] = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Admin SkillGraph',
        email: 'admin@skillgraph.ai',
        password: hashedPassword,
        role: Role.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Alex Rivera',
        email: 'alex@example.com',
        password: hashedPassword,
        role: Role.USER,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jordan Chen',
        email: 'jordan@example.com',
        password: hashedPassword,
        role: Role.USER,
      },
    }),
  ]);

  console.log(`✅ Created 3 users (1 admin, 2 users)`);

  // ─── Skills (20) ────────────────────────────────────────────────────────
  const skillsData = [
    // === Programming Fundamentals ===
    {
      name: 'Programming Fundamentals',
      category: 'Programming',
      description: 'Core programming concepts: variables, loops, conditionals, and functions.',
      difficulty: SkillDifficulty.BEGINNER,
    },
    {
      name: 'Data Structures',
      category: 'Programming',
      description: 'Arrays, linked lists, stacks, queues, trees, and graphs.',
      difficulty: SkillDifficulty.INTERMEDIATE,
    },
    {
      name: 'Algorithms',
      category: 'Programming',
      description: 'Sorting, searching, dynamic programming, and complexity analysis.',
      difficulty: SkillDifficulty.INTERMEDIATE,
    },
    {
      name: 'Object-Oriented Programming',
      category: 'Programming',
      description: 'Classes, inheritance, encapsulation, and polymorphism principles.',
      difficulty: SkillDifficulty.INTERMEDIATE,
    },

    // === Web Frontend ===
    {
      name: 'HTML & CSS',
      category: 'Frontend',
      description: 'Web markup and styling fundamentals, semantic HTML and responsive design.',
      difficulty: SkillDifficulty.BEGINNER,
    },
    {
      name: 'JavaScript',
      category: 'Frontend',
      description: 'Core JS: DOM manipulation, events, async/await, and ES6+ features.',
      difficulty: SkillDifficulty.BEGINNER,
    },
    {
      name: 'TypeScript',
      category: 'Frontend',
      description: 'Static typing, interfaces, generics, and TypeScript compiler configuration.',
      difficulty: SkillDifficulty.INTERMEDIATE,
    },
    {
      name: 'React',
      category: 'Frontend',
      description: 'Component-based UI: hooks, state management, and React ecosystem.',
      difficulty: SkillDifficulty.INTERMEDIATE,
    },

    // === Backend ===
    {
      name: 'Node.js',
      category: 'Backend',
      description: 'Server-side JavaScript: event loop, streams, and core modules.',
      difficulty: SkillDifficulty.INTERMEDIATE,
    },
    {
      name: 'REST API Design',
      category: 'Backend',
      description: 'RESTful principles, HTTP methods, status codes, and API versioning.',
      difficulty: SkillDifficulty.INTERMEDIATE,
    },
    {
      name: 'Authentication & Authorization',
      category: 'Backend',
      description: 'JWT, OAuth 2.0, RBAC, session management, and security best practices.',
      difficulty: SkillDifficulty.INTERMEDIATE,
    },
    {
      name: 'GraphQL',
      category: 'Backend',
      description: 'Schema definition, resolvers, mutations, and subscriptions.',
      difficulty: SkillDifficulty.ADVANCED,
    },

    // === Database ===
    {
      name: 'SQL Fundamentals',
      category: 'Database',
      description: 'SELECT, JOIN, GROUP BY, indexes, and relational database concepts.',
      difficulty: SkillDifficulty.BEGINNER,
    },
    {
      name: 'PostgreSQL',
      category: 'Database',
      description: 'Advanced SQL, JSON support, full-text search, and performance tuning.',
      difficulty: SkillDifficulty.INTERMEDIATE,
    },
    {
      name: 'Database Design',
      category: 'Database',
      description: 'Normalization, ERD, relationships, and schema optimization.',
      difficulty: SkillDifficulty.INTERMEDIATE,
    },

    // === DevOps ===
    {
      name: 'Git & Version Control',
      category: 'DevOps',
      description: 'Branching strategies, merge conflicts, rebasing, and Git workflows.',
      difficulty: SkillDifficulty.BEGINNER,
    },
    {
      name: 'Docker',
      category: 'DevOps',
      description: 'Containers, images, Compose, and containerization best practices.',
      difficulty: SkillDifficulty.INTERMEDIATE,
    },
    {
      name: 'CI/CD Pipelines',
      category: 'DevOps',
      description: 'GitHub Actions, automated testing, build pipelines, and deployments.',
      difficulty: SkillDifficulty.ADVANCED,
    },

    // === Data Science ===
    {
      name: 'Python for Data Science',
      category: 'Data Science',
      description: 'NumPy, Pandas, data manipulation, and scientific computing.',
      difficulty: SkillDifficulty.BEGINNER,
    },
    {
      name: 'Machine Learning Fundamentals',
      category: 'Data Science',
      description: 'Supervised/unsupervised learning, model evaluation, and scikit-learn.',
      difficulty: SkillDifficulty.ADVANCED,
    },
  ];

  const skills = await Promise.all(
    skillsData.map((skill) => prisma.skill.create({ data: skill })),
  );

  const skillMap = Object.fromEntries(skills.map((s) => [s.name, s]));

  console.log(`✅ Created ${skills.length} skills`);

  // ─── Skill Edges (20 directed edges) ────────────────────────────────────
  const edgeDefinitions: [string, string][] = [
    // Programming prerequisites
    ['Programming Fundamentals', 'Data Structures'],
    ['Programming Fundamentals', 'Object-Oriented Programming'],
    ['Data Structures', 'Algorithms'],
    ['Programming Fundamentals', 'Algorithms'],

    // Frontend path
    ['HTML & CSS', 'JavaScript'],
    ['JavaScript', 'TypeScript'],
    ['JavaScript', 'React'],
    ['TypeScript', 'React'],

    // Backend path
    ['JavaScript', 'Node.js'],
    ['TypeScript', 'Node.js'],
    ['Node.js', 'REST API Design'],
    ['REST API Design', 'Authentication & Authorization'],
    ['REST API Design', 'GraphQL'],

    // Database path
    ['SQL Fundamentals', 'PostgreSQL'],
    ['SQL Fundamentals', 'Database Design'],
    ['Database Design', 'PostgreSQL'],

    // DevOps path
    ['Git & Version Control', 'CI/CD Pipelines'],
    ['Docker', 'CI/CD Pipelines'],
    ['Node.js', 'Docker'],

    // Data Science path
    ['Programming Fundamentals', 'Python for Data Science'],
    ['Python for Data Science', 'Machine Learning Fundamentals'],
  ];

  // Take exactly 20 edges (we defined 21, so slice to 20)
  const edgesTo20 = edgeDefinitions.slice(0, 20);

  const edges = await Promise.all(
    edgesTo20.map(([parent, child]) =>
      prisma.skillEdge.create({
        data: {
          parentSkillId: skillMap[parent].id,
          childSkillId: skillMap[child].id,
        },
      }),
    ),
  );

  console.log(`✅ Created ${edges.length} skill edges`);

  // ─── Sample Progress for users ───────────────────────────────────────────
  await prisma.progress.createMany({
    data: [
      {
        userId: user1.id,
        skillId: skillMap['Programming Fundamentals'].id,
        mastery: 85.0,
        status: 'COMPLETED',
      },
      {
        userId: user1.id,
        skillId: skillMap['HTML & CSS'].id,
        mastery: 70.0,
        status: 'IN_PROGRESS',
      },
      {
        userId: user1.id,
        skillId: skillMap['Git & Version Control'].id,
        mastery: 60.0,
        status: 'IN_PROGRESS',
      },
      {
        userId: user2.id,
        skillId: skillMap['Python for Data Science'].id,
        mastery: 45.0,
        status: 'IN_PROGRESS',
      },
      {
        userId: user2.id,
        skillId: skillMap['SQL Fundamentals'].id,
        mastery: 90.0,
        status: 'COMPLETED',
      },
    ],
  });

  console.log('✅ Created sample progress records');

  // ─── Summary ─────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════');
  console.log('  🎉 Seed completed successfully!');
  console.log('═══════════════════════════════════════════');
  console.log(`  👤 Users:        3 (1 admin, 2 users)`);
  console.log(`  🎯 Career Goals: 2`);
  console.log(`  🧠 Skills:       ${skills.length}`);
  console.log(`  🔗 Edges:        ${edges.length}`);
  console.log('═══════════════════════════════════════════');
  console.log('\n  Default credentials:');
  console.log('  Email:    admin@skillgraph.ai');
  console.log('  Email:    alex@example.com');
  console.log('  Email:    jordan@example.com');
  console.log('  Password: Password123!  (all accounts)');
  console.log('═══════════════════════════════════════════\n');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
