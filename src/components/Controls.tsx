const Controls = () => {
  const controlItems = [
    {
      icon: "⌨️",
      title: "Arrow Keys",
      description: "Move the snake up, down, left, or right"
    },
    {
      icon: "⏸️",
      title: "Spacebar",
      description: "Pause or resume the game"
    },
    {
      icon: "🔄",
      title: "Restart",
      description: "Click restart button to start a new game"
    },
    {
      icon: "📱",
      title: "Touch Controls",
      description: "Use on-screen buttons on mobile devices"
    }
  ];

  const gameRules = [
    {
      icon: "🍎",
      text: "Eat red food pellets to grow and increase your score"
    },
    {
      icon: "🚫",
      text: "Avoid running into walls or yourself"
    },
    {
      icon: "⚡",
      text: "Choose difficulty to change game speed"
    }
  ];

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🎮 Game Controls
        </h2>
      </div>

      {/* Controls Section */}
      <div className="p-6">
        <div className="space-y-4 mb-6">
          {controlItems.map((item, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Game Rules */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            📋 Game Rules
          </h3>
          <div className="space-y-3">
            {gameRules.map((rule, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <span className="text-lg">{rule.icon}</span>
                <span className="text-gray-700">{rule.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro Tip */}
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-red-600 text-lg">💡</span>
            <div>
              <h4 className="font-medium text-red-900">Pro Tip</h4>
              <p className="text-sm text-red-700 mt-1">
                Start with Easy difficulty to learn the controls, then challenge yourself with harder levels!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;
