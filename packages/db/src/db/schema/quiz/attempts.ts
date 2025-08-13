import {
  pgTable,
  uuid,
  integer,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { quizTable } from ".";
import { usersTable } from "../users";
import { relations } from "drizzle-orm";
import { attemptAnswersTable } from "./attempt-answers";

export const attemptsTable = pgTable("attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  quiz_id: uuid("quiz_id")
    .notNull()
    .references(() => quizTable.id),
  user_id: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  started_at: timestamp("started_at").defaultNow().notNull(),
  submitted_at: timestamp("submitted_at"),
  duration_seconds: integer("duration_seconds"),
  score: integer("score"),
  max_score: integer("max_score"),
  ip_address: varchar("ip_address", { length: 45 }),
});

export const attemptsRelations = relations(attemptsTable, ({ one, many }) => ({
  quiz: one(quizTable, {
    fields: [attemptsTable.quiz_id],
    references: [quizTable.id],
  }),
  user: one(usersTable, {
    fields: [attemptsTable.user_id],
    references: [usersTable.id],
  }),
  answers: many(attemptAnswersTable),
}));

export type NewAttempt = typeof attemptsTable.$inferInsert;
export type Attempt = typeof attemptsTable.$inferSelect;
