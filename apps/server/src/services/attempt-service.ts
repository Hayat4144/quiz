import { attemptsTable, db, eq, NewAttempt } from "@workspace/db";

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
