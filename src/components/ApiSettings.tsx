import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, Eye, EyeOff, Check, X, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiSettingsProps {
  onApiKeyChange?: (apiKey: string) => void;
}

export const ApiSettings = ({ onApiKeyChange }: ApiSettingsProps) => {
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    spotify: '',
    news: '',
    weather: '',
    unsplash: ''
  });
  const [showKeys, setShowKeys] = useState({
    openai: false,
    spotify: false,
    news: false,
    weather: false,
    unsplash: false
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load saved API keys from localStorage
    const savedKeys = localStorage.getItem('memojo-api-keys');
    if (savedKeys) {
      const parsedKeys = JSON.parse(savedKeys);
      setApiKeys(parsedKeys);
      // Notify parent component about the OpenAI key
      if (parsedKeys.openai && onApiKeyChange) {
        onApiKeyChange(parsedKeys.openai);
      }
    }
  }, [onApiKeyChange]);

  const handleSaveKey = (keyType: string, value: string) => {
    const updatedKeys = { ...apiKeys, [keyType]: value };
    setApiKeys(updatedKeys);
    localStorage.setItem('memojo-api-keys', JSON.stringify(updatedKeys));
    
    // Notify parent component if it's the OpenAI key
    if (keyType === 'openai' && onApiKeyChange) {
      onApiKeyChange(value);
    }
    
    toast({
      title: "API Key Saved",
      description: `${keyType.toUpperCase()} API key has been saved locally.`,
    });
  };

  const toggleKeyVisibility = (keyType: string) => {
    setShowKeys(prev => ({ ...prev, [keyType]: !prev[keyType as keyof typeof prev] }));
  };

  const apiConfigs = [
    {
      key: 'openai',
      name: 'OpenAI',
      description: 'For GPT summaries, journal prompts, and personalized content',
      placeholder: 'sk-...',
      required: true,
      getUrl: 'https://platform.openai.com/api-keys'
    },
    {
      key: 'spotify',
      name: 'Spotify',
      description: 'For music recommendations and playlist integration',
      placeholder: 'Client ID',
      required: false,
      getUrl: 'https://developer.spotify.com/dashboard'
    },
    {
      key: 'news',
      name: 'News API',
      description: 'For personalized news feed',
      placeholder: 'Your News API key',
      required: false,
      getUrl: 'https://newsapi.org/register'
    },
    {
      key: 'weather',
      name: 'OpenWeatherMap',
      description: 'For weather-based mood suggestions',
      placeholder: 'Your weather API key',
      required: false,
      getUrl: 'https://openweathermap.org/api'
    },
    {
      key: 'unsplash',
      name: 'Unsplash',
      description: 'For high-quality memory photos',
      placeholder: 'Access Key',
      required: false,
      getUrl: 'https://unsplash.com/developers'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold flex items-center justify-center">
          <Settings className="w-6 h-6 mr-2" />
          API Settings
        </h2>
        <p className="text-muted-foreground">
          Connect your favorite services for enhanced personalization
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-yellow-800 mb-2">Important Note</h3>
        <p className="text-sm text-yellow-700">
          API keys are stored locally in your browser. For production use, consider connecting to Supabase for secure key management.
        </p>
      </div>

      <div className="grid gap-6">
        {apiConfigs.map((config) => (
          <Card key={config.key} className="glass-effect">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{config.name}</span>
                    {config.required && <Badge variant="destructive">Required</Badge>}
                    {apiKeys[config.key as keyof typeof apiKeys] && (
                      <Badge variant="default" className="bg-green-500">
                        <Check className="w-3 h-3 mr-1" />
                        Connected
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {config.description}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(config.getUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Get Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label htmlFor={config.key}>API Key</Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      id={config.key}
                      type={showKeys[config.key as keyof typeof showKeys] ? 'text' : 'password'}
                      placeholder={config.placeholder}
                      value={apiKeys[config.key as keyof typeof apiKeys]}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, [config.key]: e.target.value }))}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                      onClick={() => toggleKeyVisibility(config.key)}
                    >
                      {showKeys[config.key as keyof typeof showKeys] ? 
                        <EyeOff className="w-4 h-4" /> : 
                        <Eye className="w-4 h-4" />
                      }
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleSaveKey(config.key, apiKeys[config.key as keyof typeof apiKeys])}
                    disabled={!apiKeys[config.key as keyof typeof apiKeys]}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-effect">
        <CardHeader>
          <CardTitle>Usage Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• OpenAI key is required for GPT-powered features like summaries and personalized content</li>
            <li>• Spotify integration enhances music recommendations based on your mood</li>
            <li>• News API provides real-time, personalized news feed</li>
            <li>• Weather API enables mood suggestions based on current conditions</li>
            <li>• Unsplash provides beautiful, high-quality images for your memories</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
