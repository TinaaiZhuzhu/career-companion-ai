import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Match & Cover Letter",
  description:
    "Analyse your resume against a job description and generate a tailored cover letter.",
};

export default function ResumeMatchLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
