import { auth } from "@/auth";
import PublishQuiz from "@/components/dashboard/teacher/publish-quiz";
import QuizDetailsTab from "@/components/dashboard/teacher/quiz/details-tab";
import { apiClient } from "@/lib/api-client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Edit } from "lucide-react";
import Link from "next/link";
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

  const { data: quiz, error } = await apiClient.get(
    `/api/v1/teacher/quizzes/${quizId}`,
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
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{quiz.title}</h1>
              <Badge variant={quiz.is_published ? "default" : "secondary"}>
                {quiz.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
            <p className="text-muted-foreground">{quiz.description}</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/teacher/quiz/${quiz.id}/edit`}>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-transparent cursor-pointer"
              >
                <Edit className="h-4 w-4" />
                Edit Quiz
              </Button>
            </Link>
            {!quiz.is_published && (
              <PublishQuiz quizId={quiz.id} title={quiz.title} />
            )}
          </div>
        </div>{" "}
        {/* Quiz Details*/}
        <QuizDetailsTab quiz={quiz} />
      </div>
    </div>
  );
}
