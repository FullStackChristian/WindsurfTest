import { useState } from "react";
const RossFanButton = () => {
  const [showCircle, setShowCircle] = useState(false);

  const handleClick = () => {
    if (showCircle) {
      setShowCircle(false);
    } else {
      setShowCircle(true);
    }
  };

  return (
    <div>
      {!showCircle && (
        <button
          className="absolute top-1/2 left-1/2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md"
          onClick={handleClick}
        >
          Click Me
        </button>
      )}
      {showCircle && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          onClick={handleClick}
        >
          <div className="w-48 h-48 bg-red-500 rounded-full relative">
            <p className="text-black text-2xl font-bold absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              Ross is mine, get lost Johanna
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RossFanButton;
