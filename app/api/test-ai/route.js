import { generateInterviewQuestions } from "@/actions/ai-interview.js";

export async function GET() {

  try {

    const result = await generateInterviewQuestions({
      jobPosition: "Frontend Developer",
      jobDescription: "React Next.js Tailwind",
      jobExperience: "2",
    });

    return Response.json({
      success: true,
      data: result,
    });

  } catch (error) {

    return Response.json({
      success: false,
      error: error.message,
    });
  }
}