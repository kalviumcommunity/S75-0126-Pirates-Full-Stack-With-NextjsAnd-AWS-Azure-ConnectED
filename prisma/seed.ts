import { PrismaClient } from '@prisma/client';
// import * as bcrypt from 'bcrypt'; // Optional: if you want to hash passwords

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  // Using upsert instead of createMany allows you to run this multiple times 
  // without failing on "Unique constraint" errors for the email.
  const passwordHash = "password123"; // In a real app, use: await bcrypt.hash('password123', 10);

  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      name: 'Alice',
      email: 'alice@example.com',
      password: passwordHash,
      projects: {
        create: [
          {
            name: 'Website Redesign',
            description: 'Updating the hero section and footer',
            tasks: {
              create: [
                { title: 'Draft new layout', status: 'COMPLETED' },
                { title: 'Fix CSS bugs', status: 'IN_PROGRESS' },
              ],
            },
          },
        ],
      },
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      name: 'Bob',
      email: 'bob@example.com',
      password: passwordHash,
      projects: {
        create: [
          {
            name: 'Mobile App API',
            description: 'Building the backend for the iOS app',
            tasks: {
              create: [
                { title: 'Setup Auth', status: 'TODO' },
              ],
            },
          },
        ],
      },
    },
  });

  console.log({ alice, bob });
  console.log('Seed data inserted successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });