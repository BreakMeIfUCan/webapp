ALTER TABLE "tests" ADD COLUMN "max_samples" integer DEFAULT 5;--> statement-breakpoint
ALTER TABLE "tests" ADD COLUMN "total_attacks" integer;--> statement-breakpoint
ALTER TABLE "tests" ADD COLUMN "successful_attacks" integer;--> statement-breakpoint
ALTER TABLE "tests" ADD COLUMN "category_failures" jsonb;--> statement-breakpoint
ALTER TABLE "tests" ADD COLUMN "defense_total_attacks" integer;--> statement-breakpoint
ALTER TABLE "tests" ADD COLUMN "defense_successful_attacks" integer;--> statement-breakpoint
ALTER TABLE "tests" ADD COLUMN "defense_category_failures" jsonb;