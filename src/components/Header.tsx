// Header.tsx
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
const Header = () => {
  const location = useLocation();
  const [activePage, setActivePage] = useState(location.pathname);

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location]);

  return (
    <header>
      <div className="bg-red-500 text-white text-center p-4">
        <h1>Ross Lyons Pyons is the man</h1>
      </div>
      <nav className="flex justify-center p-4">
        <ul className="flex space-x-4">
          <li>
            <Link
              to="/"
              className={`text-lg ${
                activePage === "/" ? "text-red-500" : "text-gray-500"
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={`text-lg ${
                activePage === "/contact" ? "text-red-500" : "text-gray-500"
              }`}
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              to="/resources"
              className={`text-lg ${
                activePage === "/resources" ? "text-red-500" : "text-gray-500"
              }`}
            >
              Resources
            </Link>
          </li>
          <li>
            <Link
              to="/product"
              className={`text-lg ${
                activePage === "/product" ? "text-red-500" : "text-gray-500"
              }`}
            >
              Product
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
