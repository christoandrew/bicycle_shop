import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// Error boundary component
import { isRouteErrorResponse, useRouteError } from "react-router";
export const ErrorBoundary = () => {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return _jsx("div", {
        className: "min-h-screen flex items-center justify-center",
        children: _jsxs("div", {
          className: "text-center",
          children: [
            _jsx("h1", {
              className: "text-4xl font-bold text-gray-900 mb-4",
              children: "Page Not Found",
            }),
            _jsx("p", {
              className: "text-gray-600 mb-8",
              children: "The page you're looking for doesn't exist.",
            }),
            _jsx("a", {
              href: "/",
              className: "text-teal-600 hover:text-teal-700",
              children: "Go back home",
            }),
          ],
        }),
      });
    }
  }
  return _jsx("div", {
    className: "min-h-screen flex items-center justify-center",
    children: _jsxs("div", {
      className: "text-center",
      children: [
        _jsx("h1", {
          className: "text-4xl font-bold text-gray-900 mb-4",
          children: "Oops!",
        }),
        _jsx("p", {
          className: "text-gray-600 mb-8",
          children: "Something went wrong.",
        }),
        _jsx("a", {
          href: "/",
          className: "text-teal-600 hover:text-teal-700",
          children: "Go back home",
        }),
      ],
    }),
  });
};
