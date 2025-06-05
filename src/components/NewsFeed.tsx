import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ExternalLink, Brain, Clock, Sparkles, TrendingUp } from 'lucide-react';

interface NewsFeedProps {
  userData: any;
}

export const NewsFeed = ({ userData }: NewsFeedProps) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [summaries, setSummaries] = useState<{[key: string]: string}>({});

  useEffect(() => {
    generateNewsContent();
  }, [userData]);

  const generateNewsContent = () => {
    const interests = userData.techInterests || [];
    const mockArticles = [
      {
        id: 1,
        title: 'AI Revolution: New Breakthrough in Neural Networks',
        source: 'TechCrunch',
        category: 'AI',
        excerpt: 'Scientists announce major advancement in artificial intelligence that could reshape how we interact with technology.',
        url: '#',
        timestamp: '2 hours ago',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=200&fit=crop',
        trending: true
      },
      {
        id: 2,
        title: 'The Future of Space Exploration: Mars Mission Updates',
        source: 'Space News',
        category: 'Space',
        excerpt: 'Latest developments in the upcoming Mars mission reveal exciting possibilities for human settlement.',
        url: '#',
        timestamp: '4 hours ago',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=200&fit=crop',
        trending: false
      },
      {
        id: 3,
        title: 'Startup Ecosystem: New Funding Trends in 2024',
        source: 'Venture Beat',
        category: 'Startups',
        excerpt: 'Analysis of current investment patterns and emerging opportunities in the startup landscape.',
        url: '#',
        timestamp: '6 hours ago',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop',
        trending: true
      },
      {
        id: 4,
        title: 'Quantum Computing Breakthrough: IBM Announces New Chip',
        source: 'MIT Technology Review',
        category: 'Quantum',
        excerpt: 'IBM\'s latest quantum processor could accelerate solving complex problems in cryptography and optimization.',
        url: '#',
        timestamp: '8 hours ago',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop',
        trending: false
      },
      {
        id: 5,
        title: 'Sustainable Tech: Green Energy Innovations Surge',
        source: 'Clean Tech',
        category: 'Green Tech',
        excerpt: 'Revolutionary solar panel technology promises 40% efficiency boost, making renewable energy more accessible.',
        url: '#',
        timestamp: '10 hours ago',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=200&fit=crop',
        trending: true
      }
    ];

    // Filter based on user interests or show all if no specific interests
    const filteredArticles = interests.length > 0 
      ? mockArticles.filter(article => 
          interests.some((interest: string) => 
            article.category.toLowerCase().includes(interest.toLowerCase()) ||
            article.title.toLowerCase().includes(interest.toLowerCase())
          )
        )
      : mockArticles;

    setArticles(filteredArticles.length > 0 ? filteredArticles : mockArticles);
  };

  const generateSummary = async (articleId: number) => {
    // Mock AI summary generation with more personalized content
    const summaryTexts = [
      "This breakthrough in neural networks represents a paradigm shift in how AI systems learn and adapt. The new architecture shows remarkable improvements in efficiency and human-like reasoning, potentially revolutionizing fields from healthcare diagnostics to creative industries. For someone interested in AI, this could mean more intuitive and powerful tools in the near future.",
      "The Mars mission updates reveal exciting progress in habitat technology and life support systems. Scientists are making significant strides in creating sustainable living environments for future astronauts. This represents humanity's next giant leap in space exploration and could pave the way for interplanetary civilization within our lifetime.",
      "Venture capital trends show a significant shift toward AI-powered startups and climate technology solutions. Investors are increasingly focused on companies that combine technological innovation with social impact. This trend suggests exciting opportunities for entrepreneurs working on meaningful problems.",
      "IBM's quantum computing advancement brings us closer to solving problems that are impossible for classical computers. This could revolutionize cryptography, drug discovery, and financial modeling. The implications for cybersecurity and scientific research are profound.",
      "The solar panel efficiency breakthrough could be a game-changer for renewable energy adoption. With 40% efficiency, solar power becomes economically viable in more regions, accelerating the transition to clean energy and potentially reducing global carbon emissions significantly."
    ];
    
    setSummaries(prev => ({
      ...prev,
      [articleId]: summaryTexts[articleId - 1] || "Summary generated successfully with personalized insights."
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold flex items-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <Newspaper className="w-6 h-6 mr-3 text-blue-600" />
          Headlines You'll Actually Read
        </h3>
        <Badge variant="outline" className="border-purple-200 text-purple-700">
          <Sparkles className="w-3 h-3 mr-1" />
          Curated for you
        </Badge>
      </div>
      
      {articles.map((article) => (
        <Card key={article.id} className="glass-effect hover:scale-[1.02] transition-all duration-500 overflow-hidden border-0 shadow-xl">
          {/* Article Image Header */}
          <div className="relative h-48 overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Trending indicator */}
            {article.trending && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-500 text-white border-0">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              </div>
            )}

            {/* Category badge */}
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                {article.category}
              </Badge>
            </div>
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl leading-tight mb-3 hover:text-purple-600 transition-colors">
                  {article.title}
                </CardTitle>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <span className="font-medium text-purple-600">{article.source}</span>
                  <span>•</span>
                  <span>{article.timestamp}</span>
                  <span>•</span>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {article.excerpt}
            </p>
            
            {summaries[article.id] && (
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl mb-4 border border-purple-100">
                <h4 className="font-semibold mb-3 flex items-center text-purple-700">
                  <Brain className="w-5 h-5 mr-2" />
                  AI Summary - Tailored for You
                </h4>
                <p className="text-sm leading-relaxed text-gray-700">{summaries[article.id]}</p>
              </div>
            )}
            
            <div className="flex flex-wrap gap-3">
              <Button
                variant="default"
                size="sm"
                onClick={() => generateSummary(article.id)}
                disabled={!!summaries[article.id]}
                className={`transition-all duration-300 ${
                  summaries[article.id] 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600'
                } hover:scale-105`}
              >
                <Brain className="w-4 h-4 mr-2" />
                {summaries[article.id] ? 'Summarized ✓' : 'Summarize for me'}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm"
                className="hover:scale-105 transition-all duration-300 border-purple-200 hover:bg-purple-50"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Read Full Article
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
