import { pgTable, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { questionsTable } from "./questions";

export const questionOptionsTable = pgTable("question-options", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  question_id: uuid("question_id")
    .notNull()
    .references(() => questionsTable.id),
  text: text("text").notNull(),
  is_correct: boolean("is_correct").default(false),
  order: integer("order").default(0),
});

export type NewQuestionOption = typeof questionOptionsTable.$inferInsert;
export type QuestionOption = typeof questionOptionsTable.$inferSelect;
