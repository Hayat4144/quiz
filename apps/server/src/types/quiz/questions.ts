import { NewQuestionOption } from "@workspace/db";

interface Question {
  question: string;
  options: Omit<NewQuestionOption, "question_id">[];
  explanation?: string;
  points?: number | null;
  order?: number | null;
}

export interface updateQuestionReqBody {
  question: Question;
  questionId: string;
}

export interface addQuestionReqBody {
  questions: Question[];
  quizId: string;
}
