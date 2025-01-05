import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GET_PRODUCT_TYPES } from "@/graphql/queries.ts";
import { useQuery } from "@apollo/client";
import { Button, Navbar } from "flowbite-react";
import { Link } from "react-router";
export default function Header() {
  const { loading, error, data } = useQuery(GET_PRODUCT_TYPES);
  if (loading) return _jsx("p", { children: "Loading..." });
  if (error) return _jsx("p", { children: "Error :(" });
  return _jsx("header", {
    className: "sticky top-0 z-50",
    children: _jsxs(Navbar, {
      fluid: true,
      children: [
        _jsx(Navbar.Brand, {
          href: "/",
          children: _jsx("span", {
            className:
              "self-center whitespace-nowrap text-xl font-semibold dark:text-white",
            children: "Marcus's Shop",
          }),
        }),
        _jsx(Navbar.Collapse, {
          theme: {
            list: "mt-4 flex flex-col lg:mt-0 lg:flex-row lg:space-x-8 lg:text-base lg:font-medium",
          },
          className: "lg:order-1",
          children: data.productTypes.map((productType) =>
            _jsx(
              Navbar.Link,
              {
                href: `/products/${productType.name.toLowerCase()}`,
                children: productType.name,
              },
              productType.id,
            ),
          ),
        }),
        _jsxs("div", {
          className: "flex items-center gap-3 lg:order-2",
          children: [
            _jsx(Button, {
              color: "info",
              children: _jsx(Link, { to: `/admin`, children: "Admin" }),
            }),
            _jsx(Navbar.Toggle, { theme: { icon: "h-5 w-5 shrink-0" } }),
          ],
        }),
      ],
    }),
  });
}
