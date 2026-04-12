import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clean existing data (in dependency order)
  await prisma.blacklistedToken.deleteMany();
  await prisma.interviewQuestion.deleteMany();
  await prisma.interviewSession.deleteMany();
  await prisma.user.deleteMany();

  console.log('⚡ Cleared existing data\n');

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash('Password123!', saltRounds);

  const sampleResumeText = `
Alex Rivera
Software Engineering Student | Full-Stack Web Development
Email: alex@example.com

SUMMARY
Enthusiastic Computer Science student with experience building full-stack web applications
using React, Node.js, Express, and PostgreSQL. Strong problem-solving foundation in
Data Structures and Algorithms.

EDUCATION
B.Tech in Computer Science & Engineering | Expected Graduation: 2026
GPA: 8.8 / 10.0

SKILLS
Programming: JavaScript, TypeScript, Python, C++
Frontend: React, HTML5, CSS3, TailwindCSS, Redux Toolkit
Backend: Node.js, Express.js, REST APIs, JWT
Database: PostgreSQL, MongoDB, Prisma ORM
Tools: Git, Docker, Postman, Linux

PROJECTS
SkillGraph AI Platform | React, Node.js, Express, PostgreSQL, Gemini AI
- Developed a full-stack career intelligence platform analyzing candidate profile readiness.
- Integrated AI-powered mock interview evaluator using Gemini API.

E-Commerce Microservices App | Node.js, Express, MongoDB, Docker
- Built scalable REST endpoints handling authentication, inventory, and order processing.
  `;

  const sampleParsedResume = {
    summary: 'Enthusiastic CS student with full-stack web dev experience using React, Node.js, PostgreSQL.',
    skills: ['JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Git'],
    education: ['B.Tech in Computer Science & Engineering (2026 graduate)'],
    experience: ['Full-stack Developer Projects'],
    projects: ['SkillGraph AI Platform', 'E-Commerce Microservices App'],
    certifications: [],
  };

  const sampleAnalysis = {
    summary: 'Candidate demonstrates strong web development fundamentals with modern full-stack skills.',
    strengths: [
      'Hands-on full-stack project experience',
      'Solid database and API design skills',
      'Good language coverage (JS/TS/Python)',
    ],
    weaknesses: [
      'Limited cloud deployment mentions',
      'No unit test coverage noted in project section',
    ],
    missingSkills: ['System Design Concepts', 'Jest/Vitest Unit Testing', 'CI/CD Pipelines'],
    suggestions: [
      'Add quantifiable metric impacts in projects (e.g., improved load time by 30%)',
      'Highlight automated testing experience',
      'Include a CI/CD or deployment section',
    ],
  };

  await Promise.all([
    prisma.user.create({
      data: {
        name: 'Admin SkillGraph',
        email: 'admin@skillgraph.ai',
        password: hashedPassword,
        role: Role.ADMIN,
        targetRole: 'Senior SDE',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Alex Rivera',
        email: 'alex@example.com',
        password: hashedPassword,
        role: Role.USER,
        targetRole: 'Full-Stack Developer',
        resumeText: sampleResumeText,
        resumeParsed: sampleParsedResume,
        resumeAnalysis: sampleAnalysis,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jordan Chen',
        email: 'jordan@example.com',
        password: hashedPassword,
        role: Role.USER,
        targetRole: 'Backend Engineer',
      },
    }),
  ]);

  console.log('✅ Created 3 sample users (1 admin, 2 candidates)');

  console.log('\n-------------------------------------------');
  console.log('  🎉 Seed completed successfully!');
  console.log('-------------------------------------------');
  console.log('  Default credentials:');
  console.log('  Email:    alex@example.com / jordan@example.com / admin@skillgraph.ai');
  console.log('  Password: Password123!');
  console.log('-------------------------------------------\n');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
