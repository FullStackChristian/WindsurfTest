import React from "react";

const Resources = () => {
  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center">
          <i className="fab fa-react mr-2"></i>
          <span>React</span>
        </div>
        <div className="flex items-center">
          <i className="fab fa-typescript mr-2"></i>
          <span>TypeScript</span>
        </div>
        <div className="flex items-center">
          <i className="fas fa-palette mr-2"></i>
          <span>Tailwind CSS</span>
        </div>
        <div className="flex items-center">
          <i className="fab fa-js mr-2"></i>
          <span>JavaScript</span>
        </div>
        <div className="flex items-center">
          <i className="fab fa-html5 mr-2"></i>
          <span>HTML5</span>
        </div>
        <div className="flex items-center">
          <i className="fab fa-css3 mr-2"></i>
          <span>CSS3</span>
        </div>
        <div className="flex items-center">
          <i className="fas fa-robot mr-2"></i>
          <span>Codeium</span>
        </div>
      </div>
    </div>
  );
};

export default Resources;
