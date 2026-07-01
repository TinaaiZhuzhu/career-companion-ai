const MAKE_WEBHOOK_URL =
  "https://hook.eu1.make.com/lq6fkjrs948ea5wc1nk31ieiif8twsyd";

type WebhookRequestBody = {
  resume_text?: string;
  job_description?: string;
};

type WebhookSuccessResponse = {
  status: string;
  match_analysis?: string;
  cover_letter?: string;
  optimised_resume?: string;
};

export async function POST(request: Request) {
  let body: WebhookRequestBody;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const resumeText = body.resume_text?.trim();
  const jobDescription = body.job_description?.trim();

  if (!resumeText || !jobDescription) {
    return Response.json(
      { error: "resume_text and job_description are required." },
      { status: 400 },
    );
  }

  let webhookResponse: Response;

  try {
    webhookResponse = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume_text: resumeText,
        job_description: jobDescription,
      }),
    });
  } catch {
    return Response.json(
      { error: "Unable to reach the analysis service. Please try again." },
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
      { error: "Received an invalid response from the analysis service." },
      { status: 502 },
    );
  }

  if (!webhookResponse.ok) {
    return Response.json(
      {
        error:
          typeof data === "object" && data && "error" in data
            ? String((data as { error: unknown }).error)
            : "The analysis service returned an error. Please try again.",
      },
      { status: webhookResponse.status >= 400 ? webhookResponse.status : 502 },
    );
  }

  if (data.status !== "success") {
    return Response.json(
      { error: "Analysis did not complete successfully. Please try again." },
      { status: 502 },
    );
  }

  if (
    !data.match_analysis?.trim() ||
    !data.cover_letter?.trim() ||
    !data.optimised_resume?.trim()
  ) {
    return Response.json(
      { error: "The analysis service returned incomplete results." },
      { status: 502 },
    );
  }

  return Response.json({
    status: "success",
    match_analysis: data.match_analysis,
    cover_letter: data.cover_letter,
    optimised_resume: data.optimised_resume,
  });
}
