import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
   provider: "postgresql",
   seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
      url: process.env.DATABASE_URL,
  }
});
