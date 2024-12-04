export interface AppShortcut {
    id: string; // Уникальный идентификатор
    name: string;
    path: string;
    usageStats?: UsageStats;
    icon?: string; // добавьте это свойство
    background?: string; // добавьте это свойство
  }

export interface UsageStats {
    launchCount: number;
    totalTime: number;
    averageTimePerLaunch: number;
    lastLaunch: string;
  }
  