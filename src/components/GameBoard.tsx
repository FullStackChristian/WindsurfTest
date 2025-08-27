import React from 'react';
import { BOARD_SIZE } from '../constants/gameConstants';
import type { SnakeSegment, Food } from '../hooks/useSnakeGame';

interface GameBoardProps {
  snake: SnakeSegment[];
  food: Food;
}

const GameCell = React.memo<{ isSnake: boolean; isFood: boolean; isHead: boolean }>(
  ({ isSnake, isFood, isHead }) => (
    <div
      className={`w-4 h-4 ${
        isSnake
          ? isHead
            ? "bg-green-600 border border-green-800"
            : "bg-green-500"
          : isFood
          ? "bg-red-500 rounded-full"
          : "bg-gray-200"
      }`}
    />
  )
);

GameCell.displayName = 'GameCell';

const GameBoard = React.memo<GameBoardProps>(({ snake, food }) => {
  const snakeHead = snake[snake.length - 1];
  
  return (
    <div className="grid grid-cols-20 grid-rows-20 gap-1 border-2 border-gray-400 p-2 bg-gray-100">
      {Array.from({ length: BOARD_SIZE }, (_, row) =>
        Array.from({ length: BOARD_SIZE }, (_, col) => {
          const isSnake = snake.some(segment => segment.x === col && segment.y === row);
          const isFood = food.x === col && food.y === row;
          const isHead = snakeHead?.x === col && snakeHead?.y === row;
          
          return (
            <GameCell
              key={`${row}-${col}`}
              isSnake={isSnake}
              isFood={isFood}
              isHead={isHead}
            />
          );
        })
      )}
    </div>
  );
});

GameBoard.displayName = 'GameBoard';

export default GameBoard;
