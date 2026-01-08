export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
};

if (!env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set");
}
