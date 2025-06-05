import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Sparkles,
  Brain,
  Camera,
  Music,
  BookOpen,
  ArrowRight,
  Play,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has completed onboarding
    const savedUserData = localStorage.getItem("memojo-user-data");
    setHasCompletedOnboarding(!!savedUserData);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Personalization",
      description:
        "Advanced AI learns your preferences to curate the perfect daily feed just for you.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Camera,
      title: "Memory Capture",
      description:
        "Effortlessly capture and organize your precious moments with smart photo management.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Music,
      title: "Mood-Based Music",
      description:
        "Discover music that matches your current mood and enhances your emotional journey.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: BookOpen,
      title: "Smart Journaling",
      description:
        "Intelligent prompts and insights help you reflect and grow through guided journaling.",
      color: "from-orange-500 to-red-500",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Digital Creator",
      content:
        "MeMojo understands me better than I understand myself. It's like having a personal AI companion that truly cares.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b3f0?w=100",
    },
    {
      name: "Marcus Johnson",
      role: "Student",
      content:
        "The personalized content curation is incredible. Every morning feels like Christmas with my perfectly tailored feed.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
    {
      name: "Priya Sharma",
      role: "Entrepreneur",
      content:
        "Finally, an app that gets my vibe. The mood-based recommendations are spot on every single time.",
      rating: 5,
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
  ];

  const stats = [
    { number: "50K+", label: "Happy Users" },
    { number: "1M+", label: "Memories Captured" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "AI Companion" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">MeMojo</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Reviews
          </a>
          <a
            href="#about"
            className="text-gray-300 hover:text-white transition-colors"
          >
            About
          </a>
        </div>
        <Button
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          Sign In
        </Button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center space-y-8">
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
            ✨ AI-Powered Memory Companion
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Your Personal
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {" "}
              AI Sanctuary
            </span>
          </h1>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {hasCompletedOnboarding
              ? "Welcome back! Your personalized sanctuary awaits with your curated memories, music, and moments."
              : "MeMojo learns who you are, understands your mood, and curates the perfect blend of memories, music, and moments to brighten your day. Your digital companion that truly gets you."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            {hasCompletedOnboarding ? (
              <>
                <Button
                  onClick={() => navigate("/memojo")}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-xl rounded-xl shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="w-6 h-6 mr-2" />
                  Go to My MeMojo
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
                <Button
                  onClick={onGetStarted}
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-xl rounded-xl"
                >
                  <Heart className="w-6 h-6 mr-2" />
                  Start New Journey
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={onGetStarted}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-xl rounded-xl shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <Sparkles className="w-6 h-6 mr-2" />
                  Start Your Journey
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-xl rounded-xl"
                  onClick={() => setIsVideoPlaying(true)}
                >
                  <Play className="w-6 h-6 mr-2" />
                  Watch Demo
                </Button>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white">
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative z-10 max-w-7xl mx-auto px-6 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Designed for Your{" "}
            <span className="text-purple-400">Unique Journey</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Every feature is crafted to understand and enhance your personal
            experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <CardContent className="p-6">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="relative z-10 max-w-7xl mx-auto px-6 py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Loved by <span className="text-purple-400">Thousands</span>
          </h2>
          <p className="text-gray-300 text-lg">
            See what our community is saying
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white/5 border-white/10 backdrop-blur-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="text-white font-medium">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-3xl p-12 backdrop-blur-lg border border-white/10">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Daily Experience?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands who've discovered their perfect AI companion. Start
            your personalized journey today.
          </p>
          <Button
            onClick={onGetStarted}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg rounded-xl shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <Zap className="w-5 h-5 mr-2" />
            Get Started Free
          </Button>
        </div>
      </section>
    </div>
  );
};
