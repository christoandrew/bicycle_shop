import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Alert } from "flowbite-react";
export const SuccessAlert = ({ message }) => {
  return _jsx(Alert, {
    color: "success",
    className: "mb-3 mt-3",
    onDismiss: () => {},
    children: _jsxs("div", {
      className: "flex-1",
      children: [
        _jsx("span", {
          className: "text-green-700 dark:text-green-400",
          children: "Success!",
        }),
        " ",
        message,
      ],
    }),
  });
};
export const ErrorAlert = ({ message }) => {
  return _jsx(Alert, {
    color: "danger",
    className: "mb-3 mt-3",
    onDismiss: () => {},
    children: _jsxs("div", {
      className: "flex-1",
      children: [
        _jsx("span", {
          className: "text-red-700 dark:text-red-400",
          children: "Error!",
        }),
        " ",
        message,
      ],
    }),
  });
};
