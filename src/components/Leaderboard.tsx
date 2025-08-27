import React, { useState, useEffect } from "react";
import { MAX_LEADERBOARD_ENTRIES } from "../constants/gameConstants";
import { useSharedLeaderboard } from "../hooks/useSharedLeaderboard";

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

interface LeaderboardProps {
  onPlayerNameSubmit?: (name: string) => void;
  newScore?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  onPlayerNameSubmit,
  newScore,
}) => {
  const [playerName, setPlayerName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    leaderboard, 
    isLoading, 
    error, 
    isOnline, 
    submitScore, 
    refreshScores 
  } = useSharedLeaderboard();

  // Show name input when a new score is available
  useEffect(() => {
    if (newScore !== undefined && newScore > 0) {
      setShowNameInput(true);
    }
  }, [newScore]);

  const handleSubmitScore = async () => {
    if (newScore !== undefined && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await submitScore(playerName, newScore);
        setPlayerName("");
        setShowNameInput(false);
        if (onPlayerNameSubmit) {
          onPlayerNameSubmit(playerName.trim() || "Anonymous");
        }
      } catch (error) {
        console.error('Failed to submit score:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSkipScore = () => {
    setShowNameInput(false);
    setPlayerName("");
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return "🏅";
    }
  };


  return (
    <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl shadow-xl border border-red-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-red-800 text-center flex-1">
          🏆 Leaderboard
        </h2>
        <div className="flex items-center gap-2">
          {isLoading && (
            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          )}
          <button
            onClick={refreshScores}
            disabled={isLoading}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh scores"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Connection status */}
      <div className="mb-4 flex items-center justify-center gap-2 text-sm">
        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
        <span className={isOnline ? 'text-green-700' : 'text-yellow-700'}>
          {isOnline ? 'Global leaderboard' : 'Local scores only'}
        </span>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800 text-sm">
          ⚠️ {error}
        </div>
      )}

      {showNameInput && (
        <div className="mb-6 p-4 bg-white rounded-xl border-2 border-red-300 shadow-md">
          <h3 className="text-lg font-semibold text-red-700 mb-3">
            🎉 New High Score: {newScore}!
          </h3>
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="px-4 py-2 border-2 border-red-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors"
              maxLength={20}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmitScore();
                }
              }}
              disabled={isSubmitting}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSubmitScore}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Score'}
              </button>
              <button
                onClick={handleSkipScore}
                disabled={isSubmitting}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {isLoading && leaderboard.length === 0 ? (
          <div className="text-red-600 text-center py-8">
            <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading scores...
          </div>
        ) : leaderboard.length === 0 ? (
          <p className="text-red-600 text-center py-8 italic">
            No scores yet. Be the first to play!
          </p>
        ) : (
          leaderboard.slice(0, MAX_LEADERBOARD_ENTRIES).map((entry, index) => (
            <div
              key={`${entry.name}-${entry.score}-${index}`}
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-red-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getRankIcon(index)}</span>
                <div>
                  <div className="font-semibold text-red-800">
                    {entry.name}
                  </div>
                  <div className="text-sm text-red-600">{entry.date}</div>
                </div>
              </div>
              <div className="text-xl font-bold text-red-700">
                {entry.score}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
