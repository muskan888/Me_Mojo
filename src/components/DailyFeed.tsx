import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Music,
  Quote,
  Calendar,
  Book,
  Film,
  Coffee,
  Brain,
  Bookmark,
  MapPin,
  Camera,
  Sparkles,
  Video,
  Youtube,
  Podcast,
  FileText,
  Palette,
  Users,
  Plane,
  Target,
  Sun,
  BookOpen,
  Utensils,
  Laptop,
  Briefcase,
  UserCircle,
  Gift,
  Image as ImageIcon,
  RefreshCw,
  Newspaper,
  Headphones,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MoodToggle } from "@/components/MoodToggle";
import { NewsFeed } from "@/components/NewsFeed";
import { RecipeCard } from "@/components/RecipeCard";
import { PeopleMemories } from "@/components/PeopleMemories";
import { TravelPlanner } from "@/components/TravelPlanner";
import { SurpriseMe } from "@/components/SurpriseMe";
import { LoveButton } from "@/components/LoveButton";
import { UserPreferencesService } from "@/utils/userPreferences";
import { getOpenAIService } from "@/utils/openaiService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface DailyFeedProps {
  userData: any;
  onSaveToJournal: (item: any) => void;
}

export const DailyFeed = ({ userData, onSaveToJournal }: DailyFeedProps) => {
  const [feedItems, setFeedItems] = useState<any[]>([]);
  const [currentMood, setCurrentMood] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  // Add cache for storing generated content
  const [contentCache, setContentCache] = useState<
    Record<
      string,
      {
        items: any[];
        timestamp: number;
      }
    >
  >({});

  const formatContent = (content: string) => {
    if (!content) return "No content available.";

    // First, handle headers
    let formatted = content
      .replace(
        /^##\s+(.*)$/gm,
        '<h2 class="text-xl font-semibold mt-6 mb-4 text-primary">$1</h2>'
      )
      .replace(
        /^###\s+(.*)$/gm,
        '<h3 class="text-lg font-medium mt-4 mb-3">$1</h3>'
      );

    // Handle links with proper formatting
    formatted = formatted.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline font-medium">$1</a>'
    );

    // Handle bold text
    formatted = formatted.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong class="font-semibold">$1</strong>'
    );

    // Handle bullet points
    formatted = formatted.replace(
      /^\s*•\s+(.*)$/gm,
      '<li class="ml-4">$1</li>'
    );

    // Wrap bullet points in a list
    formatted = formatted.replace(
      /<li class="ml-4">.*?<\/li>/gs,
      (match) => `<ul class="list-disc space-y-1 my-3">${match}</ul>`
    );

    // Handle horizontal rules
    formatted = formatted.replace(
      /^---$/gm,
      '<hr class="my-6 border-t border-border" />'
    );

    // Handle paragraphs
    formatted = formatted
      .split("\n\n")
      .map((para) => {
        if (para.trim().startsWith("<")) return para; // Don't wrap HTML elements
        return `<p class="mb-3 leading-relaxed">${para}</p>`;
      })
      .join("");

    // Clean up any extra whitespace
    formatted = formatted.replace(/\n{3,}/g, "\n\n").trim();

    return formatted;
  };

  const formatArray = (value: string | string[] | undefined): string => {
    if (!value) return "various";
    if (Array.isArray(value)) return value.join(", ");
    return value;
  };

  const generateTabContent = async (section: string) => {
    // Check if we have cached content that's less than 1 hour old
    const cachedContent = contentCache[section];
    const oneHourAgo = Date.now() - 60 * 60 * 1000; // 1 hour in milliseconds

    if (cachedContent && cachedContent.timestamp > oneHourAgo) {
      setFeedItems(cachedContent.items);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    const items = [];
    const openAI = getOpenAIService();

    try {
      switch (section) {
        case "news":
          // Generate news based on specific interests
          const newsPrompt = `Create a personalized news summary for someone interested in:
          - Specific Interests: ${formatArray(userData.interests)}
          - Tech Interests: ${formatArray(userData.techInterests)}
          - Industries: ${formatArray(userData.industries)}
          
          For each interest:
          1. Find the most recent and relevant news
          2. Include a direct link to the source article (format as: [Title](URL))
          3. Provide a brief summary (2-3 sentences)
          4. Explain why it matters to someone with these interests
          5. Include key statistics or facts when relevant
          
          Format each news item exactly as follows (maintain this exact structure):
          
          ## [Interest Category]
          
          ### [Article Title]
          [Article Title](https://source-url.com)
          
          **Summary:** [2-3 sentence summary]
          
          **Why It Matters:** [Explanation of relevance]
          
          **Key Facts:**
          • [Fact 1]
          • [Fact 2]
          • [Fact 3]
          
          ---
          
          Keep the tone professional but engaging. Each news item should be clearly separated with proper formatting.`;

          const newsContent = await openAI.generateText(newsPrompt, {
            temperature: 0.7,
            maxTokens: 1000,
            systemMessage:
              "You are a news curator who provides detailed, interest-specific updates with source links and clear formatting. Always include real, working URLs for sources. Maintain strict formatting with clear section breaks.",
          });

          items.push({
            id: "news",
            title: "Personalized News",
            content: formatContent(newsContent),
            icon: Newspaper,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["news", "updates"],
            imagePrompt: `A dynamic news scene representing ${
              userData.interests?.[0] || "current events"
            }, with modern news elements and engaging composition`,
          });

          // Generate industry-specific news
          const industryPrompt = `Create industry-specific news for someone interested in:
          - Industries: ${formatArray(userData.industries)}
          - Professional Interests: ${formatArray(
            userData.professionalInterests
          )}
          - Career Goals: ${formatArray(userData.careerGoals)}
          
          For each industry:
          1. Find the most recent developments
          2. Include a direct link to the source article
          3. Provide a concise summary
          4. Explain the impact on their career goals
          5. Include relevant statistics or data
          
          Format each item as:
          [Industry Name]
          [Source Link]
          [Summary]
          [Career Impact]
          [Key Data]
          
          Focus on actionable insights and career relevance.`;

          const industryContent = await openAI.generateText(industryPrompt, {
            temperature: 0.7,
            maxTokens: 600,
            systemMessage:
              "You are an industry analyst who provides detailed, actionable insights with source links and clear formatting.",
          });

          items.push({
            id: "industry",
            title: "Industry Insights",
            content: formatContent(industryContent),
            icon: Briefcase,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["industry", "career"],
            imagePrompt: `A professional industry scene representing ${
              userData.industries?.[0] || "business"
            }, with modern office elements and professional atmosphere`,
          });
          break;

        case "music":
          // Generate music recommendations based on specific interests
          const musicPrompt = `Create music recommendations for someone who enjoys:
          - Music Genres: ${formatArray(userData.musicGenres)}
          - Specific Interests: ${formatArray(userData.interests)}
          - Current Mood: ${
            currentMood || formatArray(userData.desiredMoods) || "relaxed"
          }
          
          For each interest:
          1. Suggest songs that match both the interest and current mood
          2. Include artists that align with their specific interests
          3. Explain why each recommendation fits their taste
          
          Format with clear sections for each interest area.`;

          const musicContent = await openAI.generateText(musicPrompt, {
            temperature: 0.8,
            maxTokens: 400,
            systemMessage:
              "You are a music expert who creates deeply personalized playlists based on specific interests and moods.",
          });

          items.push({
            id: "music",
            title: "Music Recommendations",
            content: formatContent(musicContent),
            icon: Music,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["music", "playlist"],
            imagePrompt: `A vibrant music scene representing ${
              userData.musicGenres?.[0] || "music"
            }, with dynamic elements and mood-appropriate atmosphere`,
          });
          break;

        case "food":
          // Generate recipe recommendation
          const recipePrompt = `Create a recipe for someone who:
          - Cuisines: ${formatArray(userData.cuisines)}
          - Food Preferences: ${formatArray(userData.foodPreferences)}
          - Dietary Restrictions: ${userData.dietaryRestrictions || "none"}
          - Cooking Level: ${userData.cookingLevel || "intermediate"}
          
          Include a complete recipe with ingredients and step-by-step instructions.`;

          const recipe = await openAI.generateText(recipePrompt, {
            temperature: 0.7,
            maxTokens: 400,
            systemMessage:
              "You are a culinary expert who creates personalized recipes.",
          });

          items.push({
            id: "recipe",
            title: "Today's Recipe",
            content: formatContent(recipe),
            icon: Utensils,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["food", "recipe"],
          });

          // Generate restaurant recommendation
          const restaurantPrompt = `Suggest restaurants for someone who:
          - Cuisines: ${formatArray(userData.cuisines)}
          - Food Preferences: ${formatArray(userData.foodPreferences)}
          - Dietary Restrictions: ${userData.dietaryRestrictions || "none"}
          - Dining Style: ${userData.diningStyle || "casual"}
          
          Recommend 3 restaurants with brief descriptions of their specialties.`;

          const restaurantRecommendations = await openAI.generateText(
            restaurantPrompt,
            {
              temperature: 0.7,
              maxTokens: 300,
              systemMessage:
                "You are a food critic who makes perfect restaurant recommendations.",
            }
          );

          items.push({
            id: "restaurants",
            title: "Restaurant Recommendations",
            content: formatContent(restaurantRecommendations),
            icon: MapPin,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["food", "dining"],
          });
          break;

        case "wellness":
          // Generate wellness tip
          const wellnessPrompt = `Create wellness advice for someone who:
          - Wellness Areas: ${formatArray(userData.wellnessAreas)}
          - Energy Level: ${userData.energyLevels || "balanced"}
          - Lifestyle: ${userData.lifestyle || "moderate"}
          
          Provide 3 practical wellness tips tailored to their needs.`;

          const wellnessTips = await openAI.generateText(wellnessPrompt, {
            temperature: 0.7,
            maxTokens: 300,
            systemMessage:
              "You are a wellness coach who provides practical, personalized advice.",
          });

          items.push({
            id: "wellness",
            title: "Wellness Tips",
            content: formatContent(wellnessTips),
            icon: Heart,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["wellness", "health"],
          });

          // Generate meditation/mindfulness content
          const mindfulnessPrompt = `Create mindfulness guidance for someone who:
          - Meditation Experience: ${
            userData.meditationExperience || "beginner"
          }
          - Stress Level: ${userData.stressLevel || "moderate"}
          - Wellness Goals: ${formatArray(userData.wellnessGoals)}
          
          Provide a short meditation or mindfulness exercise.`;

          const mindfulnessContent = await openAI.generateText(
            mindfulnessPrompt,
            {
              temperature: 0.7,
              maxTokens: 200,
              systemMessage:
                "You are a mindfulness guide who creates calming, effective exercises.",
            }
          );

          items.push({
            id: "mindfulness",
            title: "Mindfulness Moment",
            content: formatContent(mindfulnessContent),
            icon: Sparkles,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["wellness", "mindfulness"],
          });
          break;

        case "video":
          // Generate video recommendations
          const videoPrompt = `Recommend videos for someone who enjoys:
          - Video Types: ${formatArray(userData.videoTypes)}
          - Interests: ${formatArray(userData.interests)}
          - Learning Style: ${userData.learningStyle || "visual"}
          
          Suggest 3 videos (movies, shows, or educational content) with brief descriptions and why they would enjoy them.`;

          const videoRecommendations = await openAI.generateText(videoPrompt, {
            temperature: 0.8,
            maxTokens: 300,
            systemMessage:
              "You are a video curator who makes perfect content recommendations.",
          });

          items.push({
            id: "videos",
            title: "Video Recommendations",
            content: formatContent(videoRecommendations),
            icon: Video,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["entertainment", "video"],
            imagePrompt: `A cinematic scene representing ${
              userData.videoTypes?.[0] || "entertainment"
            }, with warm lighting and engaging composition`,
          });

          // Generate streaming suggestions
          const streamingPrompt = `Suggest streaming content for someone who:
          - Streaming Services: ${formatArray(userData.streamingServices)}
          - Video Preferences: ${formatArray(userData.videoPreferences)}
          - Mood: ${
            currentMood || formatArray(userData.desiredMoods) || "relaxed"
          }
          
          Recommend 3 shows or movies from their streaming services that match their current mood.`;

          const streamingContent = await openAI.generateText(streamingPrompt, {
            temperature: 0.8,
            maxTokens: 300,
            systemMessage:
              "You are a streaming expert who finds perfect content for any mood.",
          });

          items.push({
            id: "streaming",
            title: "Streaming Suggestions",
            content: formatContent(streamingContent),
            icon: Video,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["streaming", "entertainment"],
            imagePrompt: `A cozy streaming setup with ${
              userData.streamingServices?.[0] || "popular streaming service"
            } interface, warm lighting, and comfortable seating`,
          });
          break;

        case "people":
          // Generate social connection suggestions
          const socialPrompt = `Create social connection suggestions for someone who:
          - Social Style: ${userData.socialStyle || "balanced"}
          - Relationship Status: ${userData.relationshipStatus || "single"}
          - Social Goals: ${formatArray(userData.socialGoals)}
          
          Provide 3 specific ways to connect with others based on their preferences.`;

          const socialSuggestions = await openAI.generateText(socialPrompt, {
            temperature: 0.8,
            maxTokens: 300,
            systemMessage:
              "You are a social connection expert who helps people build meaningful relationships.",
          });

          items.push({
            id: "social",
            title: "Social Connection Tips",
            content: formatContent(socialSuggestions),
            icon: Users,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["social", "connections"],
            imagePrompt: `A warm, inviting social gathering scene with diverse people connecting and sharing experiences`,
          });

          // Generate networking opportunities
          const networkingPrompt = `Suggest networking opportunities for someone interested in:
          - Industries: ${formatArray(userData.industries)}
          - Professional Interests: ${formatArray(
            userData.professionalInterests
          )}
          - Career Goals: ${formatArray(userData.careerGoals)}
          
          Recommend 3 specific networking events or opportunities that align with their career path.`;

          const networkingContent = await openAI.generateText(
            networkingPrompt,
            {
              temperature: 0.7,
              maxTokens: 300,
              systemMessage:
                "You are a networking expert who connects professionals with relevant opportunities.",
            }
          );

          items.push({
            id: "networking",
            title: "Networking Opportunities",
            content: formatContent(networkingContent),
            icon: UserCircle,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["professional", "networking"],
            imagePrompt: `A professional networking event with people engaging in meaningful conversations, modern office setting`,
          });
          break;

        case "travel":
          // Generate travel inspiration
          const travelPrompt = `Create travel inspiration for someone who:
          - Travel Style: ${userData.travelStyle || "adventure"}
          - Dream Destinations: ${formatArray(userData.dreamDestinations)}
          - Interests: ${formatArray(userData.interests)}
          
          Suggest 3 travel experiences or destinations that match their style and interests.`;

          const travelInspiration = await openAI.generateText(travelPrompt, {
            temperature: 0.8,
            maxTokens: 300,
            systemMessage:
              "You are a travel expert who creates inspiring travel recommendations.",
          });

          items.push({
            id: "travel",
            title: "Travel Inspiration",
            content: formatContent(travelInspiration),
            icon: Plane,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["travel", "adventure"],
            imagePrompt: `A breathtaking travel destination scene with ${
              userData.travelStyle || "adventure"
            } elements, vibrant colors, and inspiring composition`,
          });

          // Generate local exploration ideas
          const localPrompt = `Suggest local exploration ideas for someone who:
          - Local Interests: ${formatArray(userData.localInterests)}
          - Activity Preferences: ${formatArray(userData.activityPreferences)}
          - Energy Level: ${userData.energyLevels || "balanced"}
          
          Recommend 3 local activities or places to explore based on their preferences.`;

          const localContent = await openAI.generateText(localPrompt, {
            temperature: 0.8,
            maxTokens: 300,
            systemMessage:
              "You are a local exploration expert who finds hidden gems in any area.",
          });

          items.push({
            id: "local",
            title: "Local Exploration",
            content: formatContent(localContent),
            icon: MapPin,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["local", "exploration"],
            imagePrompt: `A charming local scene with ${
              userData.localInterests?.[0] || "interesting local attractions"
            }, warm lighting, and inviting atmosphere`,
          });
          break;

        case "surprise":
          // Generate random discovery
          const discoveryPrompt = `Create a surprise discovery for someone who:
          - Interests: ${formatArray(userData.interests)}
          - Personality: ${userData.personalityType || "curious"}
          - Current Mood: ${
            currentMood || formatArray(userData.desiredMoods) || "adventurous"
          }
          
          Suggest something unexpected but delightful that they might enjoy.`;

          const discovery = await openAI.generateText(discoveryPrompt, {
            temperature: 0.9,
            maxTokens: 300,
            systemMessage:
              "You are a discovery expert who creates delightful surprises.",
          });

          items.push({
            id: "discovery",
            title: "Surprise Discovery",
            content: formatContent(discovery),
            icon: Gift,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["surprise", "discovery"],
            imagePrompt: `A magical, surprising scene with elements of ${
              userData.interests?.[0] || "wonder"
            }, sparkles, and unexpected delights`,
          });

          // Generate random challenge
          const challengePrompt = `Create a fun challenge for someone who:
          - Challenge Level: ${userData.challengeLevel || "moderate"}
          - Interests: ${formatArray(userData.interests)}
          - Energy Level: ${userData.energyLevels || "balanced"}
          
          Suggest a unique, engaging challenge that matches their interests and energy level.`;

          const challenge = await openAI.generateText(challengePrompt, {
            temperature: 0.9,
            maxTokens: 300,
            systemMessage:
              "You are a challenge creator who makes engaging, fun activities.",
          });

          items.push({
            id: "challenge",
            title: "Fun Challenge",
            content: formatContent(challenge),
            icon: Sparkles,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["challenge", "fun"],
            imagePrompt: `An exciting challenge scene with dynamic energy, ${
              userData.interests?.[0] || "engaging elements"
            }, and motivational atmosphere`,
          });
          break;

        case "podcasts":
          // Generate personalized podcast recommendations
          const podcastPrompt = `Create personalized podcast recommendations for someone interested in:
          - Specific Interests: ${formatArray(userData.interests)}
          - Tech Interests: ${formatArray(userData.techInterests)}
          - Industries: ${formatArray(userData.industries)}
          - Professional Interests: ${formatArray(
            userData.professionalInterests
          )}
          
          For each interest area:
          1. Recommend 2-3 relevant podcasts or YouTube channels
          2. Include direct links to the latest episodes
          3. Provide a brief description of why they would enjoy it
          4. Include key topics covered
          
          Format each recommendation exactly as follows:
          
          ## [Interest Category] Podcasts & Channels
          
          ### [Podcast/Channel Name]
          [Latest Episode Title](https://youtube.com/...)
          
          **Description:** [2-3 sentence description of the podcast/channel]
          
          **Why You'll Like It:** [Personalized explanation based on their interests]
          
          **Key Topics:**
          • [Topic 1]
          • [Topic 2]
          • [Topic 3]
          
          ---
          
          Keep recommendations highly relevant to their specific interests and include a mix of podcasts and YouTube channels.`;

          const podcastContent = await openAI.generateText(podcastPrompt, {
            temperature: 0.7,
            maxTokens: 1000,
            systemMessage:
              "You are a podcast and YouTube content curator who provides personalized recommendations with direct links to episodes. Focus on high-quality, relevant content that matches the user's specific interests.",
          });

          items.push({
            id: "podcasts",
            title: "Personalized Podcasts & Channels",
            content: formatContent(podcastContent),
            icon: Headphones,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["podcasts", "youtube", "content"],
            imagePrompt: `A modern podcast studio scene representing ${
              userData.interests?.[0] || "content creation"
            }, with professional recording equipment and engaging atmosphere`,
          });

          // Generate learning resources
          const learningPrompt = `Create personalized learning content recommendations for someone interested in:
          - Specific Interests: ${formatArray(userData.interests)}
          - Tech Interests: ${formatArray(userData.techInterests)}
          - Professional Interests: ${formatArray(
            userData.professionalInterests
          )}
          
          For each interest area:
          1. Recommend 2-3 educational YouTube channels or podcasts
          2. Include direct links to the most relevant episodes
          3. Explain how it helps with their learning goals
          4. List key learning outcomes
          
          Format each recommendation exactly as follows:
          
          ## [Interest Category] Learning Resources
          
          ### [Channel/Podcast Name]
          [Latest Episode Title](https://youtube.com/...)
          
          **Description:** [2-3 sentence description of the educational content]
          
          **Learning Value:** [Explanation of how it helps with their goals]
          
          **Key Takeaways:**
          • [Takeaway 1]
          • [Takeaway 2]
          • [Takeaway 3]
          
          ---
          
          Focus on high-quality educational content that matches their specific interests and learning goals.`;

          const learningContent = await openAI.generateText(learningPrompt, {
            temperature: 0.7,
            maxTokens: 800,
            systemMessage:
              "You are an educational content curator who provides personalized learning recommendations with direct links to episodes. Focus on high-quality, educational content that matches the user's specific interests and learning goals.",
          });

          items.push({
            id: "learning",
            title: "Learning Resources",
            content: formatContent(learningContent),
            icon: BookOpen,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["learning", "education", "youtube"],
            imagePrompt: `An educational content scene representing ${
              userData.interests?.[0] || "learning"
            }, with modern learning tools and engaging atmosphere`,
          });
          break;

        case "overview":
        default:
          // Generate personalized greeting with interest focus
          const greetingPrompt = `Create a warm, personalized greeting for someone who:
          - Name: ${userData.name || "there"}
          - Specific Interests: ${formatArray(userData.interests)}
          - Personality: ${userData.personalityType || "friendly"}
          - Current Time: ${getTimeOfDay()}
          
          Include:
          1. A warm greeting
          2. Reference to their specific interests
          3. A positive note about their current time of day
          4. A personalized wish for the day ahead
          
          Make it feel personal and connected to their interests.`;

          const greeting = await openAI.generateText(greetingPrompt, {
            temperature: 0.8,
            maxTokens: 200,
            systemMessage:
              "You are a warm, friendly AI companion who creates deeply personalized greetings that reference specific interests.",
          });

          items.push({
            id: "greeting",
            title: "Your Daily Greeting",
            content: formatContent(greeting),
            icon: Sun,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["personalized", "daily"],
            imagePrompt: `A warm, welcoming scene with elements of ${
              userData.interests?.[0] || "personal interests"
            }, ${getTimeOfDay()} lighting, and friendly atmosphere`,
          });

          // Generate interest-based inspiration
          const inspirationPrompt = `Create daily inspiration for someone who:
          - Specific Interests: ${formatArray(userData.interests)}
          - Goals: ${formatArray(userData.goals)}
          - Current Mood: ${
            currentMood || formatArray(userData.desiredMoods) || "motivated"
          }
          
          Include:
          1. An inspiring message related to their specific interests
          2. A small action step connected to their interests
          3. A motivational quote that resonates with their interests
          4. A suggestion for how to incorporate their interests into their day
          
          Make it deeply personal and connected to their specific interests.`;

          const inspiration = await openAI.generateText(inspirationPrompt, {
            temperature: 0.8,
            maxTokens: 300,
            systemMessage:
              "You are an inspirational coach who creates personalized motivation based on specific interests and goals.",
          });

          items.push({
            id: "inspiration",
            title: "Daily Inspiration",
            content: formatContent(inspiration),
            icon: Sparkles,
            timestamp: new Date().toLocaleTimeString(),
            tags: ["inspiration", "motivation"],
            imagePrompt: `An inspiring scene with elements of ${
              userData.interests?.[0] || "personal interests"
            }, motivational elements, and uplifting atmosphere`,
          });
          break;
      }

      // Generate images for each item
      for (const item of items) {
        if (item.imagePrompt) {
          try {
            const imageUrl = await openAI.generateImage(item.imagePrompt);
            item.image = imageUrl;
          } catch (error) {
            console.error("Error generating image:", error);
            // Continue without image if generation fails
          }
        }
      }

      // After generating content, cache it
      setContentCache((prev) => ({
        ...prev,
        [section]: {
          items,
          timestamp: Date.now(),
        },
      }));

      setFeedItems(items);
    } catch (error) {
      console.error("Detailed error in content generation:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Error Generating Content",
        description: `Failed to generate personalized content: ${errorMessage}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add function to force refresh content
  const refreshContent = () => {
    setContentCache((prev) => {
      const newCache = { ...prev };
      delete newCache[activeSection];
      return newCache;
    });
    generateTabContent(activeSection);
  };

  useEffect(() => {
    if (userData) {
      generateTabContent(activeSection);
    } else {
      setError("No user data available");
      setIsLoading(false);
    }
  }, [userData, activeSection, currentMood]);

  // Helper function to generate image prompts
  const generateImagePrompt = async (prompt: string) => {
    try {
      const openAI = getOpenAIService();
      const imagePrompt = await openAI.generateText(
        `Create a detailed image prompt for: ${prompt}. Make it specific and visually appealing.`,
        {
          temperature: 0.8,
          maxTokens: 100,
          systemMessage:
            "You are an expert at creating detailed image prompts.",
        }
      );
      return imagePrompt;
    } catch (error) {
      console.error("Error generating image prompt:", error);
      return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop";
    }
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const getPersonalizedGreeting = (userData: any) => {
    const energy = userData.energyLevels || "balanced";
    const timeOfDay = getTimeOfDay();

    if (timeOfDay === "morning") {
      return energy === "high"
        ? "Ready to conquer the day? Your energy is infectious! ⚡"
        : "Gentle mornings, deep thoughts. Take your time awakening to the day. 🌅";
    } else if (timeOfDay === "afternoon") {
      return "The day is unfolding beautifully. How are you feeling right now? 🌞";
    } else {
      return "Evening reflections time. What made you smile today? 🌙";
    }
  };

  const getBookInspiration = (userData: any) => {
    const genre = userData.bookGenres[0];
    const quotes = {
      Fiction:
        "Stories are the creative conversion of life itself into a more powerful, clearer, more meaningful experience.",
      "Non-fiction": "The best books give you more questions than answers.",
      Mystery: "Every mystery solved reveals a deeper mystery.",
      Romance: "Love is the bridge between two hearts.",
      "Sci-fi":
        "Science fiction is the most important literature in the history of the world.",
      Fantasy: "Imagination is the only weapon in the war against reality.",
    };
    return (
      quotes[genre as keyof typeof quotes] ||
      "Reading is dreaming with open eyes. What world will you explore today?"
    );
  };

  const getMusicVibes = (userData: any) => {
    const genre = userData.musicGenres[0];
    const mood = userData.desiredMoods?.[0] || "calm";
    return `${genre} hits different when you're feeling ${mood.toLowerCase()}. Let the rhythm match your soul today. 🎶`;
  };

  const getPodcastRecommendation = (userData: any) => {
    const interests = userData.techInterests || [];
    const mood = userData.desiredMoods?.[0] || "calm";

    if (interests.includes("AI")) {
      return `Perfect podcast for your AI curiosity: "Lex Fridman Podcast" - deep conversations about artificial intelligence, consciousness, and the future. ${
        mood === "clarity"
          ? "Great for your clarity-seeking mind!"
          : "Perfect background for thoughtful moments."
      }`;
    } else if (interests.includes("Startups")) {
      return `"How I Built This" - inspiring startup stories that match your entrepreneurial spirit. Each episode is a masterclass in turning dreams into reality.`;
    } else if (userData.wellnessAreas?.includes("Stoicism")) {
      return `"The Daily Stoic" podcast - bite-sized wisdom from ancient philosophers for modern life. Perfect for your stoic journey.`;
    }

    return `"The Tim Ferriss Show" - conversations with world-class performers about their habits, routines, and philosophies. Perfect for curious minds like yours.`;
  };

  const getVideoRecommendation = (userData: any) => {
    const interests = userData.techInterests || [];
    const bookGenres = userData.bookGenres || [];

    if (interests.includes("AI")) {
      return `"The A.I. Dilemma" - a thought-provoking documentary about artificial intelligence's impact on society. Essential viewing for anyone curious about our technological future.`;
    } else if (interests.includes("Space")) {
      return `"Cosmos: A Space-Time Odyssey" - Neil deGrasse Tyson takes you on a journey through the universe. Perfect for your space-loving soul.`;
    } else if (bookGenres.includes("Fantasy")) {
      return `"The Making of The Lord of the Rings" - behind-the-scenes magic that brings fantasy to life. A visual feast for fantasy lovers.`;
    }

    return `"Free Solo" - the breathtaking documentary about rock climber Alex Honnold. A masterpiece about pushing limits and following dreams.`;
  };

  const getPodcastYouTubeLink = (userData: any) => {
    const interests = userData.techInterests || [];

    if (interests.includes("AI")) {
      return "https://www.youtube.com/@lexfridman";
    } else if (interests.includes("Startups")) {
      return "https://www.youtube.com/@HowIBuiltThis";
    } else if (userData.wellnessAreas?.includes("Stoicism")) {
      return "https://www.youtube.com/@TheDailyStoic";
    }

    return "https://www.youtube.com/@TimFerriss";
  };

  const getVideoYouTubeLink = (userData: any) => {
    const interests = userData.techInterests || [];
    const bookGenres = userData.bookGenres || [];

    if (interests.includes("AI")) {
      return "https://www.youtube.com/watch?v=xoVJKj8lcNQ";
    } else if (interests.includes("Space")) {
      return "https://www.youtube.com/watch?v=XFF2ECZ8m1A";
    } else if (bookGenres.includes("Fantasy")) {
      return "https://www.youtube.com/watch?v=ngElkyQ6Rhs";
    }

    return "https://www.youtube.com/watch?v=urRVZ4SW7WU";
  };

  const getFoodInspiration = (userData: any) => {
    const comfort = userData.comfortFood;
    const cuisine = userData.cuisines?.[0];
    return comfort
      ? `${comfort} has healing powers, doesn't it? Sometimes comfort lives in familiar flavors. ${
          cuisine
            ? `Maybe some ${cuisine} cuisine would warm your heart today?`
            : ""
        }`
      : "Food is love made edible. What would nourish your soul today?";
  };

  const getTravelInspiration = (userData: any) => {
    const place = userData.bucketListPlaces?.[0];
    const style = userData.travelStyle;
    return place
      ? `${place} is calling your name. Can you hear it? ${
          style === "adventure"
            ? "Adventure awaits!"
            : "Peaceful journeys ahead."
        }`
      : "Every journey begins with a single step. Where is your heart wandering today?";
  };

  const getTechInspiration = (userData: any) => {
    const interest = userData.techInterests[0];
    const insights = {
      AI: "AI is not about replacing human creativity, but amplifying it.",
      Programming: "Code is poetry written in logic and dreams.",
      Space: "We are made of star stuff, exploring our cosmic home.",
      Startups: "Every great company started with someone who dared to dream.",
    };
    return (
      insights[interest as keyof typeof insights] ||
      "Technology is magic that we can touch and shape."
    );
  };

  const getWellnessInspiration = (userData: any) => {
    const area = userData.wellnessAreas[0];
    const activity = userData.rechargeActivities;
    return `Your journey with ${area.toLowerCase()} is beautiful. ${
      activity
        ? `Time to ${activity.toLowerCase()}?`
        : "How can you nurture yourself today?"
    }`;
  };

  const getMemoryPrompt = (userData: any) => {
    const people = userData.favoritePeople;
    return people
      ? `What's a recent moment with ${people
          .split(",")[0]
          ?.trim()} that made you smile? Sometimes ordinary moments become precious memories.`
      : "What small moment from today deserves to be remembered? Joy often hides in the details.";
  };

  const getMusicImage = (genre: string) => {
    const images = {
      Rock: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
      Pop: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=200&fit=crop",
      Jazz: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=200&fit=crop",
      Classical:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop",
    };
    return (
      images[genre as keyof typeof images] ||
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=200&fit=crop"
    );
  };

  const getFoodImage = (cuisine: string) => {
    const images = {
      Italian:
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=200&fit=crop",
      Japanese:
        "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=200&fit=crop",
      Indian:
        "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=200&fit=crop",
      comfort:
        "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&h=200&fit=crop",
    };
    return (
      images[cuisine as keyof typeof images] ||
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop"
    );
  };

  const getTravelImage = (place: string) => {
    const images = {
      Japan:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=200&fit=crop",
      Paris:
        "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=200&fit=crop",
      Bali: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=200&fit=crop",
      adventure:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
    };
    return (
      images[place as keyof typeof images] ||
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=200&fit=crop"
    );
  };

  const getArticleRecommendation = (userData: any) => {
    const interests = userData.techInterests || [];
    const bookGenres = userData.bookGenres || [];
    const wellnessAreas = userData.wellnessAreas || [];

    if (interests.includes("AI")) {
      return `"The State of AI in 2024" - a comprehensive look at how artificial intelligence is reshaping our world. Perfect for your tech-curious mind and packed with insights about the future.`;
    } else if (interests.includes("Startups")) {
      return `"The Psychology of Unicorn Founders" - what separates billion-dollar entrepreneurs from the rest? A fascinating deep-dive into the minds that build empires.`;
    } else if (wellnessAreas.includes("Stoicism")) {
      return `"Modern Stoicism: Ancient Wisdom for Digital Age" - how Marcus Aurelius would handle social media, remote work, and modern stress. Timeless philosophy for today's challenges.`;
    } else if (bookGenres.includes("Fiction")) {
      return `"The Science Behind Great Storytelling" - why some stories captivate us while others fall flat. A fascinating look at the psychology of narrative that will change how you read.`;
    } else if (interests.includes("Space")) {
      return `"Life Beyond Earth: The Search Continues" - the latest discoveries in astrobiology and what they mean for humanity's future among the stars.`;
    }

    return `"The Art of Deep Work in a Distracted World" - how to cultivate focus and create meaningful work in our attention-deficit society. Essential reading for anyone seeking clarity.`;
  };

  const getArticleLink = (userData: any) => {
    const interests = userData.techInterests || [];
    const bookGenres = userData.bookGenres || [];
    const wellnessAreas = userData.wellnessAreas || [];

    if (interests.includes("AI")) {
      return "https://www.nature.com/articles/d41586-024-00018-5";
    } else if (interests.includes("Startups")) {
      return "https://hbr.org/2023/11/the-psychology-of-successful-entrepreneurs";
    } else if (wellnessAreas.includes("Stoicism")) {
      return "https://www.theatlantic.com/health/archive/2021/11/stoicism-modern-life-philosophy/620685/";
    } else if (bookGenres.includes("Fiction")) {
      return "https://www.scientificamerican.com/article/the-science-of-storytelling/";
    } else if (interests.includes("Space")) {
      return "https://www.nasa.gov/news/releases/2024/nasa-announces-new-discoveries-in-search-for-life/";
    }

    return "https://www.theatlantic.com/family/archive/2021/07/deep-work-cal-newport/619386/";
  };

  const handleSaveToJournal = (item: any) => {
    const journalEntry = {
      id: Date.now(),
      title: item.title,
      content: item.content,
      source: "Daily Feed",
      savedAt: new Date().toISOString(),
      mood: currentMood || item.mood,
      image: item.image,
    };

    // Track the save action for AI learning
    UserPreferencesService.savePreference({
      itemId: item.id,
      itemType: item.type,
      action: "save",
      timestamp: new Date(),
      content: item.content,
      tags: item.tags,
    });

    onSaveToJournal(journalEntry);

    toast({
      title: "Saved to Mojo Journal! 📝",
      description: "This moment is now preserved in your personal collection.",
    });
  };

  const handleFindNearby = (type: string) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Open Google Maps with the search query
          const searchQuery = encodeURIComponent(`${type} restaurants near me`);
          window.open(
            `https://www.google.com/maps/search/${searchQuery}/@${latitude},${longitude},15z`,
            "_blank"
          );
        },
        (error) => {
          toast({
            title: "Location Access Required",
            description:
              "Please enable location access to find nearby restaurants.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Location Not Available",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
    }
  };

  const sectionButtons = [
    { id: "overview", label: "Overview", icon: Heart },
    { id: "news", label: "News", icon: Quote },
    { id: "articles", label: "Articles", icon: FileText },
    { id: "food", label: "Food", icon: Coffee },
    { id: "podcasts", label: "Podcasts", icon: Podcast },
    { id: "videos", label: "Videos", icon: Video },
    { id: "people", label: "People", icon: Heart },
    { id: "travel", label: "Travel", icon: Calendar },
    { id: "surprise", label: "Surprise", icon: Brain },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "news":
        return <NewsFeed userData={userData} />;
      case "articles":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent flex items-center justify-center">
                <FileText className="w-6 h-6 mr-2 text-green-600" />
                Articles You'll Love
              </h3>
              <p className="text-muted-foreground">
                Thoughtful reads curated for your curious mind
              </p>
            </div>

            <div className="space-y-4">
              {feedItems
                .filter((item) => item.type === "article_moment")
                .map((item) => (
                  <Card
                    key={item.id}
                    className="glass-effect hover:scale-[1.02] transition-all duration-500 overflow-hidden border-0 shadow-xl"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-60`}
                      />
                      <div className="absolute top-4 right-4">
                        <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="prose prose-sm max-w-none prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              window.open(item.articleLink, "_blank")
                            }
                            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Read Article
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveToJournal(item)}
                            className="hover:scale-105 transition-transform"
                          >
                            <Bookmark className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <LoveButton item={item} />
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          Article 📰
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        );
      case "podcasts":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center">
                <Podcast className="w-6 h-6 mr-2 text-indigo-600" />
                Podcasts for Your Mind
              </h3>
              <p className="text-muted-foreground">
                Audio content curated for your interests and growth
              </p>
            </div>

            <div className="space-y-4">
              {feedItems
                .filter((item) => item.type === "podcast_moment")
                .map((item) => (
                  <Card
                    key={item.id}
                    className="glass-effect hover:scale-[1.02] transition-all duration-500 overflow-hidden border-0 shadow-xl"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-60`}
                      />
                      <div className="absolute top-4 right-4">
                        <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="prose prose-sm max-w-none prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              window.open(item.youtubeLink, "_blank")
                            }
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                          >
                            <Youtube className="w-4 h-4 mr-2" />
                            Watch on YouTube
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveToJournal(item)}
                            className="hover:scale-105 transition-transform"
                          >
                            <Bookmark className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-indigo-100 text-indigo-800"
                        >
                          Podcast 🎧
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        );
      case "videos":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center">
                <Video className="w-6 h-6 mr-2 text-red-600" />
                Video Discoveries
              </h3>
              <p className="text-muted-foreground">
                Visual content that matches your interests and inspires growth
              </p>
            </div>

            <div className="space-y-4">
              {feedItems
                .filter((item) => item.type === "video_moment")
                .map((item) => (
                  <Card
                    key={item.id}
                    className="glass-effect hover:scale-[1.02] transition-all duration-500 overflow-hidden border-0 shadow-xl"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-60`}
                      />
                      <div className="absolute top-4 right-4">
                        <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="prose prose-sm max-w-none prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              window.open(item.youtubeLink, "_blank")
                            }
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                          >
                            <Youtube className="w-4 h-4 mr-2" />
                            Watch on YouTube
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveToJournal(item)}
                            className="hover:scale-105 transition-transform"
                          >
                            <Bookmark className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-800"
                        >
                          Video 📺
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        );
      case "food":
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent flex items-center justify-center">
                <Coffee className="w-6 h-6 mr-2 text-yellow-600" />
                Food & Comfort
              </h3>
              <p className="text-muted-foreground">
                Nourish your body and soul with delicious discoveries
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="glass-effect hover:scale-105 transition-all duration-300">
                <div className="relative h-32 overflow-hidden rounded-t-lg">
                  <img
                    src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=200&fit=crop"
                    alt="Donuts"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">🍩 Sweet Donuts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Glazed, chocolate, or sprinkled - donuts bring instant joy
                    and comfort.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => handleFindNearby("donut")}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Find Nearby
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-effect hover:scale-105 transition-all duration-300">
                <div className="relative h-32 overflow-hidden rounded-t-lg">
                  <img
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=200&fit=crop"
                    alt="Coffee"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">☕ Perfect Brew</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    The perfect companion to any sweet treat. Warm, comforting,
                    energizing.
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Brew Guide
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-effect hover:scale-105 transition-all duration-300">
                <div className="relative h-32 overflow-hidden rounded-t-lg">
                  <img
                    src={getFoodImage(userData.cuisines?.[0] || "comfort")}
                    alt="Comfort Food"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">🍜 Comfort Food</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {userData.comfortFood || "Your personal comfort food"} -
                    because sometimes we need a warm hug in food form.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      handleFindNearby(userData.comfortFood || "comfort food")
                    }
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Find Nearby
                  </Button>
                </CardContent>
              </Card>
            </div>

            <RecipeCard userData={userData} />

            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Food Inspiration</h4>
              {feedItems
                .filter((item) => item.type === "food_moment")
                .map((item) => (
                  <Card
                    key={item.id}
                    className="glass-effect hover:scale-[1.02] transition-all duration-500 overflow-hidden border-0 shadow-xl"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-60`}
                      />
                      <div className="absolute top-4 right-4">
                        <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="prose prose-sm max-w-none prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground"
                        dangerouslySetInnerHTML={{ __html: item.content }}
                      />
                      <div className="flex justify-between items-center">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSaveToJournal(item)}
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                        >
                          <Bookmark className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-800"
                        >
                          Food ✨
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        );
      case "people":
        return <PeopleMemories userData={userData} />;
      case "travel":
        return <TravelPlanner userData={userData} />;
      case "surprise":
        return <SurpriseMe userData={userData} />;
      default:
        return (
          <div className="space-y-6">
            <div className="space-y-6">
              {feedItems.map((item, index) => (
                <Card
                  key={item.id}
                  className="glass-effect hover:scale-[1.02] transition-all duration-500 overflow-hidden border-0 shadow-2xl"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-60`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {item.tags && (
                      <div className="absolute top-4 left-4 flex space-x-2">
                        {item.tags.map((tag: string, tagIndex: number) => (
                          <Badge
                            key={tagIndex}
                            variant="secondary"
                            className="bg-white/20 backdrop-blur-sm text-white border-white/30"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="absolute top-4 right-4 flex items-center space-x-2">
                      <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  </div>

                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {item.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {item.timestamp}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div
                      className="prose prose-sm max-w-none prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground"
                      dangerouslySetInnerHTML={{ __html: item.content }}
                    />

                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        {item.youtubeLink ? (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              window.open(item.youtubeLink, "_blank")
                            }
                            className="hover:scale-105 transition-transform bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                          >
                            <Youtube className="w-4 h-4 mr-2" />
                            Watch
                          </Button>
                        ) : null}
                        {item.articleLink ? (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              window.open(item.articleLink, "_blank")
                            }
                            className="hover:scale-105 transition-transform bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Read
                          </Button>
                        ) : null}
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSaveToJournal(item)}
                          className="hover:scale-105 transition-transform bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        >
                          <Bookmark className="w-4 h-4 mr-2" />
                          Save Memory
                        </Button>
                        <LoveButton item={item} />
                      </div>
                      <span className="text-xs text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                        Curated for you ✨
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
          Your Personal Universe
        </h2>
        <p className="text-muted-foreground text-lg">
          It's not a feed. It's a mirror reflecting your beautiful soul. ✨
        </p>
        {userData.tagline && (
          <p className="text-sm text-primary font-medium italic bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            "{userData.tagline}"
          </p>
        )}
      </div>

      <MoodToggle currentMood={currentMood} onMoodChange={setCurrentMood} />

      <div className="flex flex-wrap gap-3 justify-center">
        {sectionButtons.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={activeSection === id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSection(id)}
            className={`flex items-center space-x-2 transition-all duration-300 ${
              activeSection === id
                ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform scale-105"
                : "hover:scale-105 hover:border-purple-300"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </Button>
        ))}
      </div>

      <Dialog open={isLoading}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Creating Your Personalized Feed</DialogTitle>
            <DialogDescription className="flex flex-col items-center justify-center space-y-4 py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-center">
                We're crafting a unique experience just for you based on your
                preferences and interests. This may take a moment...
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
          <p className="text-center">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full"
            onClick={refreshContent}
          >
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !error && feedItems.length > 0 ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshContent}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Content
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {feedItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-lg border bg-background p-6 transition-all hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-10 transition-opacity group-hover:opacity-20" />
                <div className="relative space-y-4">
                  {item.image && (
                    <div className="relative h-48 w-full overflow-hidden rounded-lg">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <item.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div
                    className="prose prose-sm max-w-none prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                  {item.tags && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.timestamp}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveToJournal(item)}
                    >
                      Save to Journal
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !isLoading &&
        !error && (
          <div className="flex flex-col items-center justify-center space-y-4 py-12 text-center">
            <p className="text-lg text-muted-foreground">
              No content available. Please try again later.
            </p>
          </div>
        )
      )}
    </div>
  );
};
