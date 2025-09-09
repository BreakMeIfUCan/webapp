import { relations } from "drizzle-orm/relations";
import { users, tests } from "./schema";

export const testsRelations = relations(tests, ({one}) => ({
	user: one(users, {
		fields: [tests.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	tests: many(tests),
}));