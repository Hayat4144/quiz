"use client";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import { ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="text-8xl font-bold text-primary mb-4 bg-clip-text">
          404
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center cursor-pointer"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Go Back
          </Button>
          <Link
            href="/teacher/dashboard"
            className={buttonVariants({
              variant: "default",
              className: "flex items-center",
            })}
          >
            <Home className="mr-1 h-4 w-4" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
