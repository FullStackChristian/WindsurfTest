// Score service for managing shared leaderboard data
import type { LeaderboardEntry } from '../components/Leaderboard';

export interface ScoreServiceResponse {
  success: boolean;
  data?: LeaderboardEntry[];
  error?: string;
}

export class ScoreService {
  private static readonly STORAGE_KEY = 'snakeGameLeaderboard';
  private static readonly MAX_SCORES = 50;

  // Get scores from localStorage
  static async getScores(): Promise<ScoreServiceResponse> {
    try {
      const localScores = this.getLocalScores();
      return { 
        success: true, 
        data: localScores 
      };
    } catch (error) {
      console.error('Failed to get scores:', error);
      return { 
        success: false, 
        data: [], 
        error: 'Failed to load scores' 
      };
    }
  }

  // Submit a new score
  static async submitScore(entry: LeaderboardEntry): Promise<ScoreServiceResponse> {
    try {
      const localScores = this.getLocalScores();
      
      // Add new score and sort
      const updatedScores = [...localScores, entry]
        .sort((a, b) => b.score - a.score)
        .slice(0, this.MAX_SCORES);
      
      this.setLocalScores(updatedScores);

      return { success: true, data: updatedScores };
    } catch (error) {
      console.error('Failed to submit score:', error);
      return { 
        success: false, 
        data: this.getLocalScores(), 
        error: 'Failed to save score' 
      };
    }
  }

  // Local storage methods
  private static getLocalScores(): LeaderboardEntry[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static setLocalScores(scores: LeaderboardEntry[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(scores));
    } catch (error) {
      console.error('Failed to save scores locally:', error);
    }
  }

  // Clear all scores
  static clearScores(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
