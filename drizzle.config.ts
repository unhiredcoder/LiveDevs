import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DB_URL!,
  },
  verbose: true,
  strict: true,
} as any); // Use 'as any' temporarily to suppress errors
