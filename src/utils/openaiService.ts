import { getOpenAIApiKey } from "./env";

const OPENAI_API_URL = "https://api.openai.com/v1";

export class OpenAIService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = getOpenAIApiKey();
    if (!this.apiKey) {
      throw new Error(
        "OpenAI API key is not configured. Please check your environment variables."
      );
    }
    this.model = "gpt-3.5-turbo";
  }

  async generateText(
    prompt: string,
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
      systemMessage?: string;
    } = {}
  ) {
    const {
      model = "gpt-3.5-turbo",
      maxTokens = 500,
      temperature = 0.7,
      systemMessage = "You are a helpful, creative, and empathetic AI assistant.",
    } = options;

    try {
      const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: prompt },
          ],
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `OpenAI API error: ${response.status} ${response.statusText}${
            errorData.error?.message ? ` - ${errorData.error.message}` : ""
          }`
        );
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || "";
    } catch (error) {
      console.error("OpenAI API call failed:", error);
      if (error instanceof Error) {
        if (error.message.includes("API key")) {
          throw new Error(
            "OpenAI API key is invalid or not configured. Please check your environment variables."
          );
        }
        throw error;
      }
      throw new Error("Failed to generate content. Please try again.");
    }
  }

  async transcribeAudio(audioBlob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");
    formData.append("model", "whisper-1");

    const response = await fetch(`${OPENAI_API_URL}/audio/transcriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.text || "";
  }

  async generatePersonalizedContent(
    userData: any,
    type: "journal_prompt" | "mood_boost" | "news_summary" | "memory_reflection"
  ) {
    const prompts = {
      journal_prompt: `Based on this user profile: ${JSON.stringify(
        userData
      )}, create a thoughtful, personalized journal prompt that resonates with their interests and current mood. Make it inspiring and introspective.`,
      mood_boost: `Create an uplifting, personalized message for someone with these interests: ${JSON.stringify(
        userData
      )}. Focus on their desired moods: ${userData.desiredMoods?.join(
        ", "
      )}. Be encouraging and specific to their personality.`,
      news_summary: `Generate a personalized news summary for someone interested in: ${userData.techInterests?.join(
        ", "
      )}. Make it engaging and relevant to their tech interests.`,
      memory_reflection: `Create a beautiful reflection about memories and moments, tailored for someone who enjoys: ${userData.bookGenres?.join(
        ", "
      )} books and ${userData.musicGenres?.join(
        ", "
      )} music. Make it poetic and meaningful.`,
    };

    return this.generateText(prompts[type], {
      temperature: 0.8,
      maxTokens: 300,
      systemMessage:
        "You are a thoughtful, empathetic companion who creates personalized, meaningful content that resonates deeply with the user.",
    });
  }

  async generateRecipe(recipeName: string, userData: any) {
    const prompt = `Generate a detailed recipe for ${recipeName}. 
    Consider these user preferences:
    - Cuisines they enjoy: ${userData.cuisines?.join(", ")}
    - Food preferences: ${userData.foodPreferences?.join(", ")}
    - Cooking level: ${userData.cookingLevel}
    - Dietary restrictions: ${userData.dietaryRestrictions}
    
    Format the response as JSON with these fields:
    {
      "name": "Recipe name",
      "description": "Brief description",
      "ingredients": ["list", "of", "ingredients"],
      "instructions": ["step", "by", "step", "instructions"],
      "cookTime": "estimated time",
      "servings": "number of servings",
      "difficulty": "Easy/Medium/Hard",
      "tips": ["cooking", "tips"],
      "nutritionalInfo": "brief nutritional info"
    }`;

    const response = await this.generateText(prompt, {
      temperature: 0.7,
      maxTokens: 800,
      systemMessage:
        "You are a professional chef who creates detailed, easy-to-follow recipes that match the user's preferences and dietary needs.",
    });

    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Error parsing recipe JSON:", error);
      throw new Error("Failed to generate recipe");
    }
  }

  async generatePlaylist(mood: string, userData: any) {
    const prompt = `Create a personalized playlist for someone who enjoys ${userData.musicGenres?.join(
      ", "
    )} music.
    Current mood: ${mood}
    Desired moods: ${userData.desiredMoods?.join(", ")}
    
    Format the response as JSON with these fields:
    {
      "title": "Playlist name",
      "description": "Brief description",
      "mood": "target mood",
      "songs": [
        {
          "title": "Song name",
          "artist": "Artist name",
          "reason": "Why this song fits the mood"
        }
      ],
      "totalDuration": "estimated duration",
      "spotifyLink": "spotify playlist link if available"
    }`;

    const response = await this.generateText(prompt, {
      temperature: 0.8,
      maxTokens: 600,
      systemMessage:
        "You are a music curator who creates perfect playlists that match the user's mood and musical taste.",
    });

    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Error parsing playlist JSON:", error);
      throw new Error("Failed to generate playlist");
    }
  }

  async generateTravelPlan(destination: string, userData: any) {
    const prompt = `Create a personalized travel plan for ${destination} for someone who:
    - Travel style: ${userData.travelStyle}
    - Interests: ${userData.techInterests?.join(", ")}
    - Food preferences: ${userData.foodPreferences?.join(", ")}
    - Cuisines they enjoy: ${userData.cuisines?.join(", ")}
    
    Format the response as JSON with these fields:
    {
      "destination": "Place name",
      "duration": "recommended duration",
      "bestTimeToVisit": "when to go",
      "itinerary": [
        {
          "day": "Day number",
          "activities": ["list", "of", "activities"],
          "food": ["recommended", "places", "to", "eat"],
          "tips": ["travel", "tips", "for", "the", "day"]
        }
      ],
      "budget": "estimated budget",
      "packingList": ["essential", "items", "to", "pack"],
      "localTips": ["useful", "local", "knowledge"]
    }`;

    const response = await this.generateText(prompt, {
      temperature: 0.7,
      maxTokens: 1000,
      systemMessage:
        "You are a travel expert who creates detailed, personalized travel plans that match the user's interests and preferences.",
    });

    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Error parsing travel plan JSON:", error);
      throw new Error("Failed to generate travel plan");
    }
  }

  async generateJournalPrompt(userData: any) {
    const prompt = `Create a thoughtful journal prompt for someone who:
    - Enjoys ${userData.bookGenres?.join(", ")} books
    - Is interested in ${userData.techInterests?.join(", ")}
    - Desires these moods: ${userData.desiredMoods?.join(", ")}
    - Has these wellness areas: ${userData.wellnessAreas?.join(", ")}
    
    Format the response as JSON with these fields:
    {
      "prompt": "The journal prompt",
      "theme": "The underlying theme",
      "suggestedDuration": "How long to spend on this",
      "followUpQuestions": ["related", "questions", "to", "explore"],
      "mood": "Expected emotional impact"
    }`;

    const response = await this.generateText(prompt, {
      temperature: 0.8,
      maxTokens: 400,
      systemMessage:
        "You are a thoughtful writing coach who creates meaningful journal prompts that help users explore their thoughts and feelings.",
    });

    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Error parsing journal prompt JSON:", error);
      throw new Error("Failed to generate journal prompt");
    }
  }

  async generateMemoryReflection(memory: string, userData: any) {
    const prompt = `Create a beautiful reflection about this memory: "${memory}"
    For someone who:
    - Enjoys ${userData.bookGenres?.join(", ")} books
    - Loves ${userData.musicGenres?.join(", ")} music
    - Values ${userData.wellnessAreas?.join(", ")}
    
    Format the response as JSON with these fields:
    {
      "reflection": "The main reflection",
      "poeticElement": "A poetic interpretation",
      "lessons": ["key", "insights", "from", "the", "memory"],
      "mood": "The emotional tone",
      "suggestedActions": ["ways", "to", "honor", "this", "memory"]
    }`;

    const response = await this.generateText(prompt, {
      temperature: 0.9,
      maxTokens: 500,
      systemMessage:
        "You are a poetic writer who creates beautiful reflections that help users cherish and learn from their memories.",
    });

    try {
      return JSON.parse(response);
    } catch (error) {
      console.error("Error parsing memory reflection JSON:", error);
      throw new Error("Failed to generate memory reflection");
    }
  }

  async generateImage(prompt: string): Promise<string> {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            prompt,
            n: 1,
            size: "512x512",
            response_format: "url",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `OpenAI API error: ${response.status} - ${
            errorData.error?.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      return data.data[0].url;
    } catch (error) {
      console.error("Error generating image:", error);
      throw error;
    }
  }
}

// Singleton instance
let openAIInstance: OpenAIService | null = null;

export const getOpenAIService = (): OpenAIService => {
  if (!openAIInstance) {
    openAIInstance = new OpenAIService();
  }
  return openAIInstance;
};
