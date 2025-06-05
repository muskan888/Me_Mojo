
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UserPreferencesService } from '@/utils/userPreferences';

interface LoveButtonProps {
  item: {
    id: string;
    type: string;
    title: string;
    content: string;
    tags?: string[];
  };
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline';
}

export const LoveButton = ({ item, size = 'sm', variant = 'outline' }: LoveButtonProps) => {
  const [isLoved, setIsLoved] = useState(() => 
    UserPreferencesService.isItemLoved(item.id)
  );
  const { toast } = useToast();

  const handleLove = () => {
    if (!isLoved) {
      // Save the preference
      UserPreferencesService.savePreference({
        itemId: item.id,
        itemType: item.type,
        action: 'love',
        timestamp: new Date(),
        content: item.content,
        tags: item.tags
      });

      setIsLoved(true);

      // Get updated stats for learning
      const stats = UserPreferencesService.getPreferenceStats();
      console.log('AI Learning: User preferences updated', {
        item: item.title,
        type: item.type,
        totalLoved: stats.totalLoved,
        preferences: stats.typePreferences
      });

      toast({
        title: "Added to your loves! 💝",
        description: `I'm learning that you enjoy ${item.type} content like this. This helps me personalize your feed better!`,
      });
    } else {
      toast({
        title: "Already loved! 💖",
        description: "This item is already in your favorites.",
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLove}
      className={`hover:scale-105 transition-transform ${
        isLoved 
          ? 'border-pink-300 bg-pink-50 hover:bg-pink-100' 
          : 'border-pink-200 hover:bg-pink-50'
      }`}
    >
      <Heart 
        className={`w-4 h-4 mr-2 ${
          isLoved ? 'text-pink-500 fill-pink-500' : 'text-pink-500'
        }`} 
      />
      {isLoved ? 'Loved' : 'Love'}
    </Button>
  );
};
