import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Direction,
  Difficulty,
  BOARD_SIZE,
  INITIAL_SNAKE_POSITION,
  DIFFICULTY_SPEEDS,
  KEY_DIRECTION_MAP,
  OPPOSITE_DIRECTIONS,
} from '../constants/gameConstants';

// Types
export interface Position {
  x: number;
  y: number;
}

export type SnakeSegment = Position;
export type Food = Position;

// Utility functions
const generateRandomFood = (snake: SnakeSegment[]): Food => {
  let newFood: Food;
  do {
    newFood = {
      x: Math.floor(Math.random() * BOARD_SIZE),
      y: Math.floor(Math.random() * BOARD_SIZE),
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  return newFood;
};

const isOutOfBounds = (position: Position): boolean => {
  return position.x < 0 || position.x >= BOARD_SIZE || position.y < 0 || position.y >= BOARD_SIZE;
};

const isCollisionWithSelf = (head: Position, snake: SnakeSegment[]): boolean => {
  // Check collision with body (exclude the head itself)
  return snake.slice(0, -1).some(segment => segment.x === head.x && segment.y === head.y);
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

export const useSnakeGame = (onGameEnd?: (score: number) => void) => {
  const [snake, setSnake] = useState<SnakeSegment[]>([...INITIAL_SNAKE_POSITION]);
  const [food, setFood] = useState<Food>(() => generateRandomFood(INITIAL_SNAKE_POSITION));
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Medium);
  const [direction, setDirection] = useState<Direction>(Direction.Right);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const gameLoopRef = useRef<number | null>(null);
  const currentScoreRef = useRef(0);

  // Update score ref when score changes
  useEffect(() => {
    currentScoreRef.current = score;
  }, [score]);

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = newSnake[newSnake.length - 1];
      const newHead = getNextHeadPosition(head, direction);

      // Check for collisions before moving
      if (isOutOfBounds(newHead) || isCollisionWithSelf(newHead, currentSnake)) {
        setGameOver(true);
        if (onGameEnd) {
          onGameEnd(currentScoreRef.current);
        }
        return currentSnake;
      }

      newSnake.push(newHead);

      // Check for food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prevScore => prevScore + 1);
        setFood(generateRandomFood(newSnake));
      } else {
        newSnake.shift();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, onGameEnd]);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = setInterval(moveSnake, DIFFICULTY_SPEEDS[difficulty]);
    
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [moveSnake, difficulty, gameOver, isPaused]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (gameOver) return;

    // Check both event.key and event.code for maximum compatibility
    const newDirection = KEY_DIRECTION_MAP[event.key] || KEY_DIRECTION_MAP[event.code];
    if (newDirection !== undefined && direction !== OPPOSITE_DIRECTIONS[newDirection]) {
      setDirection(newDirection);
    }

    // Pause/unpause with spacebar
    if (event.key === ' ') {
      event.preventDefault();
      setIsPaused(prev => !prev);
    }
  }, [direction, gameOver]);

  const handleDirectionChange = useCallback((newDirection: Direction) => {
    if (gameOver || direction === OPPOSITE_DIRECTIONS[newDirection]) return;
    setDirection(newDirection);
  }, [direction, gameOver]);

  const resetGame = useCallback(() => {
    const initialSnake = [...INITIAL_SNAKE_POSITION];
    setSnake(initialSnake);
    setFood(generateRandomFood(initialSnake));
    setDirection(Direction.Right);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    currentScoreRef.current = 0;
  }, []);

  const togglePause = useCallback(() => {
    if (!gameOver) {
      setIsPaused(prev => !prev);
    }
  }, [gameOver]);

  // Keyboard event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    snake,
    food,
    difficulty,
    direction,
    score,
    gameOver,
    isPaused,
    setDifficulty,
    handleDirectionChange,
    resetGame,
    togglePause,
  };
};
