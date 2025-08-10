CREATE TABLE "quizzes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text,
	"teacher_id" uuid NOT NULL,
	"subject" varchar(200),
	"difficulty" varchar(50),
	"time_limit_seconds" integer,
	"attempts_allowed" integer DEFAULT 1,
	"show_answers_after_submission" boolean DEFAULT true,
	"is_published" boolean DEFAULT false,
	"start_at" timestamp with time zone,
	"end_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"quiz_id" uuid NOT NULL,
	"question" text NOT NULL,
	"type" varchar(50) DEFAULT 'mcq' NOT NULL,
	"explanation" text,
	"points" integer DEFAULT 1,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_teacher_id_users_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE no action ON UPDATE no action;