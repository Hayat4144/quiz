import QuizForm from "@/components/forms/quiz/quiz-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@workspace/ui/components/button";

export default function page() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <div className="flex items-center">
            <Link
              href="/teacher/quizzes"
              className={(buttonVariants({ variant: "secondary" }), "mr-4")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-bold">Create New Quiz</h1>
            </div>
          </div>
        </div>
        <div className="grid gap-6"></div>
        <QuizForm action="add" />
      </div>
    </div>
  );
}
