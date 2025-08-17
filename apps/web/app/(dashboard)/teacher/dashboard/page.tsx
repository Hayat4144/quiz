import { redirect } from "next/navigation";
import { auth } from "@/auth";
import HeroSection from "@/components/dashboard/teacher/hero-section";
import QuizCard from "@/components/dashboard/teacher/quiz-card";
import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const quizzes = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    description:
      "Test your knowledge of JavaScript basics including variables, functions, and control structures.",
    questionsCount: 12,
    status: "published" as const,
    createdAt: "2024-01-15",
    lastModified: "2 days ago",
    subject: "Technology",
  },
  {
    id: "2",
    title: "World History Quiz",
    description:
      "Explore major historical events and figures from ancient civilizations to modern times.",
    questionsCount: 8,
    status: "draft" as const,
    createdAt: "2024-01-20",
    lastModified: "1 day ago",
    subject: "History",
  },
  {
    id: "3",
    title: "Science Trivia",
    description:
      "A fun quiz covering biology, chemistry, physics, and earth science topics.",
    questionsCount: 15,
    status: "published" as const,
    createdAt: "2024-01-10",
    lastModified: "1 week ago",
    subject: "Science",
  },
  {
    id: "4",
    title: "Movie Trivia Night",
    description:
      "Test your knowledge of classic and modern cinema, actors, and film trivia.",
    questionsCount: 0,
    status: "draft" as const,
    createdAt: "2024-01-25",
    lastModified: "Today",
    subject: "Entertainment",
  },
];

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const token = session.user.accessToken;

  const { data, error } = await apiClient.get("/api/v1/teacher/quizzes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (error) {
    return <div className="text-red">{error}</div>;
  }

  console.log(data);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <HeroSection />
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 my-5">
          <div className="bg-gradient-card p-6 rounded-xl border shadow-custom-sm">
            <div className="text-2xl font-bold text-foreground">
              {quizzes.length}
            </div>
            <div className="text-muted-foreground">Total Quizzes</div>
          </div>
          <div className="bg-gradient-card p-6 rounded-xl border shadow-custom-sm">
            <div className="text-2xl font-bold text-success">
              {quizzes.filter((q) => q.status === "published").length}
            </div>
            <div className="text-muted-foreground">Published</div>
          </div>
          <div className="bg-gradient-card p-6 rounded-xl border shadow-custom-sm">
            <div className="text-2xl font-bold text-warning">
              {quizzes.filter((q) => q.status === "draft").length}
            </div>
            <div className="text-muted-foreground">Drafts</div>
          </div>
          <div className="bg-gradient-card p-6 rounded-xl border shadow-custom-sm">
            <div className="text-2xl font-bold text-primary">
              {quizzes.reduce((sum, q) => sum + q.questionsCount, 0)}
            </div>
            <div className="text-muted-foreground">Total Questions</div>
          </div>
        </div>
        {/* Quiz Grid */}
        {quizzes.length > 0 ? (
          <div
            className={
              1 === 1
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {data.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-muted-foreground text-lg mb-4">
              {true ? "No quizzes match your search" : "No quizzes found"}
            </div>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
