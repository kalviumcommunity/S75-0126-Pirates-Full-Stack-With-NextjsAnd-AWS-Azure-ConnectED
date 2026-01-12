console.log("Prisma client will be generated next...");
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users:", users);

  const projects = await prisma.project.findMany({ take: 5 });
  console.log("Projects:", projects);

  const tasks = await prisma.task.findMany({ take: 5 });
  console.log("Tasks:", tasks);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
