import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Quote, Heart, Calendar, Sparkles, Coffee, Brain, Gamepad2, Camera, MapPin } from 'lucide-react';

interface TodaysMojoProps {
  userData: any;
}

export const TodaysMojo = ({ userData }: TodaysMojoProps) => {
  const [dailyMojo, setDailyMojo] = useState<any>(null);

  useEffect(() => {
    const generateDailyMojo = () => {
      const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const mojo = {
        date: today,
        quote: getPersonalizedQuote(userData),
        song: getPersonalizedSong(userData),
        memory: getPersonalizedMemory(userData),
        food: getPersonalizedFood(userData),
        tech: getPersonalizedTech(userData),
        wellness: getPersonalizedWellness(userData),
        adventure: getPersonalizedAdventure(userData)
      };

      setDailyMojo(mojo);
    };

    generateDailyMojo();
  }, [userData]);

  const getPersonalizedQuote = (userData: any) => {
    if (userData.wellnessAreas?.includes('Stoicism')) {
      return {
        text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
        source: "Marcus Aurelius - for your Stoic soul"
      };
    }
    if (userData.techInterests?.includes('AI')) {
      return {
        text: "The question is not whether machines think, but whether men do.",
        source: "B.F. Skinner - for the AI curious"
      };
    }
    return {
      text: "The best way to predict the future is to create it.",
      source: `For ${userData.name}, the creator`
    };
  };

  const getPersonalizedSong = (userData: any) => {
    const mood = userData.desiredMoods?.[0] || 'Calm';
    const genre = userData.musicGenres?.[0] || 'Lo-fi';
    
    const suggestions = {
      'Calm': { title: 'Weightless', artist: 'Marconi Union' },
      'Joy': { title: 'Here Comes the Sun', artist: 'The Beatles' },
      'Confidence': { title: 'Stronger', artist: 'Kelly Clarkson' },
      'Clarity': { title: 'Clear', artist: 'Shawn Wasabi' },
      'Wonder': { title: 'Space Oddity', artist: 'David Bowie' }
    };

    const song = suggestions[mood as keyof typeof suggestions] || suggestions['Calm'];
    return {
      ...song,
      reason: `Perfect ${genre} vibes for your ${mood.toLowerCase()} mood today`
    };
  };

  const getPersonalizedMemory = (userData: any) => {
    if (userData.favoritePeople) {
      const person = userData.favoritePeople.split(',')[0]?.trim();
      return {
        prompt: `What's a recent moment with ${person} that made you smile?`,
        suggestion: "Sometimes the ordinary moments become the most precious memories."
      };
    }
    return {
      prompt: "What's one thing you're grateful for right now?",
      suggestion: "Gratitude transforms ordinary moments into blessings."
    };
  };

  const getPersonalizedFood = (userData: any) => {
    const comfort = userData.comfortFood || "A warm cup of tea";
    const cuisine = userData.cuisines?.[0] || "";
    return {
      suggestion: comfort,
      message: cuisine ? 
        `Maybe some ${cuisine} cuisine would hit different today? Food is love in edible form.` :
        "Sometimes comfort comes in the simplest forms. What would nourish you today?"
    };
  };

  const getPersonalizedTech = (userData: any) => {
    const interest = userData.techInterests?.[0];
    if (!interest) return null;
    
    const insights = {
      'AI': 'AI is not about replacing human intelligence, but augmenting it.',
      'Programming': 'Code is poetry written in logic.',
      'Space': 'We are made of star stuff, exploring our cosmic origins.',
      'Neuroscience': 'The brain is the most complex object in the known universe.',
      'Philosophy': 'The unexamined life is not worth living.',
      'Startups': 'Innovation distinguishes between a leader and a follower.'
    };

    return {
      topic: interest,
      insight: insights[interest as keyof typeof insights] || 'Curiosity is the engine of achievement.'
    };
  };

  const getPersonalizedWellness = (userData: any) => {
    const activity = userData.rechargeActivities || "taking a moment to breathe";
    const area = userData.wellnessAreas?.[0] || "self-care";
    
    return {
      activity: activity,
      message: `Your journey with ${area} is beautiful. Remember to ${activity.toLowerCase()} today.`
    };
  };

  const getPersonalizedAdventure = (userData: any) => {
    const places = userData.bucketListPlaces || [];
    const style = userData.travelStyle || 'adventure';
    
    if (places.length > 0) {
      return {
        destination: places[0],
        message: `${places[0]} is calling your name. Can you hear the whisper of adventure?`,
        image: getTravelImage(places[0])
      };
    }
    
    return {
      destination: 'Unknown Territory',
      message: style === 'relaxation' ? 
        'Sometimes the best adventures happen in your own backyard.' :
        'Adventure is out there, waiting for someone brave enough to find it.',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop'
    };
  };

  const getTravelImage = (place: string) => {
    const images = {
      'Japan': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
      'Paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400&h=300&fit=crop',
      'Bali': 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
      'Italy': 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&h=300&fit=crop',
      'Norway': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop'
    };
    return images[place as keyof typeof images] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop';
  };

  if (!dailyMojo) return null;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
          Today's Mojo ✨
        </h2>
        <p className="text-muted-foreground text-lg">{dailyMojo.date}</p>
        <p className="text-sm text-primary italic bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Your soul deserves a homepage
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Daily Quote with beautiful background */}
        <Card className="glass-effect hover:scale-105 transition-all duration-500 overflow-hidden border-0 shadow-xl">
          <div className="relative h-32 bg-gradient-to-br from-purple-400 via-pink-400 to-red-400">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4">
              <Quote className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Daily Quote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-lg italic mb-3 leading-relaxed">
              "{dailyMojo.quote.text}"
            </blockquote>
            <p className="text-sm text-muted-foreground">
              {dailyMojo.quote.source}
            </p>
          </CardContent>
        </Card>

        {/* Music Suggestion with vinyl-inspired design */}
        <Card className="glass-effect hover:scale-105 transition-all duration-500 overflow-hidden border-0 shadow-xl">
          <div className="relative h-32 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4">
              <Music className="w-8 h-8 text-white" />
            </div>
            <div className="absolute top-4 right-4 w-16 h-16 bg-black/30 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full" />
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Song for Your Soul
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-lg font-semibold">
                {dailyMojo.song.title}
              </p>
              <p className="text-muted-foreground">
                by {dailyMojo.song.artist}
              </p>
              <p className="text-sm">
                {dailyMojo.song.reason}
              </p>
              <Button variant="outline" size="sm" className="mt-3 hover:scale-105 transition-transform">
                <Music className="w-4 h-4 mr-2" />
                {userData.spotifyConnect ? 'Play on Spotify' : 'Listen Now'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Memory Prompt with photo-inspired design */}
        <Card className="glass-effect hover:scale-105 transition-all duration-500 overflow-hidden border-0 shadow-xl">
          <div className="relative h-32 bg-gradient-to-br from-pink-400 via-rose-400 to-red-400">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-lg bg-gradient-to-r from-pink-600 to-red-600 bg-clip-text text-transparent">
              Memory Moment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-lg">{dailyMojo.memory.prompt}</p>
              <p className="text-sm text-muted-foreground">
                {dailyMojo.memory.suggestion}
              </p>
              <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                <Calendar className="w-4 h-4 mr-2" />
                Record Memory
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Adventure Call with destination imagery */}
        {dailyMojo.adventure && (
          <Card className="glass-effect hover:scale-105 transition-all duration-500 overflow-hidden border-0 shadow-xl">
            <div className="relative h-32 overflow-hidden">
              <img 
                src={dailyMojo.adventure.image} 
                alt={dailyMojo.adventure.destination}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute bottom-4 left-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Adventure Awaits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-lg font-semibold">
                  {dailyMojo.adventure.destination}
                </p>
                <p className="text-sm text-muted-foreground">
                  {dailyMojo.adventure.message}
                </p>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                  <MapPin className="w-4 h-4 mr-2" />
                  Plan Journey
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comfort Suggestion with food imagery */}
        <Card className="glass-effect hover:scale-105 transition-all duration-500 overflow-hidden border-0 shadow-xl">
          <div className="relative h-32 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4">
              <Coffee className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-lg bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Comfort Corner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-lg font-semibold">
                {dailyMojo.food.suggestion}
              </p>
              <p className="text-sm text-muted-foreground">
                {dailyMojo.food.message}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tech Insight with futuristic design */}
        {dailyMojo.tech && (
          <Card className="glass-effect hover:scale-105 transition-all duration-500 overflow-hidden border-0 shadow-xl">
            <div className="relative h-32 bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-400">
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 left-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-lg bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent">
                Mind Expansion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  {dailyMojo.tech.topic}
                </p>
                <p className="text-lg">
                  {dailyMojo.tech.insight}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wellness Reminder with zen imagery */}
        <Card className="glass-effect hover:scale-105 transition-all duration-500 overflow-hidden border-0 shadow-xl">
          <div className="relative h-32 bg-gradient-to-br from-green-400 via-teal-400 to-blue-400">
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute bottom-4 left-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-lg bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
              Wellness Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {dailyMojo.wellness.message}
              </p>
              <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                <Heart className="w-4 h-4 mr-2" />
                Set Intention
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
