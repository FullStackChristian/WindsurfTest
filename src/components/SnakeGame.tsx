import React, { useState, useEffect } from "react";

interface SnakeSegment {
  x: number;
  y: number;
}

interface Food {
  x: number;
  y: number;
}

enum Direction {
  Right,
  Left,
  Up,
  Down,
}

const SnakeGame = () => {
  const [snake, setSnake] = useState<SnakeSegment[]>([
    { x: 10, y: 10 },
    { x: 11, y: 10 },
    { x: 12, y: 10 },
  ]);
  const [food, setFood] = useState<Food>({
    x: Math.floor(Math.random() * 20),
    y: Math.floor(Math.random() * 20),
  });
  const [direction, setDirection] = useState<Direction>(Direction.Right);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!gameOver) {
        const newSnake: SnakeSegment[] = [...snake];
        const head: SnakeSegment = newSnake[newSnake.length - 1];
        let newHead: SnakeSegment;

        switch (direction) {
          case Direction.Right:
            newHead = { x: head.x + 1, y: head.y };
            break;
          case Direction.Left:
            newHead = { x: head.x - 1, y: head.y };
            break;
          case Direction.Up:
            newHead = { x: head.x, y: head.y - 1 };
            break;
          case Direction.Down:
            newHead = { x: head.x, y: head.y + 1 };
            break;
          default:
            throw new Error(`Invalid direction: ${direction}`);
        }

        newSnake.push(newHead);

        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(score + 1);
          setFood({
            x: Math.floor(Math.random() * 20),
            y: Math.floor(Math.random() * 20),
          });
        } else {
          newSnake.shift();
        }

        if (
          newHead.x < 0 ||
          newHead.x >= 20 ||
          newHead.y < 0 ||
          newHead.y >= 20 ||
          snake.some(
            (segment, index) =>
              index < snake.length - 1 &&
              segment.x === newHead.x &&
              segment.y === newHead.y
          )
        ) {
          setGameOver(true);
        }

        setSnake(newSnake);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [snake, food, direction, gameOver, score]);

  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowRight":
        if (direction !== Direction.Left) {
          setDirection(Direction.Right);
        }
        break;
      case "ArrowLeft":
        if (direction !== Direction.Right) {
          setDirection(Direction.Left);
        }
        break;
      case "ArrowUp":
        if (direction !== Direction.Down) {
          setDirection(Direction.Up);
        }
        break;
      case "ArrowDown":
        if (direction !== Direction.Up) {
          setDirection(Direction.Down);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Snake Game</h2>
      <div className="grid grid-cols-20 grid-rows-20 gap-1">
        {Array.from({ length: 20 }, (_, row) => (
          <React.Fragment key={row}>
            {Array.from({ length: 20 }, (_, col) => (
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
      {gameOver && (
        <div>
          <p className="text-lg font-bold mt-4">Game Over!</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setSnake([
                { x: 10, y: 10 },
                { x: 11, y: 10 },
                { x: 12, y: 10 },
              ]);
              setFood({
                x: Math.floor(Math.random() * 20),
                y: Math.floor(Math.random() * 20),
              });
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
