import React, { useState, useEffect, useCallback } from "react";

// Enums
enum Direction {
  Right,
  Left,
  Up,
  Down,
}

enum Difficulty {
  Easy,
  Medium,
  Hard,
}

// Types
interface Position {
  x: number;
  y: number;
}

type SnakeSegment = Position;
type Food = Position;

// Constants
const BOARD_SIZE = 20;
const INITIAL_SNAKE_POSITION: SnakeSegment[] = [
  { x: 10, y: 10 },
  { x: 11, y: 10 },
  { x: 12, y: 10 },
];

const DIFFICULTY_SPEEDS = {
  [Difficulty.Easy]: 150,
  [Difficulty.Medium]: 100,
  [Difficulty.Hard]: 50,
} as const;

interface SnakeGameProps {
  onGameEnd?: (score: number) => void;
}

// Utility functions
const generateRandomFood = (): Food => ({
  x: Math.floor(Math.random() * BOARD_SIZE),
  y: Math.floor(Math.random() * BOARD_SIZE),
});

const isOutOfBounds = (position: Position): boolean => {
  return position.x < 0 || position.x >= BOARD_SIZE || position.y < 0 || position.y >= BOARD_SIZE;
};

const isCollisionWithSelf = (head: Position, snake: SnakeSegment[]): boolean => {
  return snake.some((segment, index) => 
    index < snake.length - 1 && segment.x === head.x && segment.y === head.y
  );
};

const getNextHeadPosition = (head: Position, direction: Direction): Position => {
  switch (direction) {
    case Direction.Right:
      return { x: head.x + 1, y: head.y };
    case Direction.Left:
      return { x: head.x - 1, y: head.y };
    case Direction.Up:
      return { x: head.x, y: head.y - 1 };
    case Direction.Down:
      return { x: head.x, y: head.y + 1 };
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
};

const SnakeGame: React.FC<SnakeGameProps> = ({ onGameEnd }) => {
  const [snake, setSnake] = useState<SnakeSegment[]>(INITIAL_SNAKE_POSITION);
  const [food, setFood] = useState<Food>(generateRandomFood);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [speed, setSpeed] = useState<number>(DIFFICULTY_SPEEDS[Difficulty.Medium]);
  const [direction, setDirection] = useState<Direction>(Direction.Right);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const showTouchOverlay = true;
  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    if (x < window.innerWidth / 2) {
      if (direction !== Direction.Right) {
        setDirection(Direction.Left);
      }
    } else {
      if (direction !== Direction.Left) {
        setDirection(Direction.Right);
      }
    }

    if (y < window.innerHeight / 2) {
      if (direction !== Direction.Down) {
        setDirection(Direction.Up);
      }
    } else {
      if (direction !== Direction.Up) {
        setDirection(Direction.Down);
      }
    }
  }, [direction]);

  useEffect(() => {
    setSpeed(DIFFICULTY_SPEEDS[difficulty]);
  }, [difficulty]);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = newSnake[newSnake.length - 1];
      const newHead = getNextHeadPosition(head, direction);

      newSnake.push(newHead);

      // Check for food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(currentScore => currentScore + 1);
        setFood(generateRandomFood());
      } else {
        newSnake.shift();
      }

      // Check for collisions
      if (isOutOfBounds(newHead) || isCollisionWithSelf(newHead, currentSnake)) {
        setGameOver(true);
        if (onGameEnd) {
          // Use the current score from the closure
          setScore(currentScore => {
            onGameEnd(currentScore + (newHead.x === food.x && newHead.y === food.y ? 1 : 0));
            return currentScore + (newHead.x === food.x && newHead.y === food.y ? 1 : 0);
          });
        }
      }

      return newSnake;
    });
  }, [direction, food, gameOver, onGameEnd]);

  useEffect(() => {
    const intervalId = setInterval(moveSnake, speed);
    return () => clearInterval(intervalId);
  }, [moveSnake, speed]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const keyDirectionMap: Record<string, Direction> = {
      'ArrowRight': Direction.Right,
      'ArrowLeft': Direction.Left,
      'ArrowUp': Direction.Up,
      'ArrowDown': Direction.Down,
    };

    const oppositeDirections: Record<Direction, Direction> = {
      [Direction.Right]: Direction.Left,
      [Direction.Left]: Direction.Right,
      [Direction.Up]: Direction.Down,
      [Direction.Down]: Direction.Up,
    };

    const newDirection = keyDirectionMap[event.key];
    if (newDirection !== undefined && direction !== oppositeDirections[newDirection]) {
      setDirection(newDirection);
    }
  }, [direction]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("touchstart", handleTouchStart);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, [direction]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Snake Game</h2>
      <div className="flex pb-4 gap-2">
        Set Difficulty:
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setDifficulty(Difficulty.Easy);
          }}
        >
          For Ross
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setDifficulty(Difficulty.Medium);
          }}
        >
          Medium
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setDifficulty(Difficulty.Hard);
          }}
        >
          Hard
        </button>
      </div>
      <div className="grid grid-cols-20 grid-rows-20 gap-1">
        {Array.from({ length: BOARD_SIZE }, (_, row) => (
          <React.Fragment key={row}>
            {Array.from({ length: BOARD_SIZE }, (_, col) => (
              <div
                key={col}
                className={`w-4 h-4 ${
                  snake.some(
                    (segment) => segment.x === col && segment.y === row
                  )
                    ? "bg-green-500"
                    : food.x === col && food.y === row
                    ? "bg-red-500"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
      <p className="text-lg font-bold mt-4">Score: {score}</p>
      {showTouchOverlay && (
        <div className="flex justify-between items-center mt-4 md:hidden">
          <div
            className="w-8 h-8 bg-white/50 rounded-full cursor-pointer flex justify-center items-center"
            onClick={() => setDirection(Direction.Left)}
          >
            <span className="text-lg font-bold">&larr;</span>
          </div>
          <div
            className="w-8 h-8 bg-white/50 rounded-full cursor-pointer flex justify-center items-center"
            onClick={() => setDirection(Direction.Up)}
          >
            <span className="text-lg font-bold">&uarr;</span>
          </div>
          <div
            className="w-8 h-8 bg-white/50 rounded-full cursor-pointer flex justify-center items-center"
            onClick={() => setDirection(Direction.Down)}
          >
            <span className="text-lg font-bold">&darr;</span>
          </div>
          <div
            className="w-8 h-8 bg-white/50 rounded-full cursor-pointer flex justify-center items-center"
            onClick={() => setDirection(Direction.Right)}
          >
            <span className="text-lg font-bold">&rarr;</span>
          </div>
        </div>
      )}
      {gameOver && (
        <div>
          <p className="text-lg font-bold mt-4">Game Over!</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setSnake(INITIAL_SNAKE_POSITION);
              setFood(generateRandomFood());
              setDirection(Direction.Right);
              setScore(0);
              setGameOver(false);
            }}
          >
            Restart Game
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;
