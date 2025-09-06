ALTER TABLE "tests" ADD COLUMN "defense_type" varchar(50);--> statement-breakpoint
ALTER TABLE "tests" ADD COLUMN "defense_asr" numeric(5, 4);--> statement-breakpoint
ALTER TABLE "tests" ADD COLUMN "defense_accuracy" numeric(5, 4);--> statement-breakpoint
ALTER TABLE "tests" ADD COLUMN "defense_recall" numeric(5, 4);--> statement-breakpoint
ALTER TABLE "tests" ADD COLUMN "defense_precision" numeric(5, 4);--> statement-breakpoint
ALTER TABLE "tests" ADD COLUMN "defense_f1" numeric(5, 4);--> statement-breakpoint
ALTER TABLE "tests" ADD COLUMN "defense_latency" numeric(8, 3);--> statement-breakpoint
ALTER TABLE "tests" ADD COLUMN "defense_token_usage" integer;--> statement-breakpoint
ALTER TABLE "tests" ADD COLUMN "defense_category_wise_asr" jsonb;