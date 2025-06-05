
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Heart, Music, Quote, Image, Sparkles, Book, Film, Coffee, Brain, Gamepad2, Mountain, Palette, Camera, Plane, Star, Zap, Sun, Moon, TreePine, Dumbbell, Clock, Users, Globe, Lightbulb, Target, Trophy, Gift } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (data: any) => void;
}

// Expanded categories with many more options
const BOOK_GENRES = ['Thriller', 'Romance', 'Sci-fi', 'Fantasy', 'Non-fiction', 'Memoir', 'Business', 'Psychology', 'YA', 'Mystery', 'Historical Fiction', 'Biography', 'Self-help', 'Poetry', 'Horror', 'Adventure', 'Philosophy', 'True Crime', 'Art & Design', 'Travel'];

const READING_HABITS = ['Night reader', 'Audiobook listener', 'Collector', 'Highlight nerd', 'Speed reader', 'Re-reader', 'Book club member', 'Library lover', 'E-book fan', 'Bookstore browser'];

const MOVIE_GENRES = ['Action', 'Comedy', 'Slice-of-life', 'Documentaries', 'Rom-Coms', 'Indie', 'Anime', 'Bollywood', 'K-dramas', 'Horror', 'Thriller', 'Sci-fi', 'Fantasy', 'Musical', 'Western', 'Crime', 'Historical', 'Biographical', 'Art house', 'Foreign films'];

const MUSIC_GENRES = ['Lo-fi', 'Pop', 'Jazz', 'Rock', 'Classical', 'R&B', 'Desi', 'Instrumental', 'Trap', 'Hip-hop', 'Electronic', 'Folk', 'Country', 'Reggae', 'Metal', 'Punk', 'Blues', 'Soul', 'Funk', 'World music', 'Ambient', 'Techno'];

const MOOD_PLAYLISTS = ['Chill', 'Sadboi', 'Dance', 'Deep focus', 'Nostalgia', 'Motivation', 'Romance', 'Party', 'Workout', 'Sleep', 'Study', 'Road trip', 'Rain vibes', 'Morning coffee'];

const FOOD_PREFERENCES = ['Veg', 'Vegan', 'High-protein', 'Sweet tooth', 'Junkie', 'Balanced eater', 'Keto', 'Mediterranean', 'Paleo', 'Intermittent faster', 'Foodie explorer', 'Home cook'];

const CUISINES = ['Indian', 'Korean', 'Japanese', 'Italian', 'Mexican', 'Middle Eastern', 'Fusion', 'Thai', 'Chinese', 'French', 'Greek', 'Spanish', 'Vietnamese', 'Ethiopian', 'Moroccan', 'Lebanese', 'Turkish'];

const TECH_INTERESTS = ['AI', 'Programming', 'Space', 'Neuroscience', 'Philosophy', 'Startups', 'Blockchain', 'VR/AR', 'Robotics', 'Quantum computing', 'Cybersecurity', 'Data science', 'UX/UI design', 'Gaming', 'IoT', 'Climate tech'];

const WELLNESS_AREAS = ['Mindfulness', 'Stoicism', 'Journaling', 'Productivity hacks', 'Therapy culture', 'Life advice', 'Meditation', 'Yoga', 'Mental health', 'Nutrition', 'Sleep optimization', 'Stress management'];

const HUMOR_TYPES = ['Dark', 'Desi', 'Dad jokes', 'Sarcasm', 'Cringe', 'Surreal', 'Nerdy memes', 'Wholesome', 'Political satire', 'Stand-up', 'Sketch comedy', 'Observational'];

const SPORTS = ['Cricket', 'Football', 'F1', 'Basketball', 'Tennis', 'eSports', 'Swimming', 'Running', 'Cycling', 'Hiking', 'Rock climbing', 'Yoga', 'Boxing', 'Soccer', 'Baseball', 'Golf'];

const DESIRED_MOODS = ['Calm', 'Joy', 'Confidence', 'Clarity', 'Wonder', 'Peace', 'Creativity', 'Energy', 'Focus', 'Inspiration', 'Gratitude', 'Motivation', 'Serenity', 'Adventure'];

const CREATIVE_OUTLETS = ['Writing', 'Photography', 'Painting', 'Music making', 'Dancing', 'Crafting', 'Cooking', 'Gardening', 'Video editing', 'Sketching', 'Pottery', 'Singing'];

const SOCIAL_STYLES = ['Extrovert', 'Introvert', 'Ambivert', 'Social butterfly', 'Homebody', 'Party person', 'Deep conversations', 'Group activities', 'One-on-one time', 'Online socializing'];

const TRAVEL_STYLES = ['Adventure seeker', 'Culture explorer', 'Beach lover', 'Mountain person', 'City explorer', 'Nature enthusiast', 'Luxury traveler', 'Backpacker', 'Food tourist', 'Historical sites'];

const LEARNING_STYLES = ['Visual learner', 'Hands-on', 'Reading/writing', 'Listening', 'Group learning', 'Solo study', 'Project-based', 'Experimental', 'Structured courses', 'Self-taught'];

const LIFE_VALUES = ['Family', 'Career growth', 'Adventure', 'Stability', 'Creativity', 'Freedom', 'Success', 'Relationships', 'Health', 'Knowledge', 'Impact', 'Balance', 'Authenticity', 'Growth'];

const STRESS_RELIEVERS = ['Exercise', 'Music', 'Reading', 'Nature walks', 'Meditation', 'Cooking', 'Cleaning', 'Gaming', 'Talking to friends', 'Art', 'Bath/shower', 'Sleep'];

const MORNING_TYPES = ['Early bird', 'Night owl', 'Flexible', 'Slow starter', 'Coffee dependent', 'Workout first', 'News checker', 'Meditation start', 'Music listener', 'Planner'];

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic info
    name: '',
    tagline: '',
    age: '',
    location: '',
    
    // Books & Reading
    bookGenres: [] as string[],
    readingHabits: [] as string[],
    favoriteBooks: '',
    readingGoals: '',
    
    // Movies & Entertainment
    movieGenres: [] as string[],
    watchingStyle: '',
    platforms: '',
    favoriteShows: '',
    
    // Music
    musicGenres: [] as string[],
    moodPlaylists: [] as string[],
    spotifyConnect: false,
    instruments: '',
    concertLover: false,
    
    // Food
    foodPreferences: [] as string[],
    cuisines: [] as string[],
    comfortFood: '',
    cookingLevel: '',
    dietaryRestrictions: '',
    
    // Tech & Learning
    techInterests: [] as string[],
    learningStyle: '',
    learningStyles: [] as string[],
    onlinePresence: '',
    
    // Wellness
    wellnessAreas: [] as string[],
    rechargeActivities: '',
    stressRelievers: [] as string[],
    exerciseHabits: '',
    
    // Humor
    humorTypes: [] as string[],
    humorPlatforms: '',
    favoriteComedians: '',
    
    // Sports & Games
    sports: [] as string[],
    gamingStyle: '',
    competitiveNature: '',
    
    // Creative & Hobbies
    creativeOutlets: [] as string[],
    hobbies: '',
    collections: '',
    
    // Social & Personality
    socialStyles: [] as string[],
    idealWeekend: '',
    partyPersonality: '',
    
    // Travel & Adventure
    travelStyles: [] as string[],
    dreamDestinations: '',
    travelFrequency: '',
    
    // Life & Values
    lifeValues: [] as string[],
    currentFocus: '',
    lifeGoals: '',
    
    // Daily Life
    morningTypes: [] as string[],
    profession: '',
    timePreference: '',
    organization: '',
    wantMoreOf: '',
    
    // Mood & Goals
    desiredMoods: [] as string[],
    whenUseApp: '',
    moodTracking: false,
    
    // People & Memories
    favoritePeople: '',
    memoryTypes: '',
    relationshipStatus: '',
    petLover: false,
    
    // Personalization depth
    personalityType: '',
    introExtroLevel: [5] as number[],
    optimismLevel: [7] as number[],
    adventureLevel: [5] as number[],
    creativityLevel: [5] as number[],
  });

  const handleArrayToggle = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).includes(value)
        ? (prev[field] as string[]).filter(item => item !== value)
        : [...(prev[field] as string[]), value]
    }));
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(formData);
    }
  };

  const steps = [
    // Welcome & Basic Info
    {
      title: "Welcome to MeMojo ✨",
      subtitle: "Let's build your digital sanctuary together",
      icon: Heart,
      content: (
        <div className="space-y-6 text-center">
          <div className="animate-float">
            <Heart className="w-16 h-16 mx-auto text-primary" />
          </div>
          <p className="text-muted-foreground text-lg">
            Your people, your memories, your music, your mind. Let's create something beautiful.
          </p>
          <div className="space-y-4">
            <Input
              placeholder="What should I call you? ✨"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="text-center text-lg"
            />
            <Input
              placeholder="Your personal tagline or current mood 🌙"
              value={formData.tagline}
              onChange={(e) => setFormData({...formData, tagline: e.target.value})}
              className="text-center"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Age (optional)"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="text-center"
              />
              <Input
                placeholder="Location (optional)"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="text-center"
              />
            </div>
          </div>
        </div>
      )
    },

    // Personality Deep Dive
    {
      title: "Your Personality Spectrum 🌈",
      subtitle: "Let's understand what makes you, you",
      icon: Brain,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">How introverted vs extroverted are you?</p>
            <div className="space-y-2">
              <Slider
                value={formData.introExtroLevel}
                onValueChange={(value) => setFormData({...formData, introExtroLevel: value})}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Introvert</span>
                <span>Extrovert</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Your optimism level:</p>
            <div className="space-y-2">
              <Slider
                value={formData.optimismLevel}
                onValueChange={(value) => setFormData({...formData, optimismLevel: value})}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Realistic</span>
                <span>Optimistic</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Adventure vs Comfort:</p>
            <div className="space-y-2">
              <Slider
                value={formData.adventureLevel}
                onValueChange={(value) => setFormData({...formData, adventureLevel: value})}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Comfort Zone</span>
                <span>Adventure Seeker</span>
              </div>
            </div>
          </div>

          <Input
            placeholder="Know your personality type? (MBTI, Enneagram, etc.) 🧠"
            value={formData.personalityType}
            onChange={(e) => setFormData({...formData, personalityType: e.target.value})}
          />
        </div>
      )
    },

    // Books & Reading (Enhanced)
    {
      title: `${formData.name}, let's dive into books! 📚`,
      subtitle: "Your literary universe awaits",
      icon: Book,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Book genres that captivate you:</p>
            <div className="flex flex-wrap gap-2">
              {BOOK_GENRES.map(genre => (
                <Badge
                  key={genre}
                  variant={formData.bookGenres.includes(genre) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('bookGenres', genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Your reading personality:</p>
            <div className="flex flex-wrap gap-2">
              {READING_HABITS.map(habit => (
                <Badge
                  key={habit}
                  variant={formData.readingHabits.includes(habit) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('readingHabits', habit)}
                >
                  {habit}
                </Badge>
              ))}
            </div>
          </div>

          <Textarea
            placeholder="Books that changed your life, favorite authors, current reads... 📖"
            value={formData.favoriteBooks}
            onChange={(e) => setFormData({...formData, favoriteBooks: e.target.value})}
            className="min-h-24"
          />

          <Input
            placeholder="Reading goals? (books per year, genres to explore, etc.) 🎯"
            value={formData.readingGoals}
            onChange={(e) => setFormData({...formData, readingGoals: e.target.value})}
          />
        </div>
      )
    },

    // Movies & Entertainment (Enhanced)
    {
      title: "Your Screen Universe 🎬",
      subtitle: "From blockbusters to hidden gems",
      icon: Film,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Genres that speak to your soul:</p>
            <div className="flex flex-wrap gap-2">
              {MOVIE_GENRES.map(genre => (
                <Badge
                  key={genre}
                  variant={formData.movieGenres.includes(genre) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('movieGenres', genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <Input
            placeholder="Watching style: Marathon binges, weekly episodes, cinema lover? 📺"
            value={formData.watchingStyle}
            onChange={(e) => setFormData({...formData, watchingStyle: e.target.value})}
          />

          <Input
            placeholder="Platforms you live on: Netflix, Prime, Disney+, YouTube, etc. 🍿"
            value={formData.platforms}
            onChange={(e) => setFormData({...formData, platforms: e.target.value})}
          />

          <Textarea
            placeholder="All-time favorite shows/movies that you could rewatch forever... 🌟"
            value={formData.favoriteShows}
            onChange={(e) => setFormData({...formData, favoriteShows: e.target.value})}
            className="min-h-24"
          />
        </div>
      )
    },

    // Music (Enhanced)
    {
      title: "Your Sonic Identity 🎵",
      subtitle: "Music is the language of emotions",
      icon: Music,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Musical genres in your heart:</p>
            <div className="flex flex-wrap gap-2">
              {MUSIC_GENRES.map(genre => (
                <Badge
                  key={genre}
                  variant={formData.musicGenres.includes(genre) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('musicGenres', genre)}
                >
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Playlists for every feeling:</p>
            <div className="flex flex-wrap gap-2">
              {MOOD_PLAYLISTS.map(playlist => (
                <Badge
                  key={playlist}
                  variant={formData.moodPlaylists.includes(playlist) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('moodPlaylists', playlist)}
                >
                  {playlist}
                </Badge>
              ))}
            </div>
          </div>

          <Input
            placeholder="Do you play any instruments or sing? 🎸"
            value={formData.instruments}
            onChange={(e) => setFormData({...formData, instruments: e.target.value})}
          />

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.spotifyConnect}
                onCheckedChange={(checked) => setFormData({...formData, spotifyConnect: !!checked})}
              />
              <span className="text-sm">Connect Spotify for personalized magic ✨</span>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.concertLover}
                onCheckedChange={(checked) => setFormData({...formData, concertLover: !!checked})}
              />
              <span className="text-sm">Live music enthusiast 🎤</span>
            </div>
          </div>
        </div>
      )
    },

    // Creative Outlets
    {
      title: "Your Creative Spirit 🎨",
      subtitle: "How do you express your inner artist?",
      icon: Palette,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Creative outlets that call to you:</p>
            <div className="flex flex-wrap gap-2">
              {CREATIVE_OUTLETS.map(outlet => (
                <Badge
                  key={outlet}
                  variant={formData.creativeOutlets.includes(outlet) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('creativeOutlets', outlet)}
                >
                  {outlet}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Your creativity level:</p>
            <div className="space-y-2">
              <Slider
                value={formData.creativityLevel}
                onValueChange={(value) => setFormData({...formData, creativityLevel: value})}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Practical</span>
                <span>Creative Soul</span>
              </div>
            </div>
          </div>

          <Textarea
            placeholder="Other hobbies and passions that light you up... 🔥"
            value={formData.hobbies}
            onChange={(e) => setFormData({...formData, hobbies: e.target.value})}
            className="min-h-24"
          />

          <Input
            placeholder="Do you collect anything? (books, art, experiences, etc.) 📦"
            value={formData.collections}
            onChange={(e) => setFormData({...formData, collections: e.target.value})}
          />
        </div>
      )
    },

    // Social & Personality
    {
      title: "Your Social DNA 👥",
      subtitle: "How you connect with the world",
      icon: Users,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Your social style:</p>
            <div className="flex flex-wrap gap-2">
              {SOCIAL_STYLES.map(style => (
                <Badge
                  key={style}
                  variant={formData.socialStyles.includes(style) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('socialStyles', style)}
                >
                  {style}
                </Badge>
              ))}
            </div>
          </div>

          <Textarea
            placeholder="Describe your ideal weekend - what fills your soul? 🌅"
            value={formData.idealWeekend}
            onChange={(e) => setFormData({...formData, idealWeekend: e.target.value})}
            className="min-h-24"
          />

          <Input
            placeholder="Party personality: Life of the party, corner conversationalist, observer? 🎉"
            value={formData.partyPersonality}
            onChange={(e) => setFormData({...formData, partyPersonality: e.target.value})}
          />
        </div>
      )
    },

    // Food & Lifestyle (Enhanced)
    {
      title: "Food is Love & Culture 🍜",
      subtitle: "Your relationship with food and flavor",
      icon: Coffee,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Food philosophy:</p>
            <div className="flex flex-wrap gap-2">
              {FOOD_PREFERENCES.map(pref => (
                <Badge
                  key={pref}
                  variant={formData.foodPreferences.includes(pref) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('foodPreferences', pref)}
                >
                  {pref}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Cuisines that make you happy:</p>
            <div className="flex flex-wrap gap-2">
              {CUISINES.map(cuisine => (
                <Badge
                  key={cuisine}
                  variant={formData.cuisines.includes(cuisine) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('cuisines', cuisine)}
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>

          <Input
            placeholder="Ultimate comfort food that heals your soul? 🥰"
            value={formData.comfortFood}
            onChange={(e) => setFormData({...formData, comfortFood: e.target.value})}
          />

          <Input
            placeholder="Cooking level: Microwave master, home chef, culinary artist? 👨‍🍳"
            value={formData.cookingLevel}
            onChange={(e) => setFormData({...formData, cookingLevel: e.target.value})}
          />

          <Input
            placeholder="Any dietary restrictions or food allergies? 🥗"
            value={formData.dietaryRestrictions}
            onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})}
          />
        </div>
      )
    },

    // Travel & Adventure
    {
      title: "Wanderlust & Adventure 🌍",
      subtitle: "Your relationship with exploration",
      icon: Plane,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Travel personality:</p>
            <div className="flex flex-wrap gap-2">
              {TRAVEL_STYLES.map(style => (
                <Badge
                  key={style}
                  variant={formData.travelStyles.includes(style) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('travelStyles', style)}
                >
                  {style}
                </Badge>
              ))}
            </div>
          </div>

          <Textarea
            placeholder="Dream destinations and places on your bucket list... ✈️"
            value={formData.dreamDestinations}
            onChange={(e) => setFormData({...formData, dreamDestinations: e.target.value})}
            className="min-h-24"
          />

          <Input
            placeholder="How often do you travel? (local adventures count too!) 🗺️"
            value={formData.travelFrequency}
            onChange={(e) => setFormData({...formData, travelFrequency: e.target.value})}
          />
        </div>
      )
    },

    // Tech & Learning (Enhanced)
    {
      title: "Your Learning Universe 🧠",
      subtitle: "How your curious mind works",
      icon: Brain,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Tech & knowledge interests:</p>
            <div className="flex flex-wrap gap-2">
              {TECH_INTERESTS.map(interest => (
                <Badge
                  key={interest}
                  variant={formData.techInterests.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('techInterests', interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">How you learn best:</p>
            <div className="flex flex-wrap gap-2">
              {LEARNING_STYLES.map(style => (
                <Badge
                  key={style}
                  variant={formData.learningStyles.includes(style) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('learningStyles', style)}
                >
                  {style}
                </Badge>
              ))}
            </div>
          </div>

          <Input
            placeholder="Online presence: Social media style, professional networks, etc. 💻"
            value={formData.onlinePresence}
            onChange={(e) => setFormData({...formData, onlinePresence: e.target.value})}
          />
        </div>
      )
    },

    // Wellness & Growth (Enhanced)
    {
      title: "Wellness & Inner Growth 🌱",
      subtitle: "How you nurture your mind, body, and soul",
      icon: Mountain,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Wellness areas you explore:</p>
            <div className="flex flex-wrap gap-2">
              {WELLNESS_AREAS.map(area => (
                <Badge
                  key={area}
                  variant={formData.wellnessAreas.includes(area) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('wellnessAreas', area)}
                >
                  {area}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">How you relieve stress:</p>
            <div className="flex flex-wrap gap-2">
              {STRESS_RELIEVERS.map(reliever => (
                <Badge
                  key={reliever}
                  variant={formData.stressRelievers.includes(reliever) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('stressRelievers', reliever)}
                >
                  {reliever}
                </Badge>
              ))}
            </div>
          </div>

          <Input
            placeholder="How do you recharge? Alone time, nature, friends, art? 🔋"
            value={formData.rechargeActivities}
            onChange={(e) => setFormData({...formData, rechargeActivities: e.target.value})}
          />

          <Input
            placeholder="Exercise/movement style: Gym, yoga, hiking, dancing? 💪"
            value={formData.exerciseHabits}
            onChange={(e) => setFormData({...formData, exerciseHabits: e.target.value})}
          />
        </div>
      )
    },

    // Humor & Fun (Enhanced)
    {
      title: "Your Humor DNA 😂",
      subtitle: "What tickles your funny bone?",
      icon: Heart,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Your humor personality:</p>
            <div className="flex flex-wrap gap-2">
              {HUMOR_TYPES.map(humor => (
                <Badge
                  key={humor}
                  variant={formData.humorTypes.includes(humor) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('humorTypes', humor)}
                >
                  {humor}
                </Badge>
              ))}
            </div>
          </div>

          <Input
            placeholder="Where you find the best laughs: Reddit, TikTok, Instagram, Twitter? 📱"
            value={formData.humorPlatforms}
            onChange={(e) => setFormData({...formData, humorPlatforms: e.target.value})}
          />

          <Input
            placeholder="Favorite comedians, content creators, or comedy shows? 🎭"
            value={formData.favoriteComedians}
            onChange={(e) => setFormData({...formData, favoriteComedians: e.target.value})}
          />
        </div>
      )
    },

    // Sports & Games (Enhanced)
    {
      title: "Play, Sports & Competition 🎮",
      subtitle: "How you play and compete",
      icon: Gamepad2,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Sports you follow or play:</p>
            <div className="flex flex-wrap gap-2">
              {SPORTS.map(sport => (
                <Badge
                  key={sport}
                  variant={formData.sports.includes(sport) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('sports', sport)}
                >
                  {sport}
                </Badge>
              ))}
            </div>
          </div>

          <Input
            placeholder="Gaming style: Casual mobile, PC master race, console couch gamer? 🎯"
            value={formData.gamingStyle}
            onChange={(e) => setFormData({...formData, gamingStyle: e.target.value})}
          />

          <Input
            placeholder="Competitive nature: Ultra competitive, friendly rivalry, just for fun? 🏆"
            value={formData.competitiveNature}
            onChange={(e) => setFormData({...formData, competitiveNature: e.target.value})}
          />
        </div>
      )
    },

    // Life Values & Goals
    {
      title: "Your Life Philosophy 🌟",
      subtitle: "What drives you and gives life meaning?",
      icon: Target,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Core values that guide you:</p>
            <div className="flex flex-wrap gap-2">
              {LIFE_VALUES.map(value => (
                <Badge
                  key={value}
                  variant={formData.lifeValues.includes(value) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('lifeValues', value)}
                >
                  {value}
                </Badge>
              ))}
            </div>
          </div>

          <Input
            placeholder="What are you focusing on in life right now? 🎯"
            value={formData.currentFocus}
            onChange={(e) => setFormData({...formData, currentFocus: e.target.value})}
          />

          <Textarea
            placeholder="Life goals, dreams, or aspirations that excite you... 🚀"
            value={formData.lifeGoals}
            onChange={(e) => setFormData({...formData, lifeGoals: e.target.value})}
            className="min-h-24"
          />
        </div>
      )
    },

    // Daily Life & Rhythms
    {
      title: "Your Daily Rhythm 🕐",
      subtitle: "The patterns and preferences that shape your days",
      icon: Clock,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Morning personality:</p>
            <div className="flex flex-wrap gap-2">
              {MORNING_TYPES.map(type => (
                <Badge
                  key={type}
                  variant={formData.morningTypes.includes(type) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('morningTypes', type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <Input
            placeholder="What's your thing? Student, artist, developer, explorer, parent? 💼"
            value={formData.profession}
            onChange={(e) => setFormData({...formData, profession: e.target.value})}
          />

          <Input
            placeholder="Peak energy time: Early morning, afternoon focus, night owl energy? ⚡"
            value={formData.timePreference}
            onChange={(e) => setFormData({...formData, timePreference: e.target.value})}
          />

          <Input
            placeholder="Organization style: Minimalist zen, controlled chaos, hyper-organized? 📋"
            value={formData.organization}
            onChange={(e) => setFormData({...formData, organization: e.target.value})}
          />

          <Input
            placeholder="What do you wish you had more of? Time, energy, clarity, connection? ✨"
            value={formData.wantMoreOf}
            onChange={(e) => setFormData({...formData, wantMoreOf: e.target.value})}
          />
        </div>
      )
    },

    // Moods & Emotional Goals
    {
      title: "Emotional Landscape 💫",
      subtitle: "The feelings you want to cultivate",
      icon: Sparkles,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Emotions you want more of:</p>
            <div className="flex flex-wrap gap-2">
              {DESIRED_MOODS.map(mood => (
                <Badge
                  key={mood}
                  variant={formData.desiredMoods.includes(mood) ? "default" : "outline"}
                  className="cursor-pointer p-2 text-xs hover:scale-105 transition-transform"
                  onClick={() => handleArrayToggle('desiredMoods', mood)}
                >
                  {mood}
                </Badge>
              ))}
            </div>
          </div>

          <Input
            placeholder="When do you usually need MeMojo? Morning vibes, work breaks, evening reflection? 🕐"
            value={formData.whenUseApp}
            onChange={(e) => setFormData({...formData, whenUseApp: e.target.value})}
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.moodTracking}
              onCheckedChange={(checked) => setFormData({...formData, moodTracking: !!checked})}
            />
            <span className="text-sm">I'd like to track my moods and emotional patterns 📊</span>
          </div>
        </div>
      )
    },

    // People & Relationships
    {
      title: "Your People Universe 💝",
      subtitle: "The humans who make life beautiful",
      icon: Heart,
      content: (
        <div className="space-y-6">
          <Textarea
            placeholder="Tell me about your favorite humans - family, friends, partner, mentors... I'll help you remember their special moments and celebrate them! 💕"
            value={formData.favoritePeople}
            onChange={(e) => setFormData({...formData, favoritePeople: e.target.value})}
            className="min-h-32"
          />

          <Input
            placeholder="Relationship status: Single and loving it, partnered, it's complicated? 💖"
            value={formData.relationshipStatus}
            onChange={(e) => setFormData({...formData, relationshipStatus: e.target.value})}
          />

          <Input
            placeholder="Types of memories you want to capture: daily moments, big events, random thoughts? 📸"
            value={formData.memoryTypes}
            onChange={(e) => setFormData({...formData, memoryTypes: e.target.value})}
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.petLover}
              onCheckedChange={(checked) => setFormData({...formData, petLover: !!checked})}
            />
            <span className="text-sm">I'm a pet lover (they count as people too!) 🐕</span>
          </div>
        </div>
      )
    }
  ];

  const currentStep = steps[step];
  const Icon = currentStep.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Card className="w-full max-w-4xl glass-effect animate-fade-in-up">
        <CardHeader className="text-center space-y-4">
          <div className="animate-float">
            <Icon className="w-12 h-12 mx-auto text-primary" />
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {currentStep.title}
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            {currentStep.subtitle}
          </p>
          <div className="flex justify-center space-x-1 mt-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index <= step ? 'bg-primary w-8' : 'bg-muted w-2'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Step {step + 1} of {steps.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="max-h-96 overflow-y-auto px-2">
            {currentStep.content}
          </div>
          <div className="flex justify-between pt-6 border-t">
            {step > 0 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="hover:scale-105 transition-transform"
              >
                ← Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="ml-auto hover:scale-105 transition-transform bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              disabled={step === 0 && !formData.name.trim()}
            >
              {step === steps.length - 1 ? (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create My MeMojo ✨
                </>
              ) : (
                <>
                  Next →
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
