import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { DailyFeed } from "@/components/DailyFeed";
import { VoiceInput } from "@/components/VoiceInput";
import { MemoryGallery } from "@/components/MemoryGallery";
import { TodaysMojo } from "@/components/TodaysMojo";
import { MojoJournal } from "@/components/MojoJournal";
import { WeeklyRecap } from "@/components/WeeklyRecap";
import { SmartInsights } from "@/components/SmartInsights";

interface MainAppProps {
  userData: any;
}

export const MainApp = ({ userData }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState("feed");
  const [memories, setMemories] = useState<any[]>([]);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);

  const handleSaveToJournal = (entry: any) => {
    setJournalEntries([entry, ...journalEntries]);
  };

  const handleVoiceFeedChange = (section: string) => {
    // Map voice commands to actual tab names
    const sectionMap: { [key: string]: string } = {
      overview: "feed",
      feed: "feed",
      home: "feed",
      news: "feed", // Will show news section within feed
      food: "feed", // Will show food section within feed
      people: "feed", // Will show people section within feed
      travel: "feed", // Will show travel section within feed
      surprise: "feed", // Will show surprise section within feed
      today: "today",
      memories: "memories",
      journal: "journal",
      insights: "insights",
      recap: "recap",
      settings: "settings",
    };

    const targetTab =
      sectionMap[section.toLowerCase()] || section.toLowerCase();
    setActiveTab(targetTab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "feed":
        return (
          <DailyFeed
            userData={userData}
            onSaveToJournal={handleSaveToJournal}
          />
        );
      case "today":
        return <TodaysMojo userData={userData} />;
      case "memories":
        return <MemoryGallery memories={memories} setMemories={setMemories} />;
      case "journal":
        return (
          <MojoJournal
            journalEntries={journalEntries}
            setJournalEntries={setJournalEntries}
          />
        );
      case "insights":
        return (
          <SmartInsights
            userData={userData}
            journalEntries={journalEntries}
            memories={memories}
          />
        );
      case "recap":
        return (
          <WeeklyRecap
            userData={userData}
            journalEntries={journalEntries}
            memories={memories}
          />
        );
      default:
        return (
          <DailyFeed
            userData={userData}
            onSaveToJournal={handleSaveToJournal}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="glass-effect border-b border-white/20 sticky top-0 z-10 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="animate-fade-in-up">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">✨</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    MeMojo
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {userData.name} 👋
                  </p>
                </div>
              </div>
            </div>
            <div className="animate-fade-in-up animation-delay-200">
              <VoiceInput
                userData={userData}
                onFeedChange={handleVoiceFeedChange}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 pb-20">
        <div className="animate-fade-in-up animation-delay-400">
          {renderContent()}
        </div>
      </main>

      {/* Bottom Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};
