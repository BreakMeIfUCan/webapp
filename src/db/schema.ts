import { sql } from 'drizzle-orm';
import { pgTable, text, uuid, varchar, timestamp, numeric, integer, jsonb, boolean } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tests table
export const tests = pgTable('tests', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  type: varchar('type', { length: 50 }).notNull(), // 'vision' or 'nlp'
  category: varchar('category', { length: 50 }).notNull(), // 'black', 'gray', 'white'
  status: varchar('status', { length: 50 }).default('pending').notNull(), // 'pending', 'running', 'completed', 'failed'
  parameters: jsonb('parameters').notNull(),
  results: jsonb('results'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

