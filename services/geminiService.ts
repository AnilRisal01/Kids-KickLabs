
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
  async generateShoeDesign(prompt: string, aspectRatio: string = "1:1", size: string = "1K", material: string = "Technical Mesh") {
    const isHighQuality = size === "2K" || size === "4K";
    let modelName = 'gemini-2.5-flash-image';

    // Mandatory key selection check for Pro models
    if (isHighQuality) {
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await (window as any).aistudio.openSelectKey();
          // Assume success after trigger as per race condition rules
        }
      }
      modelName = 'gemini-3-pro-image-preview';
    }

    // Always initialize a fresh instance before calling to use latest API Key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    // Tailored for high-end 3D CAD aesthetic
    const fullPrompt = `A hyper-realistic 3D product render of a professional kid's sneaker. 
    Design Concept: ${prompt}. 
    Primary Material focus: ${material} with ultra-fine texture detail and realistic subsurface scattering. 
    Technical Specs: Orthographic 3/4 side profile, single shoe, isolated on a neutral dark charcoal gradient studio stage. 
    Lighting: Volumetric spotlighting, sharp rim light highlights to accentuate the footwear's silhouette, soft global illumination. 
    Style: High-end sneaker commercial photography, macro focus on materials and stitching.`;
    
    try {
      const config: any = {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      };

      if (modelName === 'gemini-3-pro-image-preview') {
        config.imageConfig.imageSize = size;
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: config,
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
      
      // Handle the "Requested entity was not found" error by prompting for a key again
      if (error.message?.includes("Requested entity was not found") || error.message?.includes("403")) {
          if (typeof window !== 'undefined' && (window as any).aistudio) {
              await (window as any).aistudio.openSelectKey();
          }
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
          systemInstruction: "You are the Head of Design at Kids KickLabs Nepal. You provide expert advice on kids' footwear, focusing on cultural heritage, durability, and growth-friendly sizing. You are professional yet encouraging. Keep responses concise."
        },
      });
      return response.text;
    } catch (error) {
      console.error("AI Assistant Error:", error);
      return "I encountered a processing delay. Please try again or contact support.";
    }
  }
}
