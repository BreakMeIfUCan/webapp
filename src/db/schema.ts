import { sql } from 'drizzle-orm';
import { pgTable, text, uuid, varchar, timestamp, decimal, integer, jsonb } from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tests table - Simple NLP testing schema
export const tests = pgTable('tests', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  category: varchar('category', { length: 10 }).notNull(), // 'black' or 'white'
  status: varchar('status', { length: 20 }).default('pending').notNull(), // 'pending', 'running', 'completed', 'failed'
  
  // Input parameters
  modelId: varchar('model_id', { length: 255 }), // For white box: HF Model ID
  customDatasetPath: text('custom_dataset_path'), // For white box: CSV file path
  curlEndpoint: text('curl_endpoint'), // For black box: cURL string
  attackCategory: varchar('attack_category', { length: 50 }), // For black box: Phishing, Prompt Injection, etc.
  
  // Defense parameters
  defenseType: varchar('defense_type', { length: 50 }), // sanitize_text, meta-prompt wrapper, Llama Guard
  
  // Output results (without defense)
  asr: decimal('asr', { precision: 5, scale: 4 }), // Attack Success Rate (0-1)
  accuracy: decimal('accuracy', { precision: 5, scale: 4 }), // For white box (0-1)
  recall: decimal('recall', { precision: 5, scale: 4 }), // For white box (0-1)
  precision: decimal('precision', { precision: 5, scale: 4 }), // For white box (0-1)
  f1: decimal('f1', { precision: 5, scale: 4 }), // For white box (0-1)
  latency: decimal('latency', { precision: 8, scale: 3 }), // For black box (seconds)
  tokenUsage: integer('token_usage'), // For black box (numbers, usually in k)
  categoryWiseASR: jsonb('category_wise_asr'), // For black box: JSON object
  
  // Defense results (with defense applied)
  defenseASR: decimal('defense_asr', { precision: 5, scale: 4 }), // Attack Success Rate with defense (0-1)
  defenseAccuracy: decimal('defense_accuracy', { precision: 5, scale: 4 }), // For white box with defense (0-1)
  defenseRecall: decimal('defense_recall', { precision: 5, scale: 4 }), // For white box with defense (0-1)
  defensePrecision: decimal('defense_precision', { precision: 5, scale: 4 }), // For white box with defense (0-1)
  defenseF1: decimal('defense_f1', { precision: 5, scale: 4 }), // For white box with defense (0-1)
  defenseLatency: decimal('defense_latency', { precision: 8, scale: 3 }), // For black box with defense (seconds)
  defenseTokenUsage: integer('defense_token_usage'), // For black box with defense (numbers, usually in k)
  defenseCategoryWiseASR: jsonb('defense_category_wise_asr'), // For black box with defense: JSON object
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  
  // Progress and error tracking
  progress: integer('progress').default(0), // 0-100
  error: text('error'),
});

