import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { supabase } from "../config/supabaseClient.js";
import axios from "axios";
import { GoogleGenerativeAI, GoogleGenerativeAIFetchError } from "@google/generative-ai";
import { systemPrompt } from "../config/systemPrompt.js";
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY ?? ""; // Provide a fallback
const genAI = new GoogleGenerativeAI(apiKey);
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const generateWithRetry = async (prompt: string, retries = 3): Promise<string> => {
  const models = ["gemini-2.5-flash", "gemini-1.5-flash"]; // fallback chain

  for (const modelName of models) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const response = await model.generateContent(prompt);
        return response.response.text();
      } catch (error) {
        const is503 = error instanceof GoogleGenerativeAIFetchError && error.status === 503;
        const isLastAttempt = attempt === retries;

        if (is503 && !isLastAttempt) {
          const delay = 1000 * 2 ** attempt; // 2s, 4s, 8s
          console.warn(`[${modelName}] 503 on attempt ${attempt}, retrying in ${delay}ms...`);
          await sleep(delay);
        } else if (is503 && isLastAttempt) {
          console.warn(`[${modelName}] failed after ${retries} attempts, trying next model...`);
          break; // try next model in the chain
        } else {
          throw error; // non-503 error, don't retry
        }
      }
    }
  }

  throw new Error("All models failed after retries");
};

export const aiChat = async (req: Request, res: Response, next: NextFunction) => {
  const { messages } = req.body;

  try {
    const lastMessage = messages[messages.length - 1];
    const prompt = `${systemPrompt}\nUser: ${lastMessage.content}`;

    const reply = await generateWithRetry(prompt);
    res.json({ reply });
  } catch (error) {
    console.error("Error calling Google Gemini API:", error);

    const is503 = error instanceof GoogleGenerativeAIFetchError && error.status === 503;
    res.status(is503 ? 503 : 500).json({
      error: is503
        ? "AI service is temporarily unavailable. Please try again in a moment."
        : "Error fetching AI response",
    });
  }
};

// export const aiChat = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {

//   const { messages } = req.body;

//   try {
//     const lastMessage = messages[messages.length - 1];
//     const prompt = `${systemPrompt}\nUser: ${lastMessage.content}`;
//     // const prompt = `${systemPrompt}\nUser: ${messages[0].content}`;

//     // Call generateContent with a string prompt
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", "gemini-1.5-flash" });
//     const response = await model.generateContent(prompt);

//     // Assuming the response has a .response.text() method to get the generated text
//     const reply = response.response.text();
//     res.json({ reply });
//   } catch (error) {
//     console.error("Error calling Google Gemini API:", error);
//     res.status(500).json({ error: "Error fetching AI response" });
//     // next(error);
//   }
// };

