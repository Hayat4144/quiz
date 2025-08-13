import { attemptsTable, db, eq, NewAttempt } from "@workspace/db";

export const getAllAttempts = async (quizId: string) => {
  const attemptsData = await db.query.attemptsTable.findMany({
    where: eq(attemptsTable.quiz_id, quizId),
    with: {
      quiz: {
        columns: {
          id: true,
        },
        with: {
          questions: {
            with: {
              options: true,
            },
          },
        },
      },
      answers: true,
    },
  });
  return attemptsData.map((attempt) => {
    const answersDetails = attempt.quiz.questions.map((q) => {
      const studentAns = attempt.answers.find((a) => a.question_id === q.id);
      const correctOpt = q.options.find((o) => o.is_correct);

      return {
        questionId: q.id,
        question: q.question,
        yourAnswer:
          studentAns?.text_answer ||
          q.options.find((o) => o.id === studentAns?.selected_option_id)
            ?.text ||
          null,
        isCorrect: studentAns?.is_correct,
        pointsAwarded: studentAns?.points_awarded ?? 0,
        correctAnswer: correctOpt ? correctOpt.text : null,
      };
    });

    return {
      attemptId: attempt.id,
      score: attempt.score,
      maxScore: attempt.max_score,
      startedAt: attempt.started_at,
      submittedAt: attempt.submitted_at,
      answers: answersDetails,
    };
  });
};

export const getAttempts = async (attemptId: string) => {
  const attempts = await db
    .select()
    .from(attemptsTable)
    .where(eq(attemptsTable.id, attemptId));
  return attempts;
};

export const createAttempt = async (attemptData: NewAttempt) => {
  const [attempt] = await db
    .insert(attemptsTable)
    .values(attemptData)
    .returning({ id: attemptsTable.id });
  return attempt;
};
