// Game constants
export const BOARD_SIZE = 20;
export const MAX_LEADERBOARD_ENTRIES = 25;

// Initial game state
export const INITIAL_SNAKE_POSITION = [
  { x: 10, y: 10 },
  { x: 11, y: 10 },
  { x: 12, y: 10 },
];

// Game directions
export enum Direction {
  Right,
  Left,
  Up,
  Down,
}

// Game difficulty levels
export enum Difficulty {
  Easy,
  Medium,
  Hard,
}

// Speed settings for each difficulty (in milliseconds)
export const DIFFICULTY_SPEEDS = {
  [Difficulty.Easy]: 150,
  [Difficulty.Medium]: 100,
  [Difficulty.Hard]: 50,
} as const;

// Keyboard controls mapping
export const KEY_DIRECTION_MAP: Record<string, Direction> = {
  'ArrowRight': Direction.Right,
  'ArrowLeft': Direction.Left,
  'ArrowUp': Direction.Up,
  'ArrowDown': Direction.Down,
};

// Opposite directions for preventing reverse movement
export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  [Direction.Right]: Direction.Left,
  [Direction.Left]: Direction.Right,
  [Direction.Up]: Direction.Down,
  [Direction.Down]: Direction.Up,
};

// Local storage keys
export const STORAGE_KEYS = {
  LEADERBOARD: 'snakeGameLeaderboard',
} as const;
