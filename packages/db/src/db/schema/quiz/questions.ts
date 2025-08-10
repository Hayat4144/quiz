import { uuid, text, integer, varchar } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { quizTable } from ".";

export const questionsTable = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  quiz_id: uuid("quiz_id")
    .notNull()
    .references(() => quizTable.id),
  question: text("question").notNull(),
  type: varchar("type", { length: 50 }).notNull().default("mcq"), // 'mcq' | 'short' | 'tf'
  explanation: text("explanation"),
  points: integer("points").default(1),
  order: integer("order").default(0),
});

export type Question = typeof questionsTable.$inferSelect;
export type NewQuestion = typeof questionsTable.$inferInsert;
