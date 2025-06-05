import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, RefreshCw, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getOpenAIService } from "@/utils/openaiService";

interface PhotoCaptionGeneratorProps {
  imageUrl?: string;
  userData?: any;
  onCaptionGenerated: (caption: string) => void;
}

export const PhotoCaptionGenerator = ({
  imageUrl,
  userData,
  onCaptionGenerated,
}: PhotoCaptionGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [caption, setCaption] = useState("");
  const { toast } = useToast();

  const generateCaption = async () => {
    setIsGenerating(true);

    try {
      const openAI = getOpenAIService();

      const personalizedPrompt = `Create a beautiful, meaningful photo caption for someone who enjoys ${userData?.bookGenres?.join(
        ", "
      )} and ${userData?.musicGenres?.join(
        ", "
      )}. Make it reflective of their personality and interests. The caption should be poetic, thoughtful, and capture the essence of a precious moment.`;

      const generatedCaption = await openAI.generateText(personalizedPrompt, {
        temperature: 0.8,
        maxTokens: 100,
        systemMessage:
          "You are a poetic writer who creates beautiful, meaningful captions that resonate deeply with the person's soul and interests.",
      });

      setCaption(generatedCaption);
      onCaptionGenerated(generatedCaption);

      toast({
        title: "AI caption created! ✨",
        description: "A personalized caption crafted just for you.",
      });
    } catch (error) {
      console.error("Error generating caption:", error);
      toast({
        title: "Error",
        description: "Failed to generate caption. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={generateCaption}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        variant="default"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            Creating magic...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Caption
          </>
        )}
      </Button>

      {caption && (
        <Card className="glass-effect border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-2">
              <Camera className="w-5 h-5 text-purple-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm italic text-muted-foreground leading-relaxed">
                  "{caption}"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
