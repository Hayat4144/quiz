"use client";

import { Button } from "@workspace/ui/components/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      type="button"
      variant="secondary"
      className="mr-4 cursor-pointer"
      onClick={() => router.back()}
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>
  );
}
