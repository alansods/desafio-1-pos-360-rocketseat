import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
      <h1 className="text-xl font-bold text-gray-600">404</h1>
      <p className="text-sm text-gray-400">Page not found</p>
      <Link to="/" className="btn-primary btn-size-default">
        Go Home
      </Link>
    </div>
  );
}
