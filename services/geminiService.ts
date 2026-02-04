
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIConfigAdvice = async (userGoal: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As a Minecraft Server Architect, provide a recommended server.properties configuration and a list of 5 essential plugins for the following goal: "${userGoal}". Return the response in a structured JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedSoftware: { type: Type.STRING, description: "Software type e.g. Paper, Forge" },
            recommendedVersion: { type: Type.STRING },
            serverProperties: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  key: { type: Type.STRING },
                  value: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              }
            },
            plugins: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  purpose: { type: Type.STRING }
                }
              }
            },
            proTip: { type: Type.STRING }
          },
          required: ["recommendedSoftware", "serverProperties", "plugins"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini AI configuration failed:", error);
    return null;
  }
};
