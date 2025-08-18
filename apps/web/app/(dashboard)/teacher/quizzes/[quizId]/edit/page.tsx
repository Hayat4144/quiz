import QuizForm from "@/components/forms/quiz/quiz-form";
import { apiClient } from "@/lib/api-client";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import BackButton from "@/components/dashboard/back-button";

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
            <BackButton />
            <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-bold">Edit Quiz</h1>
            </div>
          </div>
        </div>
        <QuizForm action="edit" quiz={data} />
      </div>
    </div>
  );
}
