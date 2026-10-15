import { Elysia, t } from "elysia";
import { db, users } from "./db";

const port = Number(process.env.PORT) || 3000;

export const app = new Elysia()
  .get("/", () => ({
    message: "Welcome to Elysia + Drizzle + MySQL API",
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .get("/health", () => ({
    status: "healthy",
    uptime: process.uptime(),
  }))
  .group("/users", (usersGroup) =>
    usersGroup
      .get("/", async ({ set }) => {
        try {
          const allUsers = await db.select().from(users);
          return { success: true, data: allUsers };
        } catch (error) {
          set.status = 500;
          return {
            success: false,
            message: "Failed to fetch users. Ensure MySQL database is running.",
            error: error instanceof Error ? error.message : String(error),
          };
        }
      })
      .post(
        "/",
        async ({ body, set }) => {
          try {
            await db.insert(users).values({
              name: body.name,
              email: body.email,
            });
            set.status = 201;
            return {
              success: true,
              message: "User created successfully",
            };
          } catch (error) {
            set.status = 500;
            return {
              success: false,
              message: "Failed to create user. Ensure MySQL database is running.",
              error: error instanceof Error ? error.message : String(error),
            };
          }
        },
        {
          body: t.Object({
            name: t.String({ minLength: 1 }),
            email: t.String({ format: "email" }),
          }),
        }
      )
  )
  .listen(port);

console.log(
  `🚀 Server is running at http://${app.server?.hostname}:${app.server?.port}`
);
