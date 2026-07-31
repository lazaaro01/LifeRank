export function xpThresholdForLevel(level: number): number {
  return 50 * ((level * (level + 1)) / 2 - 1);
}

export function getLevelFromXp(xp: number): number {
  let level = 1;
  while (xpThresholdForLevel(level + 1) <= xp) {
    level++;
  }
  return level;
}

export type LevelProgress = {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number;
};

export function getLevelProgress(xp: number): LevelProgress {
  const level = getLevelFromXp(xp);
  const currentLevelXp = xpThresholdForLevel(level);
  const nextLevelXp = xpThresholdForLevel(level + 1);
  const xpIntoLevel = xp - currentLevelXp;
  const xpForNextLevel = nextLevelXp - currentLevelXp;

  return {
    level,
    xpIntoLevel,
    xpForNextLevel,
    progress: xpForNextLevel > 0 ? xpIntoLevel / xpForNextLevel : 1,
  };
}
