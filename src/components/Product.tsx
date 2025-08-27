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
    <div className="lg:flex gap-4">
      <Controls />
      <SnakeGame onGameEnd={handleGameEnd} />
      <Leaderboard 
        newScore={latestScore} 
        onPlayerNameSubmit={handlePlayerNameSubmit}
      />
    </div>
  );
};

export default Product;
