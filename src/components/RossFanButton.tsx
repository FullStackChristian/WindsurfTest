import { useState } from "react";

const RossFanButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Simplified state toggle
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="relative">
        {!isExpanded ? (
          <button
            onClick={toggleExpanded}
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Discover Something Special
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        ) : (
          <div
            onClick={toggleExpanded}
            className="cursor-pointer group"
          >
            <div className="relative w-80 h-80 bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 flex items-center justify-center">
              {/* Animated rings */}
              <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-pulse" />
              <div className="absolute inset-4 rounded-full border-2 border-white/20 animate-ping" />
              
              {/* Content */}
              <div className="text-center z-10 p-8">
                <div className="text-white text-3xl font-bold mb-4 drop-shadow-lg">
                  💖 Ross Fan Zone 💖
                </div>
                <p className="text-white text-lg font-semibold drop-shadow-md leading-relaxed">
                  "Ross is mine,<br />get lost Johanna"
                </p>
                <div className="mt-4 text-white/80 text-sm">
                  Click to close
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 text-white/60 animate-bounce">✨</div>
              <div className="absolute bottom-4 left-4 text-white/60 animate-bounce delay-300">💫</div>
              <div className="absolute top-1/3 left-4 text-white/40 animate-pulse delay-500">❤️</div>
              <div className="absolute bottom-1/3 right-4 text-white/40 animate-pulse delay-700">💕</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RossFanButton;
