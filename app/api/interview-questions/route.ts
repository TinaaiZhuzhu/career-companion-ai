const MAKE_WEBHOOK_URL =
  "https://hook.eu1.make.com/e141r4cppltrcp93l32yhaqtjl4fk76j";

const VALID_EXPERIENCE_LEVELS = ["Junior", "Mid", "Senior"] as const;

type ExperienceLevel = (typeof VALID_EXPERIENCE_LEVELS)[number];

type WebhookRequestBody = {
  job_description?: string;
  experience_level?: string;
};

type WebhookSuccessResponse = {
  status: string;
  experience_level?: string;
  interview_questions?: string;
};

export async function POST(request: Request) {
  let body: WebhookRequestBody;

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const jobDescription = body.job_description?.trim();
  const experienceLevel = body.experience_level?.trim();

  if (!jobDescription || !experienceLevel) {
    return Response.json(
      { error: "job_description and experience_level are required." },
      { status: 400 },
    );
  }

  if (
    !VALID_EXPERIENCE_LEVELS.includes(experienceLevel as ExperienceLevel)
  ) {
    return Response.json(
      { error: "experience_level must be Junior, Mid, or Senior." },
      { status: 400 },
    );
  }

  let webhookResponse: Response;

  try {
    webhookResponse = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_description: jobDescription,
        experience_level: experienceLevel,
      }),
    });
  } catch {
    return Response.json(
      { error: "Unable to reach the question generator. Please try again." },
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
      { error: "Received an invalid response from the question generator." },
      { status: 502 },
    );
  }

  if (!webhookResponse.ok) {
    return Response.json(
      {
        error:
          typeof data === "object" && data && "error" in data
            ? String((data as { error: unknown }).error)
            : "The question generator returned an error. Please try again.",
      },
      { status: webhookResponse.status >= 400 ? webhookResponse.status : 502 },
    );
  }

  if (data.status !== "success") {
    return Response.json(
      {
        error:
          "Question generation did not complete successfully. Please try again.",
      },
      { status: 502 },
    );
  }

  if (!data.experience_level?.trim() || !data.interview_questions?.trim()) {
    return Response.json(
      { error: "The question generator returned incomplete results." },
      { status: 502 },
    );
  }

  return Response.json({
    status: "success",
    experience_level: data.experience_level,
    interview_questions: data.interview_questions,
  });
}
