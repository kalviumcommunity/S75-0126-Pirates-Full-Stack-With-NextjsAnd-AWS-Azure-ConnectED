import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkData() {
  console.log("🔍 Checking database...\n");
  
  const userCount = await prisma.user.count();
  console.log(`📊 Total Users: ${userCount}`);
  
  const projectCount = await prisma.project.count();
  console.log(`📊 Total Projects: ${projectCount}`);
  
  const taskCount = await prisma.task.count();
  console.log(`📊 Total Tasks: ${taskCount}\n`);
  
  if (userCount > 0) {
    const users = await prisma.user.findMany({ take: 3 });
    console.log("👥 Sample Users:", JSON.stringify(users, null, 2));
  } else {
    console.log("❌ No data found in database!");
  }
}

checkData()
  .catch((error) => {
    console.error("❌ Error:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });