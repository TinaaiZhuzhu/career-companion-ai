import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview Questions Generator",
  description:
    "Generate interview questions based on a job description and experience level.",
};

export default function InterviewQuestionsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
