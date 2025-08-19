import { Input } from "@workspace/ui/components/input";
import { Search } from "lucide-react";
import Link from "next/link";

export default function TeacherDashboardHeader() {
  return (
    <div className="backdrop-blur-sm border-b sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Title and Create Button */}
          <div className="flex items-center justify-between">
            <Link
              href="/teacher/dashboard"
              className="text-3xl font-bold text-foreground"
            >
              BrightQuiz
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[300px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search quizzes..." className="pl-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
