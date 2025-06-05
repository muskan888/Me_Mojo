import React from 'react';
import { Home, Calendar, Camera, BookOpen, BarChart3, Settings, Image, Brain, TrendingUp } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navigation = ({ activeTab, setActiveTab }: NavigationProps) => {
  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'memories', label: 'Memories', icon: Image },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'insights', label: 'Insights', icon: Brain },
    { id: 'recap', label: 'Recap', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-t-3xl border border-white/20 shadow-2xl">
          <div className="flex justify-around py-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'text-purple-600 bg-purple-100 scale-110 shadow-lg' 
                    : 'text-gray-500 hover:text-purple-500 hover:bg-purple-50 hover:scale-105'
                }`}
              >
                <item.icon className={`w-6 h-6 mb-1 transition-all duration-300 ${
                  activeTab === item.id ? 'animate-gentle-pulse' : ''
                }`} />
                <span className={`text-xs font-medium transition-all duration-300 ${
                  activeTab === item.id ? 'font-semibold' : ''
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
