
import { useState } from 'react';
import { EnhancedVoiceInput } from '@/components/EnhancedVoiceInput';

interface VoiceInputProps {
  userData: any;
  apiKey?: string;
  onFeedChange?: (section: string) => void;
}

export const VoiceInput = ({ userData, apiKey, onFeedChange }: VoiceInputProps) => {
  return (
    <EnhancedVoiceInput 
      userData={userData} 
      apiKey={apiKey}
      onFeedChange={onFeedChange}
      onTranscriptionComplete={(text, response) => {
        console.log('Voice interaction:', { text, response });
      }}
    />
  );
};
