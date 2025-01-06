import { Link } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark-primary flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8 bg-neutral rounded-lg shadow-2xl">
        <div className="flex justify-center mb-6">
          <AlertTriangle size={100} className="text-yellow-500 animate-pulse" />
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-200">
          404 - Page Not Found
        </h1>

        <p className="text-gray-400 mb-6">
          Oops! The page you're looking for seems to have taken an unexpected
          career break.
        </p>

        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className="flex items-center bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            <Home className="mr-2" size={20} />
            Back to Home
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            <RefreshCw className="mr-2" size={20} />
            Reload Page
          </button>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">
            Suggested Next Steps
          </h3>
          <ul className="space-y-2">
            <li className="text-gray-400 hover:text-blue-500 transition">
              <Link to="/network">Explore Connections</Link>
            </li>
            <li className="text-gray-400 hover:text-blue-500 transition">
              <Link to="/notifications">Check Notifications</Link>
            </li>
            <li className="text-gray-400 hover:text-blue-500 transition">
              <Link to="/profile">View Your Profile</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
