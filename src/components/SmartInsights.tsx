import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Lightbulb,
  Heart,
  TrendingUp,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getOpenAIService } from "@/utils/openaiService";

interface SmartInsightsProps {
  userData: any;
  journalEntries: any[];
  memories: any[];
}

export const SmartInsights = ({
  userData,
  journalEntries,
  memories,
}: SmartInsightsProps) => {
  const [insights, setInsights] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateInsights = async () => {
    setIsGenerating(true);

    try {
      const openAI = getOpenAIService();

      const contextData = {
        user: userData,
        journalCount: journalEntries.length,
        memoryCount: memories.length,
        recentEntries: journalEntries.slice(0, 3),
        recentMemories: memories.slice(0, 3),
      };

      const prompt = `Based on this user data: ${JSON.stringify(contextData)}, 
        generate 4 personalized insights about their patterns, growth, and suggestions. 
        Format as JSON array with objects containing: type, title, content, icon (lightbulb, heart, trending-up, or brain).
        Focus on their journey, patterns you notice, and gentle suggestions for growth.`;

      const response = await openAI.generateText(prompt, {
        temperature: 0.7,
        maxTokens: 600,
        systemMessage:
          "You are an insightful AI coach who provides thoughtful, encouraging analysis of personal patterns and gentle suggestions for growth. Return valid JSON only.",
      });

      // Parse the response and create insights
      let parsedInsights;
      try {
        parsedInsights = JSON.parse(response);
      } catch {
        // Fallback if JSON parsing fails
        parsedInsights = [
          {
            type: "growth",
            title: "Your Journey Unfolds",
            content: `You've been exploring ${
              userData.bookGenres?.[0] || "new ideas"
            } and embracing ${
              userData.desiredMoods?.[0] || "positive energy"
            }. This shows a beautiful commitment to personal growth.`,
            icon: "trending-up",
          },
          {
            type: "pattern",
            title: "I Notice Your Interests",
            content: `Your love for ${
              userData.musicGenres?.[0] || "music"
            } and ${
              userData.cuisines?.[0] || "good food"
            } suggests you appreciate life's sensory pleasures. This is a wonderful way to stay present.`,
            icon: "heart",
          },
        ];
      }

      setInsights(parsedInsights);

      toast({
        title: "Insights generated! 🧠",
        description:
          "I've analyzed your patterns and created personalized insights.",
      });
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        title: "Generation error",
        description: "Sorry, I couldn't generate insights right now.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "lightbulb":
        return Lightbulb;
      case "heart":
        return Heart;
      case "trending-up":
        return TrendingUp;
      case "brain":
        return Brain;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Smart Insights
        </h3>
        <p className="text-muted-foreground mb-4">
          AI-powered analysis of your patterns and growth
        </p>

        {insights.length === 0 ? (
          <Button
            onClick={generateInsights}
            disabled={isGenerating}
            className="hover:scale-105 transition-transform bg-gradient-to-r from-purple-500 to-blue-500"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing your journey...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Generate Insights
              </>
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={generateInsights}
            disabled={isGenerating}
            className="hover:scale-105 transition-transform"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Insights
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight, index) => {
          const IconComponent = getIconComponent(insight.icon);
          return (
            <Card
              key={index}
              className="glass-effect hover:scale-[1.02] transition-transform"
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <IconComponent className="w-5 h-5 text-purple-600" />
                  <span>{insight.title}</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {insight.type}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {insight.content}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
