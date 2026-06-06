import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "STAR Answer Builder",
  description:
    "Transform rough interview examples into polished STAR answers tailored to your preferred style.",
};

export default function StarBuilderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
