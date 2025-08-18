import QuizForm from "@/components/forms/quiz/quiz-form";
import BackButton from "@/components/dashboard/back-button";

export default function page() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <div className="flex items-center">
            <BackButton />
            <div className="flex flex-col space-y-1">
              <h1 className="text-2xl font-bold">Create New Quiz</h1>
            </div>
          </div>
        </div>
        <QuizForm action="add" />
      </div>
    </div>
  );
}
