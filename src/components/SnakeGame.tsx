import React from "react";
import { useSnakeGame } from "../hooks/useSnakeGame";
import { Direction, Difficulty } from "../constants/gameConstants";
import GameBoard from "./GameBoard";

interface SnakeGameProps {
  onGameEnd?: (score: number) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onGameEnd }) => {
  const {
    snake,
    food,
    difficulty,
    score,
    gameOver,
    isPaused,
    setDifficulty,
    handleDirectionChange,
    resetGame,
    togglePause,
  } = useSnakeGame(onGameEnd);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Snake Game</h2>
        {!gameOver && (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
            onClick={togglePause}
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
        )}
      </div>

      <div className="flex flex-wrap pb-4 gap-2 text-sm">
        <span className="font-semibold">Difficulty:</span>
        <button
          className={`font-bold py-1 px-3 rounded ${
            difficulty === Difficulty.Easy
              ? "bg-red-600 text-white"
              : "bg-red-500 hover:bg-red-700 text-white"
          }`}
          onClick={() => setDifficulty(Difficulty.Easy)}
          disabled={!gameOver}
        >
          Easy
        </button>
        <button
          className={`font-bold py-1 px-3 rounded ${
            difficulty === Difficulty.Medium
              ? "bg-red-700 text-white"
              : "bg-red-600 hover:bg-red-800 text-white"
          }`}
          onClick={() => setDifficulty(Difficulty.Medium)}
          disabled={!gameOver}
        >
          Medium
        </button>
        <button
          className={`font-bold py-1 px-3 rounded ${
            difficulty === Difficulty.Hard
              ? "bg-red-800 text-white"
              : "bg-red-700 hover:bg-red-900 text-white"
          }`}
          onClick={() => setDifficulty(Difficulty.Hard)}
          disabled={!gameOver}
        >
          Hard
        </button>
      </div>

      <GameBoard snake={snake} food={food} />

      <div className="flex justify-between items-center mt-4">
        <p className="text-lg font-bold">Score: {score}</p>
        {isPaused && !gameOver && (
          <p className="text-yellow-600 font-semibold">PAUSED</p>
        )}
      </div>

      {/* Touch Controls for Mobile */}
      <div className="flex justify-center items-center mt-4 md:hidden">
        <div className="grid grid-cols-3 gap-2">
          <div></div>
          <button
            className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer flex justify-center items-center"
            onClick={() => handleDirectionChange(Direction.Up)}
            disabled={gameOver}
          >
            <span className="text-xl font-bold">↑</span>
          </button>
          <div></div>
          <button
            className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer flex justify-center items-center"
            onClick={() => handleDirectionChange(Direction.Left)}
            disabled={gameOver}
          >
            <span className="text-xl font-bold">←</span>
          </button>
          <div></div>
          <button
            className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer flex justify-center items-center"
            onClick={() => handleDirectionChange(Direction.Right)}
            disabled={gameOver}
          >
            <span className="text-xl font-bold">→</span>
          </button>
          <div></div>
          <button
            className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer flex justify-center items-center"
            onClick={() => handleDirectionChange(Direction.Down)}
            disabled={gameOver}
          >
            <span className="text-xl font-bold">↓</span>
          </button>
          <div></div>
        </div>
      </div>

      {/* Game Controls Info */}
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Controls:</strong> Arrow keys to move, Space to pause</p>
      </div>

      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-lg font-bold text-red-600 mb-2">Game Over!</p>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={resetGame}
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
