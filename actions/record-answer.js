"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

import { db } from "@/utils/db"

import { UserAnswer } from "@/utils/schema"

import moment from "moment"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
  },
})

export async function saveUserAnswer(data) {

  try {

    const feedbackPrompt = `
      Question: ${data.question}

      User Answer: ${data.userAnswer}

      Based on the question and answer,
      give rating and feedback.

      Return JSON only:

      {
        "rating":"number",
        "feedback":"string"
      }
    `

    const result = await model.generateContent(feedbackPrompt)

    const response = await result.response.text()

    const JsonFeedbackResp = JSON.parse(response)

    await db.insert(UserAnswer).values({

      mockIdRef: data.mockIdRef,

      question: data.question,

      correctAns: data.correctAns,

      userAns: data.userAnswer,

      feedback: JsonFeedbackResp.feedback,

      rating: JsonFeedbackResp.rating,

      userEmail: data.userEmail,

      createdAt: moment().format("DD-MM-YYYY"),
    })

    return {
      success: true,
    }

  } catch (error) {

    console.log(error)

    return {
      success: false,
      error: error.message,
    }
  }
}