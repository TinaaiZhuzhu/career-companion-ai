import { Document, Packer, Paragraph, TextRun } from "docx";

export function getCoverLetterFilename(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `Cover_Letter_${year}-${month}-${day}.docx`;
}

export async function createCoverLetterDocx(content: string) {
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

export async function downloadCoverLetterDocx(content: string) {
  const blob = await createCoverLetterDocx(content);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = getCoverLetterFilename();
  link.click();
  URL.revokeObjectURL(url);
}
