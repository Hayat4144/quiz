import QuizForm from "@/components/forms/quiz/quiz-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@workspace/ui/components/button";
import { apiClient } from "@/lib/api-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ quizId: string }>;
}

export default async function page({ params }: Props) {
  const { quizId } = await params;
  const session = await auth();

  if (!session) {
    redirect("/auth/login");
  }

  const token = session.user.accessToken;

  if (!quizId) {
    return null;
  }

  const { data, error } = await apiClient.get(
    `/api/v1/teacher/quizzes/${quizId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (error) {
    return <div className="text-red">{error}</div>;
  }

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
              <h1 className="text-2xl font-bold">Edit Quiz</h1>
              <p className="text-sm text-muted-foreground"></p>
            </div>
          </div>
        </div>
        <div className="grid gap-6"></div>
        <QuizForm action="edit" quiz={data} />
      </div>
    </div>
  );
}
