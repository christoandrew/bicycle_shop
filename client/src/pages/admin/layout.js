import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Flowbite, Navbar } from "flowbite-react";
import { AppSideBar } from "@/components/admin/sidebar.tsx";
import { SidebarProvider } from "@/components/context/sidebar-context.tsx";
import { Outlet } from "react-router";
import classNames from "classnames";
export default function AdminPageLayout() {
  return _jsx(Flowbite, {
    children: _jsxs(SidebarProvider, {
      children: [
        _jsx(Navbar, {}),
        _jsxs("div", {
          className: "flex items-start",
          children: [
            _jsx("div", {
              className: "sticky top-14 h-full",
              children: _jsx(AppSideBar, {}),
            }),
            _jsx("main", {
              className: classNames(
                "overflow-y-auto relative w-full h-full bg-gray-50 dark:bg-gray-900",
              ),
              children: _jsx("div", {
                className: "",
                children: _jsx(Outlet, {}),
              }),
            }),
          ],
        }),
      ],
    }),
  });
}
