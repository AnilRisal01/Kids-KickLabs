
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
   */
  async generateShoeDesign(prompt: string, aspectRatio: string = "1:1", size: string = "1K", material: string = "Technical Mesh") {
    const isHighQuality = size === "2K" || size === "4K";
    let modelName = 'gemini-2.5-flash-image';

    // If high quality is requested, we MUST use gemini-3-pro-image-preview and ensure a key is selected
    if (isHighQuality) {
      if (typeof window !== 'undefined' && (window as any).aistudio) {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await (window as any).aistudio.openSelectKey();
        }
      }
      modelName = 'gemini-3-pro-image-preview';
    }

    // Always create a fresh instance to use the most up-to-date API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    // Specifically tailored for KIDS shoes with extreme material focus and cinematic lighting
    const fullPrompt = `A ultra-realistic 3D product render of a single professional kid's sneaker footwear. 
    Theme: ${prompt}. 
    Primary Material: ${material} with visible high-definition grain, texture, and tactile quality. 
    Details: Vibrant color-blocking, intricate stitching, durable reinforced rubber soles with deep tread patterns. 
    Lighting: Cinematic studio lighting, sharp rim highlights to accentuate the silhouette, soft global illumination, realistic material-specific reflections (matte for canvas, semi-gloss for leather). 
    Background: Minimalist dark charcoal studio stage. 
    View: 3/4 side profile. 
    Style: High-end footwear photography, macro-detail focus on textures.`;
    
    try {
      const config: any = {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        }
      };

      if (modelName === 'gemini-3-pro-image-preview') {
        config.imageConfig.imageSize = size as any;
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: config,
      });

      const candidate = response.candidates?.[0];
      if (!candidate) throw new Error("No design generated.");

      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      
      return null;
    } catch (error: any) {
      console.error("Image Generation Error:", error);
      if (error.message?.includes("permission") || error.message?.includes("403")) {
          if (typeof window !== 'undefined' && (window as any).aistudio) {
              await (window as any).aistudio.openSelectKey();
          }
      }
      throw error;
    }
  }

  /**
   * Edits an existing design using text prompts.
   */
  async editShoeDesign(base64Image: string, editPrompt: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image.split(',')[1],
                mimeType: 'image/png',
              },
            },
            {
              text: `Modify this kid's shoe design according to this instruction: ${editPrompt}. Maintain the playful, child-focused proportions and clean studio style.`,
            },
          ],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Image Editing Error:", error);
      throw error;
    }
  }

  /**
   * Provides reasoning and shopping advice.
   */
  async getShoppingAdvice(query: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: query,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
          systemInstruction: "You are a friendly shopping assistant for Kids KickLabs in Nepal. You specialize in culturally inspired kids' footwear, sizing for growing feet, and durable materials for playtime. You are polite, helpful, and avoid any religious or controversial topics."
        },
      });
      return response.text;
    } catch (error) {
      console.error("AI Advice Error:", error);
      return "I'm having trouble thinking right now. Please try again later!";
    }
  }

  /**
   * Uses Google Search grounding to find news or trends.
   */
  async searchTrends(topic: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `What are the current trends in kids footwear or non-religious cultural patterns for ${topic}?`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      
      const text = response.text;
      const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      return { text, links };
    } catch (error) {
      console.error("Search Grounding Error:", error);
      return { text: "Couldn't fetch latest trends.", links: [] };
    }
  }

  /**
   * Generate a video commercial for the product.
   */
  async generateVideoCommercial(prompt: string) {
    if (typeof window !== 'undefined' && (window as any).aistudio) {
        if (!(await (window as any).aistudio.hasSelectedApiKey())) {
          await (window as any).aistudio.openSelectKey();
        }
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    try {
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `A bright, fun commercial for kids sneakers with ${prompt}. High quality, showing children playing in a vibrant environment in Nepal.`,
        config: {
          numberOfVideos: 1,
          resolution: '1080p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      return `${downloadLink}&key=${process.env.API_KEY}`;
    } catch (error) {
      console.error("Video Generation Error:", error);
      throw error;
    }
  }
}
