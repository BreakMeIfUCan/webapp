import { pgTable, unique, uuid, varchar, timestamp, foreignKey, text, integer, numeric, jsonb } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 255 }).notNull(),
	firstName: varchar("first_name", { length: 100 }),
	lastName: varchar("last_name", { length: 100 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const tests = pgTable("tests", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	category: varchar({ length: 10 }).notNull(),
	status: varchar({ length: 20 }).default('pending').notNull(),
	modelId: varchar("model_id", { length: 255 }),
	customDatasetPath: text("custom_dataset_path"),
	curlEndpoint: text("curl_endpoint"),
	attackCategory: varchar("attack_category", { length: 50 }),
	defenseType: varchar("defense_type", { length: 50 }),
	maxSamples: integer("max_samples").default(5),
	parentTestId: uuid("parent_test_id"),
	asr: numeric({ precision: 5, scale:  4 }),
	accuracy: numeric({ precision: 5, scale:  4 }),
	recall: numeric({ precision: 5, scale:  4 }),
	precision: numeric({ precision: 5, scale:  4 }),
	f1: numeric({ precision: 5, scale:  4 }),
	latency: numeric({ precision: 8, scale:  3 }),
	tokenUsage: integer("token_usage"),
	categoryWiseAsr: jsonb("category_wise_asr"),
	defenseAsr: numeric("defense_asr", { precision: 5, scale:  4 }),
	defenseAccuracy: numeric("defense_accuracy", { precision: 5, scale:  4 }),
	defenseRecall: numeric("defense_recall", { precision: 5, scale:  4 }),
	defensePrecision: numeric("defense_precision", { precision: 5, scale:  4 }),
	defenseF1: numeric("defense_f1", { precision: 5, scale:  4 }),
	defenseLatency: numeric("defense_latency", { precision: 8, scale:  3 }),
	defenseTokenUsage: integer("defense_token_usage"),
	defenseCategoryWiseAsr: jsonb("defense_category_wise_asr"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	progress: integer().default(0),
	error: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "tests_user_id_users_id_fk"
		}),
]);
