
import { GoogleGenAI, Type, Modality } from "@google/genai";

export class GeminiService {
  private static instance: GeminiService;

  private constructor() {}

  public static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  /**
   * Generates a custom shoe design based on user input.
   * Strictly follows @google/genai coding guidelines.
   */
  async generateShoeDesign(prompt: string, aspectRatio: string = "1:1", material: string = "Technical Mesh") {
    // Standard high-performance model for 1K generation
    const modelName = 'gemini-2.5-flash-image';

    // Always initialize a fresh instance before calling to use latest API Key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    // Tailored for high-end 3D CAD aesthetic
    const fullPrompt = `A hyper-realistic 3D product render of a professional kid's sneaker. 
    Design Concept: ${prompt}. 
    Primary Material: ${material} with ultra-fine textures. 
    Technical Specs: Orthographic 3/4 side profile, single shoe, isolated on a neutral dark charcoal gradient studio stage. 
    Lighting: Professional product photography lighting, sharp rim highlights, volumetric shadows. 
    Style: High-end sneaker commercial, macro focus on materials and stitching.`;
    
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
          }
        },
      });

      const candidate = response.candidates?.[0];
      if (!candidate) throw new Error("Synthesis engine returned no data.");

      // Iterate through parts to find the image part (nano banana series rules)
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      
      throw new Error("No image data found in model response.");
    } catch (error: any) {
      console.error("Generation Pipeline Error:", error);
      
      // If unauthorized or not found, we signal the UI to show the key selection
      if (error.message?.includes("403") || error.message?.includes("401") || error.message?.includes("not found")) {
          throw new Error("AUTH_REQUIRED");
      }
      throw error;
    }
  }

  /**
   * Provides reasoning and shopping advice using thinking models.
   */
  async getShoppingAdvice(query: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: query,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: "You are the Head of Design at Kids KickLabs Nepal. You provide expert advice on kids' footwear. Keep responses concise and cultural."
        },
      });
      return response.text;
    } catch (error) {
      console.error("AI Assistant Error:", error);
      return "I encountered a processing delay. Please try again.";
    }
  }
}
