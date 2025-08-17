import { Button } from "@workspace/ui/components/button";
import { Plus } from "lucide-react";
import React from "react";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl my-2 mb-8 shadow-custom-lg bg-linear-45 from-indigo-500 via-purple-500 to-pink-500">
      <div className="relative flex items-center justify-between p-8 lg:p-12">
        <div className="flex-1">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to BrightQuiz Dashboard
          </h2>
          <p className="text-white/90 text-lg mb-6 max-w-2xl">
            Create engaging quizzes, manage questions, and track performance.
            Build interactive learning experiences with our powerful quiz
            platform.
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/20"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create Your First Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
