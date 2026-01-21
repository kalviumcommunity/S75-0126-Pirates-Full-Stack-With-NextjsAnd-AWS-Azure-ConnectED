import { prisma } from "@/app/prisma";

async function main() {
  // Fetch all users
  const users = await prisma.user.findMany();
  console.log(users);
  console.log("hehe");
}

// Run the main function and handle errors
main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
