const Controls = () => {
  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Game Controls</h2>
      <ul>
        <li>
          <span className="font-bold">Arrow Keys:</span> Move the snake up,
          down, left, or right.
        </li>
        <li>
          <span className="font-bold">Restart Game:</span> Click the "Restart
          Game" button to start a new game.
        </li>
      </ul>
      <p>
        Eat the red food pellets to grow your snake and increase your score.
        Avoid running into the walls or yourself to survive.
      </p>
    </div>
  );
};

export default Controls;
