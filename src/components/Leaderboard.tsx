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

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">🏆 Leaderboard</h2>

      {showNameInput && (
        <div className="mb-4 p-4 bg-yellow-50 rounded border">
          <h3 className="text-lg font-semibold mb-2">
            Great score: {newScore}!
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Enter your name to appear on the leaderboard:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={20}
              onKeyPress={(e) => e.key === "Enter" && handleSubmitScore()}
            />
            <button
              onClick={handleSubmitScore}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
            <button
              onClick={handleSkipScore}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {leaderboard.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No scores yet. Be the first to play!
          </p>
        ) : (
          <>
            <div className="mb-2">
              <span className="text-sm font-semibold text-gray-600">
                Top {Math.min(leaderboard.length, 25)} Players
              </span>
            </div>
            {leaderboard.map((entry, index) => (
              <div
                key={`${entry.name}-${entry.score}-${index}`}
                className={`flex justify-between items-center p-3 rounded ${
                  index === 0
                    ? "bg-yellow-100 border-2 border-yellow-400"
                    : index === 1
                    ? "bg-gray-100 border-2 border-gray-400"
                    : index === 2
                    ? "bg-orange-100 border-2 border-orange-400"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-bold text-lg ${
                      index === 0
                        ? "text-yellow-600"
                        : index === 1
                        ? "text-gray-600"
                        : index === 2
                        ? "text-orange-600"
                        : "text-gray-500"
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <div>
                    <div className="font-semibold">{entry.name}</div>
                    <div className="text-xs text-gray-500">{entry.date}</div>
                  </div>
                </div>
                <div className="font-bold text-lg text-blue-600">
                  {entry.score}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
