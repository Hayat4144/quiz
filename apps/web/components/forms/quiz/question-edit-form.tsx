"use client";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, Badge, CheckCircle, Loader2, Save } from "lucide-react";
import { Textarea } from "@workspace/ui/components/textarea";
import { Input } from "@workspace/ui/components/input";
import {
  RadioGroupItem,
  RadioGroup,
} from "@workspace/ui/components/radio-group";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast, toastOptions } from "@workspace/ui/components/sonner";
import { apiClient } from "@/lib/api-client";
import { Question } from "@/types/quiz";
import { Fragment, useEffect, useTransition } from "react";
import Link from "next/link";

interface Props {
  question: Question;
}

const questionSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .length(4, "Must have exactly 4 options"),
  correctAnswer: z.number().min(0).max(3),
  explanation: z.string().optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

export default function QuestionEditForm({ question }: Props) {
  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      question: question.question,
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: question.explanation,
    },
  });

  const [isPending, startTransition] = useTransition();
  const { data: session } = useSession();
  const token = session?.user.accessToken;
  const { quizId } = useParams();

  useEffect(() => {
    if (question && question.options.length) {
      const options = question.options.map((option) => option.text);
      const correctAnswer = question.options.findIndex(
        (options) => options.is_correct,
      );
      form.setValue("options", options);
      form.setValue("correctAnswer", correctAnswer);
    }
  }, [question]);

  const onSubmit = async (values: QuestionFormData) => {
    if (!token) return;
    startTransition(async () => {
      const transformedOptions = values.options.map((option) => {
        return {
          text: option,
          is_correct: option === values.options[values.correctAnswer],
        };
      });

      const { message, error } = await apiClient.put(
        `/api/v1/teacher/quizzes/${quizId}/questions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            questionId: question.id,
            question: {
              ...values,
              options: transformedOptions,
            },
          }),
        },
      );

      if (error) {
        toast.error(error, toastOptions);
      } else {
        toast.success(message, toastOptions);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <Link href={`/teacher/quizzes/${quizId}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Quiz
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Edit Question</h1>
            </div>{" "}
            <Button type="submit" disabled={isPending} className="gap-2">
              {isPending ? (
                <Fragment>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Please wait...
                </Fragment>
              ) : (
                <Fragment>
                  {" "}
                  <Save className="h-4 w-4" />
                  Update Questions
                </Fragment>
              )}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="space-y-6">
            {/* Question Text */}
            <FormField
              control={form.control}
              name={`question`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your question..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Answer Options */}
            <div className="space-y-4">
              <FormLabel>Answer Options</FormLabel>
              <FormField
                control={form.control}
                name={`correctAnswer`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(Number(value))}
                        value={field.value.toString()}
                        className="grid gap-3"
                      >
                        {[0, 1, 2, 3].map((optionIndex) => (
                          <FormField
                            key={optionIndex}
                            control={form.control}
                            name={`options.${optionIndex}`}
                            render={({ field: optionField }) => (
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem
                                    value={optionIndex.toString()}
                                  />
                                </FormControl>
                                <div className="flex-1">
                                  <FormControl>
                                    <Input
                                      placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                      {...optionField}
                                    />
                                  </FormControl>
                                </div>
                                {field.value === optionIndex && (
                                  <Badge className="gap-1 text-green-600 border-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                    Correct
                                  </Badge>
                                )}
                              </FormItem>
                            )}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-sm text-muted-foreground">
                Select the correct answer by clicking the radio button
              </p>
            </div>

            {/* Explanation */}
            <FormField
              control={form.control}
              name={`explanation`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Explanation (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain why this is the correct answer..."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This explanation will be shown to students when reviewing
                    answers
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
