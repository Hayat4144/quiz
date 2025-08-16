export interface Quiz {
  id: string;
  title: string;
  description?: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  timeLimit: number;
  maxAttempts: number;
  showAnswers: boolean;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
  questionCount?: number;
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
