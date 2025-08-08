import { timestampFields } from "@utils/timestamp";
import { AnyPgColumn } from "drizzle-orm/pg-core";
import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  parentId: uuid("parent_id").references((): AnyPgColumn => categories.id),
  imageUrl: text("image_url"),
  ...timestampFields,
});

export type insertCategory = typeof categories.$inferInsert;
export type selectCategory = typeof categories.$inferSelect;
