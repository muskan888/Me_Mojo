
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Smile, Frown, Brain, Wind } from 'lucide-react';

interface MoodToggleProps {
  currentMood: string;
  onMoodChange: (mood: string) => void;
}

export const MoodToggle = ({ currentMood, onMoodChange }: MoodToggleProps) => {
  const moods = [
    { value: 'happy', label: 'Happy', icon: Smile, color: 'text-yellow-500' },
    { value: 'sad', label: 'Sad', icon: Frown, color: 'text-blue-500' },
    { value: 'deep', label: 'Deep', icon: Brain, color: 'text-purple-500' },
    { value: 'chill', label: 'Chill', icon: Wind, color: 'text-green-500' },
  ];

  return (
    <div className="flex flex-col items-center space-y-3">
      <p className="text-sm text-muted-foreground">How are you feeling?</p>
      <ToggleGroup 
        type="single" 
        value={currentMood} 
        onValueChange={onMoodChange}
        className="grid grid-cols-4 gap-2"
      >
        {moods.map(({ value, label, icon: Icon, color }) => (
          <ToggleGroupItem 
            key={value} 
            value={value}
            className="flex flex-col items-center p-3 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            <Icon className={`w-5 h-5 mb-1 ${color}`} />
            <span className="text-xs">{label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
};
