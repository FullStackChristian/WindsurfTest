import { useState } from "react";
import Controls from "./Controls";
import SnakeGame from "./SnakeGame";
import Leaderboard from "./Leaderboard";

const Product = () => {
  const [latestScore, setLatestScore] = useState<number | undefined>(undefined);

  const handleGameEnd = (score: number) => {
    setLatestScore(score);
  };

  const handlePlayerNameSubmit = () => {
    // Reset the score after it's been submitted to leaderboard
    setLatestScore(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            🐍 Snake Game Arena
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Test your reflexes and strategy in this classic snake game. Eat food, grow longer, and avoid collisions to achieve the highest score!
          </p>
        </div>

        {/* Game Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Controls - Left Column */}
          <div className="xl:order-1">
            <Controls />
          </div>

          {/* Snake Game - Center Column */}
          <div className="xl:order-2">
            <SnakeGame onGameEnd={handleGameEnd} />
          </div>

          {/* Leaderboard - Right Column */}
          <div className="xl:order-3">
            <Leaderboard 
              newScore={latestScore} 
              onPlayerNameSubmit={handlePlayerNameSubmit}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Built with React, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

export default Product;
