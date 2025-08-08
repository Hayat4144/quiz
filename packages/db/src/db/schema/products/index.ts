import { uuid, pgTable, varchar, text, boolean } from "drizzle-orm/pg-core";
import { categories } from "../category";
import { timestampFields } from "@utils/timestamp";

export const products = pgTable("products", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 250 }).notNull(),
  slug: varchar("slug", { length: 270 }).notNull().unique(),
  description: text("description").notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id),
  isActive: boolean("is_active").notNull().default(true),
  hasVariants: boolean("has_variants").notNull().default(false),
  metaTitle: varchar("meta_title", { length: 250 }),
  metaDescription: text("meta_description"),
  ...timestampFields,
});

export type insertProduct = typeof products.$inferInsert;
export type selectProduc = typeof products.$inferSelect;
