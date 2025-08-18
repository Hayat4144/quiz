import { auth } from "@/auth";
import { apiClient } from "@/lib/api-client";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ quizId: string }>;
}

export default async function page({ params }: Props) {
  const { quizId } = await params;
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  const token = session.user.accessToken;

  const { data, error } = await apiClient.get(
    `/api/v1/teacher/quizzes/${quizId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (error) {
    return <div>{error}</div>;
  }

  return <div></div>;
}
