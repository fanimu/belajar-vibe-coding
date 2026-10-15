import { Elysia, t } from "elysia";
import { registerUser } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api/users" }).post(
  "/",
  async ({ body, set }) => {
    try {
      await registerUser(body);
      set.status = 200;
      return { data: "OK" };
    } catch (error: any) {
      if (error?.message === "Email sudah terdaftar") {
        set.status = 400;
        return { error: "Email sudah terdaftar" };
      }

      set.status = 500;
      return {
        error: error instanceof Error ? error.message : "Internal Server Error",
      };
    }
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      email: t.String({ minLength: 1 }),
      password: t.String({ minLength: 1 }),
    }),
  }
);
