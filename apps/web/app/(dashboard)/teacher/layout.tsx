import TeacherDashboardHeader from "@/components/dashboard/teacher/header";
import React, { Fragment } from "react";

interface Props {
  children: React.ReactNode;
}

export default function layout({ children }: Props) {
  return (
    <Fragment>
      <header>
        <TeacherDashboardHeader />
      </header>
      <main>{children}</main>
    </Fragment>
  );
}
