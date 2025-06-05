
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, Heart, BookOpen, Music, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WeeklyRecapProps {
  userData: any;
  journalEntries: any[];
  memories: any[];
}

export const WeeklyRecap = ({ userData, journalEntries, memories }: WeeklyRecapProps) => {
  const [recap, setRecap] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateWeeklyRecap = async () => {
    setIsGenerating(true);
    
    // Simulate GPT-generated weekly recap
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const generatedRecap = {
      weekOf: new Date().toLocaleDateString(),
      summary: `Hey ${userData.name}! This week you've been on a beautiful journey of self-discovery and meaningful moments.`,
      highlights: [
        {
          category: 'Mood Journey',
          content: `You've been gravitating towards ${userData.desiredMoods?.[0] || 'calm'} vibes, showing your emotional awareness.`,
          icon: Heart,
          count: 7
        },
        {
          category: 'Saved Memories',
          content: `${journalEntries.length} meaningful moments added to your Mojo Journal.`,
          icon: BookOpen,
          count: journalEntries.length
        },
        {
          category: 'Photo Memories',
          content: `${memories.length} precious memories captured and reflected upon.`,
          icon: Image,
          count: memories.length
        },
        {
          category: 'Musical Moments',
          content: `Your love for ${userData.musicGenres?.[0] || 'music'} brought you comfort and energy.`,
          icon: Music,
          count: 12
        }
      ],
      reflection: `This week showed your appreciation for ${userData.bookGenres?.[0] || 'good stories'} and ${userData.cuisines?.[0] || 'delicious food'}. You're building a beautiful tapestry of experiences, ${userData.name}.`,
      nextWeekSuggestion: "Continue nurturing your curiosity and stay open to new discoveries. Your journey is uniquely yours."
    };
    
    setRecap(generatedRecap);
    setIsGenerating(false);
    
    toast({
      title: "Weekly recap ready! 📊",
      description: "Your personalized journey summary is here.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Your Weekly Recap</h2>
        <p className="text-muted-foreground">
          A thoughtful summary of your journey ✨
        </p>
      </div>

      {!recap ? (
        <Card className="glass-effect text-center py-8">
          <CardContent>
            <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Generate Your Weekly Recap</h3>
            <p className="text-muted-foreground mb-6">
              Let AI create a personalized summary of your week with MeMojo
            </p>
            <Button 
              onClick={generateWeeklyRecap}
              disabled={isGenerating}
              className="hover:scale-105 transition-transform"
            >
              {isGenerating ? (
                <>
                  <TrendingUp className="w-4 h-4 mr-2 animate-pulse" />
                  Creating your recap...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Generate Weekly Recap
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Week of {recap.weekOf}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {recap.summary}
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {recap.highlights.map((highlight: any, index: number) => (
              <Card key={index} className="glass-effect">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <highlight.icon className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold">{highlight.category}</h3>
                    </div>
                    <Badge variant="secondary">{highlight.count}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {highlight.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Weekly Reflection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed mb-4">
                {recap.reflection}
              </p>
              <div className="bg-secondary/20 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Looking Ahead</h4>
                <p className="text-sm text-muted-foreground">
                  {recap.nextWeekSuggestion}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              variant="outline" 
              onClick={() => setRecap(null)}
              className="hover:scale-105 transition-transform"
            >
              Generate New Recap
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
