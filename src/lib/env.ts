export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};

if (!env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set");
}

if (!env.JWT_SECRET) {
  console.warn("JWT_SECRET is not set");
}

if (!env.REFRESH_TOKEN_SECRET) {
  console.warn("REFRESH_TOKEN_SECRET is not set");
}
