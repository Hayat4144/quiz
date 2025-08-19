import { redirect } from "next/navigation";
import { auth } from "@/auth";
import HeroSection from "@/components/dashboard/teacher/hero-section";
import QuizCard from "@/components/dashboard/teacher/quiz-card";
import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Quiz } from "@/types/quiz";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const token = session.user.accessToken;

  const [quizzes, quizOverview] = await Promise.all([
    apiClient.get("/api/v1/teacher/quizzes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    apiClient.get(`/api/v1/teacher/quizzes/overview`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
  ]);

  if (quizzes.error) {
    return <div className="text-red">{quizzes.error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <HeroSection />
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 my-5">
          <div className="bg-gradient-card p-6 rounded-xl border shadow-custom-sm">
            <div className="text-2xl font-bold text-foreground">
              {quizOverview.data.total}
            </div>
            <div className="text-muted-foreground">Total Quizzes</div>
          </div>
          <div className="bg-gradient-card p-6 rounded-xl border shadow-custom-sm">
            <div className="text-2xl font-bold text-success">
              {quizOverview.data.published}
            </div>
            <div className="text-muted-foreground">Published</div>
          </div>
          <div className="bg-gradient-card p-6 rounded-xl border shadow-custom-sm">
            <div className="text-2xl font-bold text-warning">
              {quizOverview.data.draft}
            </div>
            <div className="text-muted-foreground">Drafts</div>
          </div>
        </div>
        {/* Quiz Grid */}
        {quizOverview.data.total > 0 ? (
          <div
            className={
              1 === 1
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {quizzes.data.map((quiz: Quiz) => (
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
