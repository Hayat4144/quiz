import { timestampFields } from "@utils/timestamp";
import { pgEnum } from "drizzle-orm/pg-core";
import { uuid, text, varchar, uniqueIndex } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const roles = pgEnum("roles", ["student", "teacher", "parent"]);

export type Role = (typeof roles)["enumValues"][number];

export const usersTable = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    name: varchar("name", { length: 200 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    role: roles("role").notNull().default("student"),
    password: text("password").notNull(),
    ...timestampFields,
  },
  (u) => ({
    emailIdx: uniqueIndex("users_email_idx").on(u.email),
  }),
);

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
