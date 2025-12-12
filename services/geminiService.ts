import { GoogleGenAI, Type } from "@google/genai";
import { DistrictDetails, LiveStatusResponse } from '../types';

const apiKey = process.env.API_KEY || ''; // In a real app, ensure this is handled securely
const ai = new GoogleGenAI({ apiKey });

export interface ItineraryRequest {
  destination: string;
  days: number;
  budget: string;
  interests: string[];
}

export const generateItinerary = async (request: ItineraryRequest): Promise<string> => {
  if (!apiKey) return "API Key is missing. Please configure your environment.";

  const prompt = `
    Create a detailed ${request.days}-day travel itinerary for ${request.destination || 'Gilgit-Baltistan'}.
    The traveler has a ${request.budget} budget.
    Their interests include: ${request.interests.join(', ')}.
    
    Structure the response clearly with Day 1, Day 2, etc.
    Include specific hotel recommendations (invent names if needed but keep them realistic) and estimated costs.
    Keep the tone professional and welcoming, matching the "Agevee Four Star" brand.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert travel consultant for Agevee Four Star, a premium tourism agency in Gilgit-Baltistan.",
      }
    });
    return response.text || "Sorry, I couldn't generate an itinerary at this moment.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while communicating with the AI travel assistant.";
  }
};

export const chatWithAI = async (message: string): Promise<string> => {
    if (!apiKey) return "API Key is missing.";
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: message,
            config: {
                systemInstruction: "You are a helpful assistant for the Agevee Four Star tourism website. You know everything about Gilgit-Baltistan geography, culture, and travel logistics. Keep answers concise."
            }
        });
        return response.text || "I didn't catch that.";
    } catch (error) {
        console.error("Chat Error", error);
        return "Service temporarily unavailable.";
    }
}

export const getDistrictDetails = async (districtName: string): Promise<DistrictDetails | null> => {
    if (!apiKey) {
      console.warn("API Key missing for getDistrictDetails");
      return null;
    }
  
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Provide a detailed travel guide for the ${districtName} district in Gilgit-Baltistan. 
        I need a rich overview, top natural places, historical sites, and recommended hotels.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overview: { type: Type.STRING, description: "A captivating 3-4 sentence introduction to the district." },
              naturalPlaces: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["name", "description"]
                }
              },
              historicalPlaces: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["name", "description"]
                }
              },
              hotels: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["name", "description"]
                }
              }
            },
            required: ["overview", "naturalPlaces", "historicalPlaces", "hotels"]
          }
        }
      });
  
      if (response.text) {
        return JSON.parse(response.text) as DistrictDetails;
      }
      return null;
    } catch (error) {
      console.error("Error fetching district details:", error);
      return null;
    }
  };

export const getLiveTravelUpdates = async (): Promise<{ data: LiveStatusResponse | null, sources: string[] }> => {
  if (!apiKey) {
    console.warn("API Key missing for getLiveTravelUpdates");
    return { data: null, sources: [] };
  }

  const prompt = `
    Retrieve the CURRENT, REAL-TIME weather and road conditions for Gilgit-Baltistan, Pakistan.
    Districts to check: Skardu, Hunza, Gilgit, Astore, Ghizer, Ghanche, Kharmang, Nagar, Diamer.
    
    Use Google Search to find the latest data (today's weather).
    
    Return the data as a raw JSON object. Do not format with markdown code blocks (no \`\`\`json).
    
    Required JSON Structure:
    {
      "lastUpdated": "Current Date & Time",
      "generalAlerts": ["List of any major travel warnings for the region"],
      "districts": [
        {
          "name": "District Name",
          "weather": { "temp": "Current Temperature (e.g., 15°C)", "condition": "Current Condition (e.g., Sunny, Snowing)" },
          "roadStatus": { "status": "OPEN" | "CLOSED" | "CAUTION", "details": "Brief status details" },
          "advisory": "Travel advisory for this district"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map(c => c.web?.uri)
      .filter((uri): uri is string => !!uri) || [];

    let text = response.text || "{}";
    // Aggressively clean up markdown if present
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    try {
      const data = JSON.parse(text) as LiveStatusResponse;
      return { data, sources };
    } catch (e) {
      console.warn("JSON Parse Failed, raw text:", text);
      return { data: null, sources };
    }
  } catch (error) {
    console.error("Error fetching live updates:", error);
    return { data: null, sources: [] };
  }
};