import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { usersTable } from "../users";
import { timestampFields } from "@utils/timestamp";

export const quizTable = pgTable("quizzes", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  teacher_id: uuid("teacher_id")
    .notNull()
    .references(() => usersTable.id),
  subject: varchar("subject", { length: 200 }),
  difficulty: varchar("difficulty", { length: 50 }),
  time_limit_seconds: integer("time_limit_seconds"), // null = no limit
  attempts_allowed: integer("attempts_allowed").default(1),
  show_answers_after_submission: boolean(
    "show_answers_after_submission",
  ).default(true),
  is_published: boolean("is_published").default(false),
  start_at: timestamp("start_at", { withTimezone: true }),
  end_at: timestamp("end_at", { withTimezone: true }),
  ...timestampFields,
});

export type NewQuiz = typeof quizTable.$inferInsert;
export type Quiz = typeof quizTable.$inferSelect;
