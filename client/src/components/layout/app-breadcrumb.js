import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
export const AppBreadcrumb = () =>
  _jsx("div", {
    className: "max-w-7xl mx-auto sm:px-6 lg:px-8 pt-3",
    children: _jsx(Breadcrumb, {
      children: _jsxs(BreadcrumbList, {
        children: [
          _jsx(BreadcrumbItem, {
            children: _jsx(BreadcrumbLink, { href: "/", children: "Home" }),
          }),
          _jsx(BreadcrumbSeparator, {}),
          _jsx(BreadcrumbItem, {
            children: _jsx(BreadcrumbLink, {
              href: "/components",
              children: "Components",
            }),
          }),
          _jsx(BreadcrumbSeparator, {}),
          _jsx(BreadcrumbItem, {
            children: _jsx(BreadcrumbPage, { children: "Breadcrumb" }),
          }),
        ],
      }),
    }),
  });
