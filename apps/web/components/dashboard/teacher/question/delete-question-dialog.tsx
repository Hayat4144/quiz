import { Question } from "@/types/quiz";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
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
import { Fragment, useState, useTransition } from "react";
import { Button } from "@workspace/ui/components/button";
import { Loader, Trash2 } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast, toastOptions } from "@workspace/ui/components/sonner";

interface Props {
  question: Question;
}

export default function DeleteQuestionDialog({ question }: Props) {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const { quizId } = useParams();
  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const handleDelete = async () => {
    if (!token) return;
    startTransition(async () => {
      const { message, error } = await apiClient.delete(
        `/api/v1/teacher/quizzes/${quizId}/questions/${question.id}`,
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
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Do you really want to delete the `{question.question}` question?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            question.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <Button onClick={handleDelete} disabled={isPending}>
            {isPending ? (
              <Fragment>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </Fragment>
            ) : (
              "Delete"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
