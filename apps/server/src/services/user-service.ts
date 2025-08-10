import { db, eq, NewUser, usersTable } from "@workspace/db";

export async function getUserByEmail(email: string) {
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));
  return result[0] || null;
}

export async function getUserById(id: string) {
  const result = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, id));
  return result[0] || null;
}

export async function createUser(data: NewUser) {
  const result = await db
    .insert(usersTable)
    .values(data)
    .returning({ id: usersTable.id, email: usersTable.email });
  return result[0];
}
