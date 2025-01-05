// Error boundary component
import { isRouteErrorResponse, useRouteError } from "react-router";

export const ErrorBoundary = () => {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Page Not Found
            </h1>
            <p className="text-gray-600 mb-8">
              The page you're looking for doesn't exist.
            </p>
            <a href="/" className="text-teal-600 hover:text-teal-700">
              Go back home
            </a>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Oops!</h1>
        <p className="text-gray-600 mb-8">Something went wrong.</p>
        <a href="/" className="text-teal-600 hover:text-teal-700">
          Go back home
        </a>
      </div>
    </div>
  );
};
