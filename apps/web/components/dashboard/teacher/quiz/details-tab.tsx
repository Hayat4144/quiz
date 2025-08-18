"use client";
import { Quiz } from "@/types/quiz";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { useState } from "react";
import { QuizInfoCard } from "./info-card";
import dynamic from "next/dynamic";

const QuestionsTab = dynamic(() => import("./questions-tab"));

interface Props {
  quiz: Quiz;
}

export default function QuizDetailsTab({ quiz }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="space-y-6 my-5"
    >
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="questions">Questions</TabsTrigger>
        <TabsTrigger value="results">Results</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <QuizInfoCard quiz={quiz} />
      </TabsContent>

      <TabsContent value="questions" className="space-y-6">
        <QuestionsTab quizId={quiz.id} />
      </TabsContent>

      <TabsContent value="results"></TabsContent>

      <TabsContent value="settings"></TabsContent>
    </Tabs>
  );
}
