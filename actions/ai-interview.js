"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export async function generateInterviewQuestions(data) {
  try {
    const prompt = `
      Job Position: ${data.jobPosition}
      Job Description: ${data.jobDescription}
      Years of Experience: ${data.jobExperience}

      Generate ${process.env.NEXT_PUBLIC_NUMBER_OF_QUESTIONS} interview questions.

      Rules:
      - 3 questions must be technical
      - Include answers
      - Return ONLY valid JSON

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

    const response = result.response.text();

    const cleaned = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);

  } catch (error) {
    console.log(error);
    throw new Error("Failed to generate interview");
  }
}