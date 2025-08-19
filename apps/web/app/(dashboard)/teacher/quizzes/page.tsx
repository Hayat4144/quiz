import { auth } from "@/auth";
import QuizCard from "@/components/dashboard/teacher/quiz-card";
import { apiClient } from "@/lib/api-client";
import { Quiz } from "@/types/quiz";
import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Quiz",
};

export default async function page() {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  const token = session.user.accessToken;

  const { data, error } = await apiClient.get(`/api/v1/teacher/quizzes`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {data.length > 0 ? (
          <div
            className={
              1 === 1
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {data.map((quiz: Quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              No Quizzes Found
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
