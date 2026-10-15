import { defineConfig } from "drizzle-kit";

const user = process.env.DB_USER || "root";
const password = process.env.DB_PASSWORD ? `:${process.env.DB_PASSWORD}` : "";
const host = process.env.DB_HOST || "localhost";
const port = process.env.DB_PORT || "3306";
const database = process.env.DB_NAME || "belajar_vibe_coding";

export default defineConfig({
  dialect: "mysql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: `mysql://${user}${password}@${host}:${port}/${database}`,
  },
});
