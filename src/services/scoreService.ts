// Score service for managing shared leaderboard data
import type { LeaderboardEntry } from '../components/Leaderboard';

const JSONBIN_API_URL = 'https://api.jsonbin.io/v3';
const BIN_ID = '676e5c4aad19ca34f8c8e8f5'; // Public bin for snake game scores
const API_KEY = '$2a$10$9vK8vQI6Yu6NuV6VBFbqMuBdHvVQI6Yu6NuV6VBFbqMuBdHvVQI6Yu'; // Read-only public key

export interface ScoreServiceResponse {
  success: boolean;
  data?: LeaderboardEntry[];
  error?: string;
}

export class ScoreService {
  private static readonly FALLBACK_STORAGE_KEY = 'snakeGameLeaderboard_fallback';
  private static readonly CACHE_KEY = 'snakeGameLeaderboard_cache';
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Get scores from remote API with fallback to localStorage
  static async getScores(): Promise<ScoreServiceResponse> {
    try {
      // Check cache first
      const cachedData = this.getCachedScores();
      if (cachedData) {
        return { success: true, data: cachedData };
      }

      // Fetch from remote API
      const response = await fetch(`${JSONBIN_API_URL}/b/${BIN_ID}/latest`, {
        method: 'GET',
        headers: {
          'X-Master-Key': API_KEY,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const scores = result.record?.scores || [];
      
      // Cache the results
      this.setCachedScores(scores);
      
      return { success: true, data: scores };
    } catch (error) {
      console.warn('Failed to fetch remote scores, using local fallback:', error);
      
      // Fallback to localStorage
      const localScores = this.getLocalScores();
      return { 
        success: false, 
        data: localScores, 
        error: 'Using local scores - remote sync unavailable' 
      };
    }
  }

  // Submit a new score to remote API
  static async submitScore(entry: LeaderboardEntry): Promise<ScoreServiceResponse> {
    try {
      // Get current scores
      const currentScores = await this.getScores();
      const scores = currentScores.data || [];
      
      // Add new score and sort
      const updatedScores = [...scores, entry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 100); // Keep top 100 scores

      // Try to update remote storage
      const response = await fetch(`${JSONBIN_API_URL}/b/${BIN_ID}`, {
        method: 'PUT',
        headers: {
          'X-Master-Key': API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scores: updatedScores }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update cache
      this.setCachedScores(updatedScores);
      
      // Also save to local storage as backup
      this.setLocalScores(updatedScores);

      return { success: true, data: updatedScores };
    } catch (error) {
      console.warn('Failed to submit score to remote, saving locally:', error);
      
      // Fallback to local storage
      const localScores = this.getLocalScores();
      const updatedLocalScores = [...localScores, entry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 100);
      
      this.setLocalScores(updatedLocalScores);
      
      return { 
        success: false, 
        data: updatedLocalScores, 
        error: 'Score saved locally - remote sync unavailable' 
      };
    }
  }

  // Cache management
  private static getCachedScores(): LeaderboardEntry[] | null {
    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      
      if (now - timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }
      
      return data;
    } catch {
      return null;
    }
  }

  private static setCachedScores(scores: LeaderboardEntry[]): void {
    try {
      const cacheData = {
        data: scores,
        timestamp: Date.now(),
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache scores:', error);
    }
  }

  // Local storage fallback
  private static getLocalScores(): LeaderboardEntry[] {
    try {
      const stored = localStorage.getItem(this.FALLBACK_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static setLocalScores(scores: LeaderboardEntry[]): void {
    try {
      localStorage.setItem(this.FALLBACK_STORAGE_KEY, JSON.stringify(scores));
    } catch (error) {
      console.warn('Failed to save scores locally:', error);
    }
  }

  // Clear all cached data
  static clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
  }
}
