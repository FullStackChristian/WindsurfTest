import { useLocation, Link } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/contact", label: "Contact" },
    { path: "/resources", label: "Resources" },
    { path: "/product", label: "Snake Game" },
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 text-white">
        <div className="container mx-auto px-4 py-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            ❤️ Ross Lyons Pyons Fan Club ❤️
          </h1>
          <p className="mt-2 text-red-100 text-sm md:text-base">
            The ultimate destination for Ross appreciation - powered by love
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-4">
        <ul className="flex justify-center space-x-1 md:space-x-2 py-4">
          {navItems.map(({ path, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  location.pathname === path
                    ? "bg-red-600 text-white shadow-md"
                    : "text-gray-600 hover:text-red-600 hover:bg-red-50"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
