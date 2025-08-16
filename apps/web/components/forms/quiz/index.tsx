"use client";
import React from "react";
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  ArrowLeft,
  Badge,
  CheckCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { Textarea } from "@workspace/ui/components/textarea";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";
import {
  RadioGroupItem,
  RadioGroup,
} from "@workspace/ui/components/radio-group";

const questionSchema = z.object({
  question: z.string().min(10, "Question must be at least 10 characters"),
  options: z
    .array(z.string().min(1, "Option cannot be empty"))
    .length(4, "Must have exactly 4 options"),
  correctAnswer: z.number().min(0).max(3),
  explanation: z.string().optional(),
});

const quizSchema = z.object({
  questions: z
    .array(questionSchema)
    .min(1, "At least one question is required"),
});

type QuizFormData = z.infer<typeof quizSchema>;

export default function QuizQuestionForm() {
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      questions: [
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
          explanation: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const addQuestion = () => {
    append({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
    });
  };

  const onSubmit = () => {};

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Header with navigation and actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/teacher/quizzes" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quizzes
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={addQuestion}
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Question
              </Button>
              <Button type="submit" className="gap-2">
                <Save className="h-4 w-4" />
                Save Quiz
              </Button>
            </div>
          </div>

          {/* Questions list */}
          <div className="space-y-6">
            {fields.map((field, index) => (
              <Card key={field.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50 p-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold">
                      Question {index + 1}
                    </CardTitle>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Question Text */}
                  <FormField
                    control={form.control}
                    name={`questions.${index}.question`}
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
                      name={`questions.${index}.correctAnswer`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              value={field.value.toString()}
                              className="grid gap-3"
                            >
                              {[0, 1, 2, 3].map((optionIndex) => (
                                <FormField
                                  key={optionIndex}
                                  control={form.control}
                                  name={`questions.${index}.options.${optionIndex}`}
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
                    name={`questions.${index}.explanation`}
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
                          This explanation will be shown to students when
                          reviewing answers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Fixed action buttons at bottom on mobile */}
          <div className="sm:hidden fixed bottom-4 right-4 left-4 flex justify-end">
            <Button
              type="button"
              onClick={addQuestion}
              variant="outline"
              size="icon"
              className="rounded-full h-12 w-12 shadow-lg"
            >
              <Plus className="h-6 w-6" />
            </Button>
            <Button
              type="submit"
              size="lg"
              className="ml-2 rounded-full h-12 px-6 shadow-lg"
            >
              <Save className="h-5 w-5 mr-2" />
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
