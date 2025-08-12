import { pgTable, integer, text, boolean, uuid } from "drizzle-orm/pg-core";
import { attemptsTable } from "./attempts";
import { questionsTable } from "./questions";
import { questionOptionsTable } from "./question-options";

export const attemptAnswersTable = pgTable("attempt_answers", {
  id: uuid("id").defaultRandom().primaryKey(),
  attempt_id: uuid("attempt_id")
    .notNull()
    .references(() => attemptsTable.id),
  question_id: uuid("question_id")
    .notNull()
    .references(() => questionsTable.id),
  selected_option_id: uuid("selected_option_id").references(
    () => questionOptionsTable.id,
  ), // null for text answers
  text_answer: text("text_answer"), // for short answers
  is_correct: boolean("is_correct"),
  points_awarded: integer("points_awarded").default(0),
});

export type NewAttemptAnswer = typeof attemptAnswersTable.$inferInsert;
export type AttemptAnswer = typeof attemptAnswersTable.$inferSelect;
