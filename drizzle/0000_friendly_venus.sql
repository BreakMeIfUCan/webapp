CREATE TABLE "tests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"category" varchar(10) NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"model_id" varchar(255),
	"custom_dataset_path" text,
	"curl_endpoint" text,
	"attack_category" varchar(50),
	"defense_type" varchar(50),
	"max_samples" integer DEFAULT 5,
	"parent_test_id" uuid,
	"asr" numeric(5, 4),
	"accuracy" numeric(5, 4),
	"recall" numeric(5, 4),
	"precision" numeric(5, 4),
	"f1" numeric(5, 4),
	"latency" numeric(8, 3),
	"token_usage" integer,
	"category_wise_asr" jsonb,
	"defense_asr" numeric(5, 4),
	"defense_accuracy" numeric(5, 4),
	"defense_recall" numeric(5, 4),
	"defense_precision" numeric(5, 4),
	"defense_f1" numeric(5, 4),
	"defense_latency" numeric(8, 3),
	"defense_token_usage" integer,
	"defense_category_wise_asr" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"progress" integer DEFAULT 0,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(100),
	"last_name" varchar(100),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "tests" ADD CONSTRAINT "tests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;