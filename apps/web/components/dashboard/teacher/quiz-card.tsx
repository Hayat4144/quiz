import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Edit, Plus, Eye, MoreHorizontal, Calendar } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Quiz } from "@/types/quiz";
import Link from "next/link";
import PublishQuiz from "./publish-quiz";

interface QuizCardProps {
  quiz: Quiz;
}

const QuizCard = ({ quiz }: QuizCardProps) => {
  const getStatusColor = (status: Quiz["is_published"]) => {
    if (status) return "bg-green-600 text-white border-none";
  };

  return (
    <Card className="group hover:shadow-custom-md transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50">
      <CardHeader className="">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {quiz.title}
            </CardTitle>
            {quiz.subject && (
              <Badge variant="secondary" className="mt-2 text-xs">
                {quiz.subject}
              </Badge>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/teacher/quizzes/${quiz.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Quiz
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                // onClick={() => onDelete(quiz.id)}
                className="text-destructive"
              >
                Delete Quiz
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {quiz.description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              Updated {new Date(quiz.updated_at).toLocaleDateString()}
            </span>
          </div>
          <Badge
            variant="outline"
            className={getStatusColor(quiz.is_published)}
          >
            {quiz.is_published ? "Publish" : "Draft"}
          </Badge>
        </div>

        <div className="text-sm text-foreground font-medium">5 questions</div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button variant="outline" className="flex-1" asChild>
          <Link href={`/teacher/quizzes/${quiz.id}/edit`} prefetch={true}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button
          variant="secondary"
          disabled={quiz.is_published}
          className="flex-1"
        >
          <Link
            href={`/teacher/quizzes/${quiz.id}/questions/new`}
            prefetch={true}
            className="flex"
          >
            <Plus className="mr-2 h-4 w-4" />
            Questions
          </Link>
        </Button>

        {!quiz.is_published && (
          <PublishQuiz quizId={quiz.id} title={quiz.title} />
        )}
      </CardFooter>
    </Card>
  );
};

export default QuizCard;
