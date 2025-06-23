import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Gigster
      </Link>
      <div className="space-x-4">
        <Link
          to="/login"
          className="text-gray-700 hover:text-blue-600 font-medium"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
