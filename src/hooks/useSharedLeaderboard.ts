import { useState, useEffect, useCallback } from 'react';
import { ScoreService } from '../services/scoreService';
import type { LeaderboardEntry } from '../components/Leaderboard';

export interface UseSharedLeaderboardReturn {
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  isOnline: boolean;
  submitScore: (name: string, score: number) => Promise<void>;
  refreshScores: () => Promise<void>;
}

export const useSharedLeaderboard = (): UseSharedLeaderboardReturn => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load scores on component mount
  const loadScores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await ScoreService.getScores();
      setLeaderboard(result.data || []);
      
      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load leaderboard');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Submit a new score
  const submitScore = useCallback(async (name: string, score: number) => {
    const entry: LeaderboardEntry = {
      name: name.trim() || 'Anonymous',
      score,
      date: new Date().toLocaleDateString(),
    };

    try {
      const result = await ScoreService.submitScore(entry);
      setLeaderboard(result.data || []);
      
      if (!result.success && result.error) {
        setError(result.error);
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Failed to submit score');
    }
  }, []);

  // Refresh scores manually
  const refreshScores = useCallback(async () => {
    await loadScores();
  }, [loadScores]);

  // Load scores on mount
  useEffect(() => {
    loadScores();
  }, [loadScores]);

  return {
    leaderboard,
    isLoading,
    error,
    isOnline: true, // Always true for localStorage
    submitScore,
    refreshScores,
  };
};
