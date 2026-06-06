const MAKE_WEBHOOK_URL =
  "https://hook.eu1.make.com/wo9p4hfsjohwebkl1wu0mt715jwn44to";

const VALID_ANSWER_LENGTHS = ["Short", "Medium", "Detailed"] as const;
const VALID_OUTPUT_STYLES = ["Spoken", "Professional", "Executive"] as const;

type AnswerLength = (typeof VALID_ANSWER_LENGTHS)[number];
type OutputStyle = (typeof VALID_OUTPUT_STYLES)[number];

type WebhookRequestBody = {
  interview_question?: string;
  user_example?: string;
  answer_length?: string;
  output_style?: string;
};

type WebhookSuccessResponse = {
  status: string;
  star_answer?: string;
};

export async function POST(request: Request) {
  let body: WebhookRequestBody;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const interviewQuestion = body.interview_question?.trim();
  const userExample = body.user_example?.trim();
  const answerLength = body.answer_length?.trim();
  const outputStyle = body.output_style?.trim();

  if (!interviewQuestion || !userExample || !answerLength || !outputStyle) {
    return Response.json(
      {
        error:
          "interview_question, user_example, answer_length, and output_style are required.",
      },
      { status: 400 },
    );
  }

  if (!VALID_ANSWER_LENGTHS.includes(answerLength as AnswerLength)) {
    return Response.json(
      { error: "answer_length must be Short, Medium, or Detailed." },
      { status: 400 },
    );
  }

  if (!VALID_OUTPUT_STYLES.includes(outputStyle as OutputStyle)) {
    return Response.json(
      { error: "output_style must be Spoken, Professional, or Executive." },
      { status: 400 },
    );
  }

  let webhookResponse: Response;

  try {
    webhookResponse = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interview_question: interviewQuestion,
        user_example: userExample,
        answer_length: answerLength,
        output_style: outputStyle,
      }),
    });
  } catch {
    return Response.json(
      { error: "Unable to reach the STAR answer builder. Please try again." },
      { status: 502 },
    );
  }

  const rawText = await webhookResponse.text();
  console.log("MAKE RESPONSE:", rawText);

  let data: WebhookSuccessResponse;

  try {
    data = JSON.parse(rawText) as WebhookSuccessResponse;
  } catch {
    return Response.json(
      { error: "Received an invalid response from the STAR answer builder." },
      { status: 502 },
    );
  }

  if (!webhookResponse.ok) {
    return Response.json(
      {
        error:
          typeof data === "object" && data && "error" in data
            ? String((data as { error: unknown }).error)
            : "The STAR answer builder returned an error. Please try again.",
      },
      { status: webhookResponse.status >= 400 ? webhookResponse.status : 502 },
    );
  }

  if (data.status !== "success") {
    return Response.json(
      {
        error:
          "STAR answer generation did not complete successfully. Please try again.",
      },
      { status: 502 },
    );
  }

  if (!data.star_answer?.trim()) {
    return Response.json(
      { error: "The STAR answer builder returned incomplete results." },
      { status: 502 },
    );
  }

  return Response.json({
    status: "success",
    star_answer: data.star_answer,
  });
}
