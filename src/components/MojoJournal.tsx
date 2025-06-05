
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Heart, Calendar, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JournalEntry {
  id: number;
  title: string;
  content: string;
  source: string;
  savedAt: string;
  mood?: string;
}

interface MojoJournalProps {
  journalEntries: JournalEntry[];
  setJournalEntries: (entries: JournalEntry[]) => void;
}

export const MojoJournal = ({ journalEntries, setJournalEntries }: MojoJournalProps) => {
  const { toast } = useToast();

  const handleDeleteEntry = (entryId: number) => {
    setJournalEntries(journalEntries.filter(entry => entry.id !== entryId));
    toast({
      title: "Entry removed 🗑️",
      description: "Removed from your Mojo Journal.",
    });
  };

  const sampleEntries = [
    {
      id: 1,
      title: "Daily Motivation",
      content: "Time to recharge through music. Your soul knows what it needs.",
      source: "Daily Feed",
      savedAt: new Date().toISOString(),
      mood: "Inspired"
    }
  ];

  const allEntries = journalEntries.length > 0 ? journalEntries : sampleEntries;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Your Mojo Journal</h2>
        <p className="text-muted-foreground">
          Everything that sparked joy ✨
        </p>
      </div>

      <div className="space-y-4">
        {allEntries.map((entry, index) => (
          <Card 
            key={entry.id}
            className="glass-effect hover:scale-[1.02] transition-transform duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-secondary">
                    <BookOpen className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(entry.savedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {entry.mood && (
                    <Badge variant="outline" className="text-xs">
                      {entry.mood}
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed mb-2">
                {entry.content}
              </p>
              <p className="text-xs text-muted-foreground">
                Saved from: {entry.source}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {allEntries.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No journal entries yet</h3>
          <p className="text-muted-foreground mb-4">
            Start saving meaningful moments from your feed
          </p>
        </div>
      )}
    </div>
  );
};
