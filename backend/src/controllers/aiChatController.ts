import { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv';
import { supabase } from "../config/supabaseClient.js";
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";
import {systemPrompt} from "../config/systemPrompt.js"
dotenv.config();

const apiKey = process.env.GOOGLE_API_KEY ?? ""; // Provide a fallback
const genAI = new GoogleGenerativeAI(apiKey);


export const aiChat = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { messages } = req.body;
    try {
      const lastMessage = messages[messages.length - 1];
      const prompt = `${systemPrompt}\nUser: ${lastMessage.content}`;
        // const prompt = `${systemPrompt}\nUser: ${messages[0].content}`;
    
        // Call generateContent with a string prompt
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const response = await model.generateContent(prompt);
    
        // Assuming the response has a .response.text() method to get the generated text
        const reply = response.response.text();
        res.json({ reply });
      } catch (error) {
        console.error("Error calling Google Gemini API:", error);
        res.status(500).json({ error: "Error fetching AI response" });
        next(error);
      }
  };