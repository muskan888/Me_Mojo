
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Shuffle, Heart, Brain, Coffee, Music, Book, MapPin, Gamepad2 } from 'lucide-react';

interface SurpriseMeProps {
  userData: any;
}

export const SurpriseMe = ({ userData }: SurpriseMeProps) => {
  const [surprise, setSurprise] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSurprise = () => {
    setIsGenerating(true);
    
    const surpriseTypes = [
      {
        type: 'memory_prompt',
        title: 'Memory Lane Moment',
        icon: Heart,
        content: generateMemoryPrompt(),
        color: 'text-pink-500'
      },
      {
        type: 'creative_challenge',
        title: 'Creative Challenge',
        icon: Brain,
        content: generateCreativeChallenge(),
        color: 'text-purple-500'
      },
      {
        type: 'comfort_suggestion',
        title: 'Comfort Corner',
        icon: Coffee,
        content: generateComfortSuggestion(),
        color: 'text-orange-500'
      },
      {
        type: 'music_discovery',
        title: 'Musical Discovery',
        icon: Music,
        content: generateMusicSuggestion(),
        color: 'text-blue-500'
      },
      {
        type: 'book_wisdom',
        title: 'Literary Wisdom',
        icon: Book,
        content: generateBookWisdom(),
        color: 'text-green-500'
      },
      {
        type: 'adventure_idea',
        title: 'Mini Adventure',
        icon: MapPin,
        content: generateAdventureIdea(),
        color: 'text-red-500'
      },
      {
        type: 'game_break',
        title: 'Fun Break',
        icon: Gamepad2,
        content: generateGameBreak(),
        color: 'text-indigo-500'
      }
    ];

    setTimeout(() => {
      const randomSurprise = surpriseTypes[Math.floor(Math.random() * surpriseTypes.length)];
      setSurprise(randomSurprise);
      setIsGenerating(false);
    }, 1500);
  };

  const generateMemoryPrompt = () => {
    const prompts = [
      "What's a song that instantly takes you back to a perfect moment?",
      "Describe a place where you felt completely at peace.",
      "What's the best compliment you've ever received?",
      "Share a moment when someone made you laugh until you cried.",
      "What's a small tradition you love?",
      "Describe your favorite childhood hiding spot."
    ];
    
    return {
      prompt: prompts[Math.floor(Math.random() * prompts.length)],
      action: "Take 5 minutes to write about this memory",
      inspiration: "Sometimes our happiest moments are hidden in the ordinary."
    };
  };

  const generateCreativeChallenge = () => {
    const challenges = [
      {
        task: "Write a haiku about your current mood",
        format: "5-7-5 syllables",
        example: "Gentle morning light / Coffee steam dances upward / Day begins with hope"
      },
      {
        task: "Draw your energy level as a weather pattern",
        format: "No artistic skills needed",
        example: "Sunny with scattered clouds? Thunderstorm? Gentle rain?"
      },
      {
        task: "Create a 6-word memoir of your week",
        format: "Exactly 6 words",
        example: "Coffee, deadlines, laughter, growth, pizza, repeat."
      },
      {
        task: "Design your ideal room using only colors and feelings",
        format: "No drawing required",
        example: "Warm amber lighting, soft textures, plants everywhere"
      }
    ];
    
    return challenges[Math.floor(Math.random() * challenges.length)];
  };

  const generateComfortSuggestion = () => {
    const comfort = userData.comfortFood || "something warm";
    const recharge = userData.rechargeActivities || "taking a moment to breathe";
    
    const suggestions = [
      {
        activity: `Make yourself ${comfort.toLowerCase()}`,
        reason: "Food is love in its most immediate form",
        duration: "15-30 minutes"
      },
      {
        activity: `Time for ${recharge.toLowerCase()}`,
        reason: "Your soul is asking for this right now",
        duration: "10-20 minutes"
      },
      {
        activity: "Text someone you care about",
        reason: "Connection is the best comfort",
        duration: "2 minutes"
      },
      {
        activity: "Put on your coziest clothes",
        reason: "Comfort starts with how you feel in your own skin",
        duration: "1 minute"
      }
    ];
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const generateMusicSuggestion = () => {
    const genres = userData.musicGenres || ['Lo-fi'];
    const moods = userData.moodPlaylists || ['Chill'];
    
    return {
      suggestion: `Time for some ${genres[0]} music`,
      mood: moods[0],
      reason: "Music is medicine for whatever you're feeling",
      action: userData.spotifyConnect ? "Open Spotify" : "Find your favorite music app"
    };
  };

  const generateBookWisdom = () => {
    const wisdom = [
      {
        quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
        source: "Chinese Proverb",
        reflection: "What seeds are you planting today?"
      },
      {
        quote: "You are not stuck where you are unless you decide to be.",
        source: "Wayne Dyer",
        reflection: "What small step could you take right now?"
      },
      {
        quote: "The wound is the place where the Light enters you.",
        source: "Rumi",
        reflection: "How have your challenges become your strengths?"
      }
    ];
    
    return wisdom[Math.floor(Math.random() * wisdom.length)];
  };

  const generateAdventureIdea = () => {
    const adventures = [
      "Take a different route home and notice 3 new things",
      "Try a new coffee shop or tea blend",
      "Call someone you haven't talked to in a while",
      "Take photos of things that make you smile today",
      "Write a letter to future you",
      "Learn one fascinating fact about something you see every day"
    ];
    
    return {
      adventure: adventures[Math.floor(Math.random() * adventures.length)],
      timeNeeded: "15-30 minutes",
      why: "Adventure is about curiosity, not distance"
    };
  };

  const generateGameBreak = () => {
    const games = [
      {
        name: "20 Questions with yourself",
        rules: "Think of something you're grateful for. Ask yourself 20 yes/no questions about why it matters."
      },
      {
        name: "Alphabet Gratitude",
        rules: "Name something you're thankful for starting with each letter A-Z."
      },
      {
        name: "Future Self Interview",
        rules: "Interview yourself from 5 years in the future. What advice would they give you?"
      },
      {
        name: "Color Hunt",
        rules: "Find 10 different shades of your favorite color around you right now."
      }
    ];
    
    return games[Math.floor(Math.random() * games.length)];
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold flex items-center">
          <Sparkles className="w-5 h-5 mr-2" />
          Surprise Me
        </h3>
        <Button 
          onClick={generateSurprise}
          disabled={isGenerating}
          size="sm"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          {isGenerating ? 'Creating magic...' : 'Surprise Me!'}
        </Button>
      </div>

      {surprise && (
        <Card className="glass-effect border-rainbow animate-fade-in-up">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full bg-secondary`}>
                <surprise.icon className={`w-5 h-5 ${surprise.color}`} />
              </div>
              <div>
                <CardTitle className="text-lg">{surprise.title}</CardTitle>
                <Badge variant="outline" className="mt-1">
                  Randomly generated for you
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {surprise.type === 'memory_prompt' && (
              <div className="space-y-3">
                <p className="text-lg font-medium">{surprise.content.prompt}</p>
                <p className="text-sm text-muted-foreground">{surprise.content.action}</p>
                <p className="text-sm italic text-primary">{surprise.content.inspiration}</p>
              </div>
            )}
            
            {surprise.type === 'creative_challenge' && (
              <div className="space-y-3">
                <p className="text-lg font-medium">{surprise.content.task}</p>
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <p className="text-sm"><strong>Format:</strong> {surprise.content.format}</p>
                  <p className="text-sm mt-1"><strong>Example:</strong> {surprise.content.example}</p>
                </div>
              </div>
            )}
            
            {surprise.type === 'comfort_suggestion' && (
              <div className="space-y-3">
                <p className="text-lg font-medium">{surprise.content.activity}</p>
                <p className="text-sm text-muted-foreground">{surprise.content.reason}</p>
                <Badge variant="outline">{surprise.content.duration}</Badge>
              </div>
            )}
            
            {surprise.type === 'music_discovery' && (
              <div className="space-y-3">
                <p className="text-lg font-medium">{surprise.content.suggestion}</p>
                <p className="text-sm text-muted-foreground">{surprise.content.reason}</p>
                <div className="flex space-x-2">
                  <Badge variant="outline">{surprise.content.mood} vibes</Badge>
                  <Button size="sm" variant="outline">
                    {surprise.content.action}
                  </Button>
                </div>
              </div>
            )}
            
            {surprise.type === 'book_wisdom' && (
              <div className="space-y-3">
                <blockquote className="text-lg italic">"{surprise.content.quote}"</blockquote>
                <p className="text-sm text-muted-foreground">— {surprise.content.source}</p>
                <p className="text-sm text-primary font-medium">{surprise.content.reflection}</p>
              </div>
            )}
            
            {surprise.type === 'adventure_idea' && (
              <div className="space-y-3">
                <p className="text-lg font-medium">{surprise.content.adventure}</p>
                <p className="text-sm text-muted-foreground">{surprise.content.why}</p>
                <Badge variant="outline">{surprise.content.timeNeeded}</Badge>
              </div>
            )}
            
            {surprise.type === 'game_break' && (
              <div className="space-y-3">
                <p className="text-lg font-medium">{surprise.content.name}</p>
                <div className="bg-secondary/20 p-3 rounded-lg">
                  <p className="text-sm">{surprise.content.rules}</p>
                </div>
              </div>
            )}
            
            <Button className="w-full" onClick={generateSurprise}>
              <Shuffle className="w-4 h-4 mr-2" />
              Another Surprise
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
