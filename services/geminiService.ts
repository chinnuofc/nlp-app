
import { GoogleGenAI, Type } from "@google/genai";
import { ClassificationResult, Classification } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    classification: {
      type: Type.STRING,
      enum: [Classification.Spam, Classification.Ham],
      description: 'The classification of the message.',
    },
    probability: {
      type: Type.NUMBER,
      description: 'The confidence score for the classification, from 0.0 to 1.0.',
    },
  },
  required: ['classification', 'probability'],
};

export async function classifySmsMessage(message: string): Promise<ClassificationResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please classify the following SMS message: "${message}"`,
      config: {
        systemInstruction: "You are an expert SMS message classifier. Your task is to analyze an incoming SMS message and determine if it is 'Spam' or 'Ham' (a legitimate message). Provide your classification and a confidence probability score from 0.0 to 1.0. You must only respond in the specified JSON format.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedResult = JSON.parse(jsonString) as ClassificationResult;

    // Basic validation
    if (
      (parsedResult.classification === Classification.Spam || parsedResult.classification === Classification.Ham) &&
      typeof parsedResult.probability === 'number' &&
      parsedResult.probability >= 0 &&
      parsedResult.probability <= 1
    ) {
      return parsedResult;
    } else {
      throw new Error("Received invalid data structure from API.");
    }

  } catch (error) {
    console.error("Error classifying message:", error);
    throw new Error("Failed to get a valid classification from the AI. Please try again.");
  }
}
