"use client";
import { apiClient } from "@/lib/api-client";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { toast, toastOptions } from "@workspace/ui/components/sonner";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { Fragment, useState, useTransition } from "react";

interface Props {
  quizId: string;
  title: string;
}

export default function PublishQuiz({ quizId, title }: Props) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const handlePublish = async () => {
    startTransition(async () => {
      const { message, error } = await apiClient.post(
        `/api/v1/teacher/quizzes/${quizId}/publish`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (error) {
        toast.error(error, toastOptions);
      } else {
        toast.success(message, toastOptions);
        setOpen(false);
      }
    });
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="default" size="sm" className="flex-1">
          Publish
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you want to publish the `{title}` quiz?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently publish your
            quiz.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button onClick={handlePublish} disabled={isPending}>
            {isPending ? (
              <Fragment>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </Fragment>
            ) : (
              "Publish"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
