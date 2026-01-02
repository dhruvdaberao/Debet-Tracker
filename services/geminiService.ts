
import { GoogleGenAI, Type } from "@google/genai";
import { PersonRecord } from "../types";

// Fixed: Replaced Transaction[] with PersonRecord[] to match actual types
export const getAIInsights = async (people: PersonRecord[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Format history for AI by summarizing net balance for each person in the ledger
  const historyText = people
    .map(p => {
      const balance = p.entries.reduce((acc, e) => acc + e.amount, 0);
      return `${p.name} has a net balance of ₹${balance} (${balance >= 0 ? 'owes me' : 'is owed by me'}).`;
    })
    .join(' ');

  const prompt = `
    You are 'Hisab Guru', a quirky yet formal financial advisor. 
    Review the following ledger summary: ${historyText || 'No transactions yet.'}
    Provide a brief, witty, and useful summary of the financial situation. 
    Use a tone that is professional but slightly cheeky. 
    Format the response as JSON with two fields: 'message' (a string) and 'advice' (a string).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: { type: Type.STRING },
            advice: { type: Type.STRING }
          },
          required: ["message", "advice"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Insight Error:", error);
    return { 
      message: "The abacus is jammed. I can't think straight right now.", 
      advice: "Keep track of your coins, even when I'm offline." 
    };
  }
};
