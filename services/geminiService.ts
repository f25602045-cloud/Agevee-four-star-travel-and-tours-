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
    Find the latest real-time verified online travel information for Gilgit-Baltistan districts:
    Skardu, Hunza, Gilgit, Astore, Ghizer, Ghanche, Kharmang, Nagar, and Diamer.

    Look for:
    1. Current weather conditions.
    2. Road status (Open/Closed/Caution) for major roads like KKH, Babusar Pass, Deosai, Skardu Road.
    3. Any active landslides or travel advisories.

    Output strict valid JSON inside a markdown block (e.g., \`\`\`json { ... } \`\`\`).
    The JSON structure must be:
    {
      "lastUpdated": "YYYY-MM-DD HH:MM",
      "generalAlerts": ["List of general major alerts"],
      "districts": [
        {
          "name": "District Name",
          "weather": { "temp": "25°C", "condition": "Sunny" },
          "roadStatus": { "status": "OPEN", "details": "Road is clear" },
          "advisory": "Specific advice"
        }
      ]
    }
    
    Ensure roadStatus.status is exactly 'OPEN', 'CLOSED', or 'CAUTION'.
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

    const text = response.text || "";
    // Extract JSON block
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/);
    
    if (jsonMatch && jsonMatch[1]) {
      const data = JSON.parse(jsonMatch[1]) as LiveStatusResponse;
      return { data, sources };
    } else {
       // Fallback if no code block found, try parsing raw text if it looks like JSON
       try {
         const data = JSON.parse(text) as LiveStatusResponse;
         return { data, sources };
       } catch (e) {
         console.warn("Could not parse AI response as JSON", text);
         return { data: null, sources };
       }
    }
  } catch (error) {
    console.error("Error fetching live updates:", error);
    return { data: null, sources: [] };
  }
};