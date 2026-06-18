import {
  pgTable,
  integer,
  text,
  varchar,
  primaryKey,
} from "drizzle-orm/pg-core";

export const rikishi = pgTable("rikishi", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  birthday: integer("birthday"),
  origin: text("origin"),
});

export const basho = pgTable("basho", {
  id: varchar("id", { length: 6 }).primaryKey(),
  city: text("city").notNull(),
  winnerId: integer("winner_id").references(() => rikishi.id),
});

export const torikumi = pgTable("torikumi", {
  id: text("id").primaryKey(),
  kimarite: text("kimarite"),
  eastRikishi: integer("east_rikishi")
    .references(() => rikishi.id)
    .notNull(),
  westRikishi: integer("west_rikishi")
    .references(() => rikishi.id)
    .notNull(),
  division: text("division").notNull(),
  day: integer("day").notNull(),
  matchNumber: integer("match_number").notNull(),
  winnerId: integer("winner_id"),
  bashoId: varchar("basho_id", { length: 6 })
    .references(() => basho.id)
    .notNull(),
});

export const rikishiBasho = pgTable(
  "rikishi_basho",
  {
    rikishiId: integer("rikishi_id")
      .references(() => rikishi.id)
      .notNull(),
    bashoId: varchar("basho_id", { length: 6 })
      .references(() => basho.id)
      .notNull(),
    rank: text("rank"),
    division: text("division"),
    weight: integer("weight"),
  },
  (table) => [primaryKey({ columns: [table.rikishiId, table.bashoId] })],
);
