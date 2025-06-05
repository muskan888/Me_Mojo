import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Loader2, Sparkles, MessageCircle } from "lucide-react";
import { getOpenAIService } from "@/utils/openaiService";

interface EnhancedVoiceInputProps {
  userData: any;
  onTranscriptionComplete?: (text: string, response: string) => void;
  onFeedChange?: (section: string) => void;
}

export const EnhancedVoiceInput = ({
  userData,
  onTranscriptionComplete,
  onFeedChange,
}: EnhancedVoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await processAudio(audioBlob);

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);

      toast({
        title: "Listening... 🎤",
        description: "Tell me what you'd like to see or navigate to!",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone access needed",
        description: "Please allow microphone access to use voice features.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const openAI = getOpenAIService();

      // Transcribe audio with Whisper
      const transcribedText = await openAI.transcribeAudio(audioBlob);
      setTranscription(transcribedText);

      // Check for different types of requests
      const requestPatterns = {
        recipe: /recipe (?:for|of) (.+)/i,
        playlist: /playlist (?:for|about) (.+)/i,
        travel: /travel (?:plan|guide) (?:for|to) (.+)/i,
        journal: /journal (?:prompt|entry) (?:about|for) (.+)/i,
        memory: /memory (?:about|of) (.+)/i,
      };

      // Try to match the request type
      for (const [type, pattern] of Object.entries(requestPatterns)) {
        const match = transcribedText.match(pattern);
        if (match) {
          const content = match[1];
          try {
            let result;
            let section;
            let successMessage;

            switch (type) {
              case "recipe":
                result = await openAI.generateRecipe(content, userData);
                section = "food";
                successMessage = `I've generated a recipe for ${content}. Let me show you in the food section!`;
                break;

              case "playlist":
                result = await openAI.generatePlaylist(content, userData);
                section = "music";
                successMessage = `I've created a ${content} playlist for you. Let me show you in the music section!`;
                break;

              case "travel":
                result = await openAI.generateTravelPlan(content, userData);
                section = "travel";
                successMessage = `I've created a travel plan for ${content}. Let me show you in the travel section!`;
                break;

              case "journal":
                result = await openAI.generateJournalPrompt(userData);
                section = "journal";
                successMessage =
                  "I've created a thoughtful journal prompt for you. Let me show you in the journal section!";
                break;

              case "memory":
                result = await openAI.generateMemoryReflection(
                  content,
                  userData
                );
                section = "memories";
                successMessage =
                  "I've created a beautiful reflection about your memory. Let me show you in the memories section!";
                break;
            }

            if (result) {
              // Store the generated content in localStorage
              localStorage.setItem(
                `memojo-last-${type}`,
                JSON.stringify(result)
              );

              // Navigate to the appropriate section
              onFeedChange?.(section);

              setAiResponse(successMessage);

              toast({
                title: `${
                  type.charAt(0).toUpperCase() + type.slice(1)
                } Generated! ✨`,
                description: successMessage,
              });

              return;
            }
          } catch (error) {
            console.error(`Error generating ${type}:`, error);
            toast({
              title: `${
                type.charAt(0).toUpperCase() + type.slice(1)
              } Generation Failed`,
              description: `Sorry, I couldn't generate the ${type}. Please try again.`,
              variant: "destructive",
            });
          }
        }
      }

      // If no specific request type is matched, check for navigation intent
      const navigationIntent = await analyzeNavigationIntent(
        transcribedText,
        openAI
      );

      if (navigationIntent.shouldNavigate) {
        onFeedChange?.(navigationIntent.section);
        setAiResponse(
          `Sure! I'm taking you to ${navigationIntent.section}. ${navigationIntent.response}`
        );

        toast({
          title: `Navigating to ${navigationIntent.section}! 🧭`,
          description: navigationIntent.response,
        });
      } else {
        // Generate personalized AI response for general conversation
        const personalizedPrompt = `The user said: "${transcribedText}". 
          Context about the user: They enjoy ${userData.bookGenres?.join(
            ", "
          )} books, 
          ${userData.musicGenres?.join(
            ", "
          )} music, and their desired mood is ${userData.desiredMoods?.join(
          ", "
        )}.
          Respond in a warm, understanding way that shows you know them personally.`;

        const response = await openAI.generateText(personalizedPrompt, {
          temperature: 0.8,
          maxTokens: 300,
          systemMessage:
            "You are a caring, empathetic AI companion who knows the user well and responds with warmth and understanding.",
        });

        setAiResponse(response);
      }

      onTranscriptionComplete?.(transcribedText, aiResponse);

      toast({
        title: "Voice processed! ✨",
        description: "I heard you and responded thoughtfully.",
      });
    } catch (error) {
      console.error("Error processing audio:", error);
      toast({
        title: "Processing error",
        description: "Sorry, I couldn't process your voice message.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeNavigationIntent = async (text: string, openAI: any) => {
    const navigationPrompt = `Analyze this user request: "${text}"
    
    Available sections: overview, news, food, people, travel, surprise, today, memories, journal, insights, recap, settings
    
    Determine if the user wants to navigate to a specific section. Look for keywords like:
    - "show me", "go to", "navigate to", "take me to", "I want to see"
    - "news", "food", "recipes", "people", "travel", "surprise", "today", "memories", "journal", "insights", "recap", "settings"
    - "feed", "overview", "home"
    
    Respond with JSON: {"shouldNavigate": boolean, "section": "section_name", "response": "friendly confirmation message"}
    
    If no clear navigation intent, return: {"shouldNavigate": false, "section": "", "response": ""}`;

    try {
      const result = await openAI.generateText(navigationPrompt, {
        temperature: 0.3,
        maxTokens: 150,
        systemMessage:
          "You are a navigation assistant. Always respond with valid JSON.",
      });

      // Try to parse JSON response
      const parsed = JSON.parse(result);
      return {
        shouldNavigate: parsed.shouldNavigate || false,
        section: parsed.section || "",
        response: parsed.response || "",
      };
    } catch (error) {
      console.error("Error parsing navigation intent:", error);
      return { shouldNavigate: false, section: "", response: "" };
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Button
          onClick={handleVoiceToggle}
          variant={isListening ? "destructive" : "default"}
          size="lg"
          className={`rounded-full p-4 transition-all duration-300 ${
            isListening
              ? "animate-pulse shadow-lg scale-110"
              : isProcessing
              ? "opacity-50"
              : "hover:scale-110 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          }`}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isListening ? (
            <MicOff className="w-6 h-6" />
          ) : (
            <Mic className="w-6 h-6" />
          )}
        </Button>
      </div>

      {transcription && (
        <Card className="glass-effect">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-2 mb-3">
              <MessageCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-700">You said:</h4>
                <p className="text-sm text-gray-700 italic">
                  "{transcription}"
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {aiResponse && (
        <Card className="glass-effect border-purple-200">
          <CardContent className="pt-4">
            <div className="flex items-start space-x-2">
              <Sparkles className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <h4 className="font-semibold text-purple-700">
                  MeMojo responds:
                </h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {aiResponse}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
