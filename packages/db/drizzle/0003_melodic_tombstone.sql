CREATE TABLE "question-options" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" uuid NOT NULL,
	"text" text NOT NULL,
	"is_correct" boolean DEFAULT false,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "question-options" ADD CONSTRAINT "question-options_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;