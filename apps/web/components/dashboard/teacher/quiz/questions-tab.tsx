import { apiClient } from "@/lib/api-client";
import { Question } from "@/types/quiz";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment, useEffect, useState, useTransition } from "react";
import DeleteQuestionDialog from "../question/delete-question-dialog";

interface Props {
  quizId: string;
}

export default function QuestionsTab({ quizId }: Props) {
  /* eslint-disable */
  const [questions, setQuestions] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const token = session?.user.accessToken;

  useEffect(() => {
    if (!token) return;
    startTransition(async () => {
      const { data, error } = await apiClient.get(
        `/api/v1/teacher/quizzes/${quizId}/questions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (error) {
        return setError(error);
      }

      const transFormData = data.map((question: Question) => {
        const options = question.options.map((option) => option.text);
        const correctAnswer = question.options.findIndex(
          (option) => option.is_correct,
        );
        return { ...question, options, correctAnswer };
      });

      setQuestions(transFormData);
    });
  }, [quizId, token]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading questions...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => location.reload()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Questions ({questions.length})
        </h2>
        <Link href={`/teacher/quizzes/${quizId}/questions/new`}>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Question {index + 1}</Badge>
                    <Badge variant="secondary">{question.type}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {question.points} points
                    </span>
                  </div>
                  <CardTitle className="text-base">
                    {question.question}
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/teacher/quizzes/${quizId}/questions/${question.id}/edit`}
                  >
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <DeleteQuestionDialog question={question} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {question.type === "mcq" && question.options && (
                <div className="space-y-2">
                  {question.options.map(
                    (option: string, optionIndex: number) => (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded border ${
                          optionIndex === question.correctAnswer
                            ? "bg-green-50 border-green-200 text-green-800"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        {String.fromCharCode(65 + optionIndex)}. {option}
                        {optionIndex === question.correctAnswer && (
                          <span className="ml-2 text-xs font-medium">
                            (Correct)
                          </span>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}
              {question.type === "true-false" && (
                <div className="text-sm">
                  <span className="font-medium">Correct Answer: </span>
                  <span
                    className={
                      question.correctAnswer ? "text-green-600" : "text-red-600"
                    }
                  >
                    {question.correctAnswer ? "True" : "False"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </Fragment>
  );
}
