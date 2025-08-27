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
  const [isOnline, setIsOnline] = useState(true);

  // Load scores on component mount
  const loadScores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await ScoreService.getScores();
      setLeaderboard(result.data || []);
      setIsOnline(result.success);
      
      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load leaderboard');
      setIsOnline(false);
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
      setIsOnline(result.success);
      
      if (!result.success && result.error) {
        setError(result.error);
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Failed to submit score');
      setIsOnline(false);
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

  // Auto-refresh every 30 seconds when online
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      loadScores();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isOnline, loadScores]);

  return {
    leaderboard,
    isLoading,
    error,
    isOnline,
    submitScore,
    refreshScores,
  };
};
