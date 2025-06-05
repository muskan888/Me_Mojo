interface UserPreference {
  itemId: string;
  itemType: string;
  action: 'love' | 'save' | 'view';
  timestamp: Date;
  content: string;
  tags?: string[];
}

export class UserPreferencesService {
  private static STORAGE_KEY = 'mojo_user_preferences';

  static savePreference(preference: UserPreference) {
    const preferences = this.getPreferences();
    preferences.push(preference);
    
    // Keep only last 100 preferences to avoid storage issues
    if (preferences.length > 100) {
      preferences.splice(0, preferences.length - 100);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(preferences));
  }

  static getPreferences(): UserPreference[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static getLovedItems(): UserPreference[] {
    return this.getPreferences().filter(pref => pref.action === 'love');
  }

  static isItemLoved(itemId: string): boolean {
    return this.getPreferences().some(pref => pref.itemId === itemId && pref.action === 'love');
  }

  static getPreferenceStats() {
    const preferences = this.getPreferences();
    const lovedTypes = preferences
      .filter(pref => pref.action === 'love')
      .map(pref => pref.itemType);
    
    const typeCount = lovedTypes.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalLoved: lovedTypes.length,
      typePreferences: typeCount,
      recentActivity: preferences.slice(-10)
    };
  }
}
