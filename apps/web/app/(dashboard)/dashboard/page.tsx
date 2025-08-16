import { redirect } from "next/navigation";
import { SignOutButton } from "@/components/signout-button";
import { auth } from "@/auth";
import QuizForm from "@/components/forms/quiz";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <SignOutButton />
        </div>
        <div className="grid gap-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
            <p className="text-muted-foreground mb-4">
              You are signed in as: <strong>{session.user?.email}</strong>
            </p>
            <div className="bg-muted p-4 rounded">
              <h3 className="font-medium mb-2">Session Info:</h3>
              <p className="text-sm text-muted-foreground">
                User ID: {session.user?.id}
              </p>
              <p className="text-sm text-muted-foreground">
                Access Token:{" "}
                {session.user.accessToken ? "Available" : "Not available"}
              </p>
            </div>
          </div>
        </div>
        <QuizForm />
      </div>
    </div>
  );
}
