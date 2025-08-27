import React, { useState, useEffect } from "react";
import { STORAGE_KEYS, MAX_LEADERBOARD_ENTRIES } from "../constants/gameConstants";

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
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showNameInput, setShowNameInput] = useState(false);

  // Load leaderboard from localStorage on component mount
  useEffect(() => {
    const savedLeaderboard = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
  }, []);

  // Show name input when a new score is available
  useEffect(() => {
    if (newScore !== undefined && newScore > 0) {
      setShowNameInput(true);
    }
  }, [newScore]);

  const addScore = (name: string, score: number) => {
    const newEntry: LeaderboardEntry = {
      name: name.trim() || "Anonymous",
      score,
      date: new Date().toLocaleDateString(),
    };

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_LEADERBOARD_ENTRIES);

    setLeaderboard(updatedLeaderboard);
    localStorage.setItem(
      STORAGE_KEYS.LEADERBOARD,
      JSON.stringify(updatedLeaderboard)
    );
  };

  const handleSubmitScore = () => {
    if (newScore !== undefined) {
      addScore(playerName, newScore);
      setPlayerName("");
      setShowNameInput(false);
      if (onPlayerNameSubmit) {
        onPlayerNameSubmit(playerName.trim() || "Anonymous");
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

  const getRankStyles = (index: number) => {
    switch (index) {
      case 0: return "bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400 shadow-lg";
      case 1: return "bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-400 shadow-md";
      case 2: return "bg-gradient-to-r from-orange-100 to-orange-200 border-2 border-orange-400 shadow-md";
      default: return "bg-white border border-gray-200 hover:bg-gray-50";
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white text-center flex items-center justify-center gap-2">
          🏆 Leaderboard
        </h2>
      </div>

      {/* Score Input Modal */}
      {showNameInput && (
        <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
          <div className="text-center mb-4">
            <div className="text-3xl mb-2">🎉</div>
            <h3 className="text-xl font-bold text-green-800 mb-1">
              Awesome Score: {newScore}!
            </h3>
            <p className="text-sm text-green-600">
              Enter your name to join the hall of fame
            </p>
          </div>
          
          <div className="space-y-3">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-center font-medium"
              maxLength={20}
              onKeyPress={(e) => e.key === "Enter" && handleSubmitScore()}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleSubmitScore}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>💾</span> Save Score
              </button>
              <button
                onClick={handleSkipScore}
                className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors duration-200"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Content */}
      <div className="p-6">
        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <p className="text-gray-500 text-lg font-medium mb-2">
              No scores yet!
            </p>
            <p className="text-gray-400 text-sm">
              Be the first to play and claim the top spot
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                📊 Top {Math.min(leaderboard.length, MAX_LEADERBOARD_ENTRIES)} Players
              </span>
              <span className="text-xs text-gray-400">
                {leaderboard.length} total scores
              </span>
            </div>
            
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div
                  key={`${entry.name}-${entry.score}-${index}`}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${getRankStyles(index)}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getRankIcon(index)}</span>
                      <span className="font-bold text-lg text-gray-700">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 truncate max-w-32">
                        {entry.name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        📅 {entry.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl text-red-600">
                      {entry.score}
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              ))}
            </div>

            {leaderboard.length >= 10 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                <p className="text-sm text-red-700">
                  🔥 Competition is heating up! Can you beat the top score?
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
