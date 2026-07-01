import { Document, Packer, Paragraph, TextRun } from "docx";

function getDocxFilename(prefix: string, date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${prefix}_${year}-${month}-${day}.docx`;
}

export async function createTextDocx(content: string) {
  const paragraphs = content.split("\n").map(
    (line) =>
      new Paragraph({
        children: [new TextRun(line || " ")],
        spacing: { after: 120 },
      }),
  );

  const document = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  return Packer.toBlob(document);
}

export async function downloadTextDocx(content: string, filename: string) {
  const blob = await createTextDocx(content);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function getCoverLetterFilename(date = new Date()) {
  return getDocxFilename("Cover_Letter", date);
}

export async function createCoverLetterDocx(content: string) {
  return createTextDocx(content);
}

export async function downloadCoverLetterDocx(content: string) {
  await downloadTextDocx(content, getCoverLetterFilename());
}

export function getOptimisedResumeFilename(date = new Date()) {
  return getDocxFilename("Optimised_Resume", date);
}

export async function downloadOptimisedResumeDocx(content: string) {
  await downloadTextDocx(content, getOptimisedResumeFilename());
}
