import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router";
import Header from "@/components/layout/header.tsx";
export const Layout = () => {
  return _jsx("div", {
    className: "bg-gray-50",
    children: _jsx("div", {
      className: "flex flex-1 flex-col",
      children: _jsxs("div", {
        children: [
          _jsx(Header, {}),
          _jsx("div", { children: _jsx(Outlet, {}) }),
        ],
      }),
    }),
  });
};
