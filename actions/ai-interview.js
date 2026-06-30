"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function generateInterviewQuestions(data) {
  try {
    const requestedCount = Number(process.env.NEXT_PUBLIC_NUMBER_OF_QUESTIONS || 5);

    const prompt = `
      Job Position: ${data.jobPosition}
      Job Description: ${data.jobDescription}
      Years of Experience: ${data.jobExperience}

      Generate exactly ${requestedCount} interview questions.

      Rules:
      - 3 questions must be technical
      - Include answers
      - Return ONLY valid JSON
      - Do not return more or fewer than ${requestedCount} questions

      Format:
      {
        "questions":[
          {
            "question":"string",
            "answer":"string"
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);

    const response = await result.response.text();

    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed = JSON.parse(cleaned);
    const questions = Array.isArray(parsed?.questions)
      ? parsed.questions.slice(0, requestedCount)
      : [];

    return { ...parsed, questions };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to generate interview");
  }
}