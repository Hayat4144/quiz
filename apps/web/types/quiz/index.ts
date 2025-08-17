export interface Quiz {
  id: string;
  title: string;
  description: string;
  teacher_id: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  time_limit_seconds: number;
  attempts_allowed: number;
  show_answers_after_submission: boolean;
  is_published: boolean;
  start_at: Date | null;
  end_at: Date | null;
  created_at: string | Date;
  updated_at: string | Date;
}

export interface Question {
  id: string;
  quizId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  order: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  startedAt: string;
  completedAt?: string;
  answers: Record<string, number>;
}
