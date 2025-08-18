import type React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Quiz } from "@/types/quiz";

interface QuizInfoCardProps {
  quiz: Quiz;
}

function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`text-sm font-medium ${className}`}>{children}</label>
  );
}

export function QuizInfoCard({ quiz }: QuizInfoCardProps) {
  // Calculate total points from questions (would come from API in real app)
  const totalPoints = 5; // Mock value

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Title</Label>
            <p className="text-sm text-muted-foreground">{quiz.title}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Attempts Allowed</Label>
            <p className="text-sm text-muted-foreground">
              {quiz.attempts_allowed}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Subject</Label>
            <p className="text-sm text-muted-foreground">{quiz.subject}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Time Limits</Label>
            <p className="text-sm text-muted-foreground">
              {quiz.time_limit_seconds} seconds
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">Created</Label>
            <p className="text-sm text-muted-foreground">
              {new Date(quiz.created_at).toLocaleDateString()}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">Questions</Label>
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Total Points</Label>
            <p className="text-sm text-muted-foreground">
              {totalPoints} points
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
