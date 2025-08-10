import { db, quizTable, eq, NewQuiz, and, SQL, Quiz } from "@workspace/db";

export const editQuiz = async (filters: SQL[], data: Partial<Quiz>) => {
  const [quiz] = await db
    .update(quizTable)
    .set(data)
    .where(and(...filters))
    .returning({ id: quizTable.id, title: quizTable.title });
  return quiz;
};

export const searchQuiz = async (
  filters: SQL[],
  offset: number,
  perRow: number,
) => {
  const quizzes = await db
    .select()
    .from(quizTable)
    .where(and(...filters))
    .limit(perRow)
    .offset(offset);
  return quizzes;
};

export const createNewQuiz = async (data: NewQuiz) => {
  const [quiz] = await db
    .insert(quizTable)
    .values(data)
    .returning({ id: quizTable.id, title: quizTable.title });
  return quiz;
};

export const getQuizByTeacherId = async (teacherId: string) => {
  const [result] = await db
    .select()
    .from(quizTable)
    .where(eq(quizTable.teacher_id, teacherId));
  return result;
};

export const getQuizById = async (id: string) => {
  const [result] = await db
    .select()
    .from(quizTable)
    .where(eq(quizTable.id, id));
  return result;
};
