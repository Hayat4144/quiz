import { auth } from "@/auth";
import QuestionEditForm from "@/components/forms/quiz/question-edit-form";
import { apiClient } from "@/lib/api-client";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    quizId: string;
    questionId: string;
  }>;
}

export default async function page({ params }: Props) {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }

  const token = session.user.accessToken;
  const { quizId, questionId } = await params;

  const { data, error } = await apiClient.get(
    `/api/v1/teacher/quizzes/${quizId}/questions/${questionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screeen bg-background">
      <div className="max-w-6xl mx-auto py-8">
        <QuestionEditForm question={data.question} />
      </div>
    </div>
  );
}
