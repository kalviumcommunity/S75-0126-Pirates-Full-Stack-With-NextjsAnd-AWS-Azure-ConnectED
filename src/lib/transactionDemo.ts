import { prisma } from "./prisma";

export async function createProjectWithInitialTask() {
  try {
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const project = await tx.project.create({
        data: {
          name: "Offline Learning MVP",
        },
      });

      const task = await tx.task.create({
        data: {
          title: "Initial Setup",
          status: "PENDING",
          projectId: project.id,
        },
      });

      return { project, task };
    });

    console.log("Transaction successful:", result);
    return result;
  } catch (error) {
    console.error("Transaction failed. Rolling back.", error);
    throw error;
  }
}

export async function getOptimizedProjects() {
  return prisma.project.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });
}
