import { jsx as _jsx } from "react/jsx-runtime";
// Router setup component
import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";
import { ProductTypePage } from "@/pages/product-type-page.tsx";
import { HomePage } from "@/pages/home-page.tsx";
import { ConfigurePage } from "@/pages/configuration-page.tsx";
import { Layout } from "@/pages/layout.tsx";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_TYPES } from "@/graphql/queries.ts";
import { ErrorBoundary } from "@/pages/error-boundary.tsx";
import AdminPageLayout from "@/pages/admin/layout.tsx";
import { OrdersPage } from "@/pages/admin/orders.tsx";
import { ProductsPage } from "@/pages/admin/products.tsx";
import { ProductDetails } from "@/pages/admin/product-details.tsx";
import { ProductTypes } from "@/pages/admin/product-types.tsx";
import { PartOptions } from "@/pages/admin/part-options.tsx";
import { PartCategories } from "@/pages/admin/part-categories.tsx";
import { PriceRules } from "@/pages/admin/price-rules.tsx";
const AppRouter = () => {
  const { loading, error, data } = useQuery(GET_PRODUCT_TYPES);
  if (loading) {
    return _jsx("div", { children: "Loading..." });
  }
  if (error) {
    console.error("Error loading product types:", error);
    return _jsx("div", { children: "Error loading application" });
  }
  const router = createBrowserRouter([
    {
      path: "/",
      element: _jsx(Layout, {}),
      errorElement: _jsx(ErrorBoundary, {}),
      children: [
        {
          path: "/",
          element: _jsx(HomePage, {}),
          index: true,
        },
        ...(data?.productTypes?.map(() => ({
          path: `/products/:productType`,
          element: _jsx(ProductTypePage, {}),
        })) || []),
        {
          path: "/configure",
          element: _jsx(ConfigurePage, {}),
        },
        {
          path: "/admin",
          element: _jsx(AdminPageLayout, {}),
          children: [
            {
              path: "/admin",
              element: _jsx(OrdersPage, {}),
            },
            {
              path: "/admin/orders",
              element: _jsx(OrdersPage, {}),
            },
            {
              path: "/admin/products",
              element: _jsx(ProductsPage, {}),
            },
            {
              path: "/admin/products/:productId",
              element: _jsx(ProductDetails, {}),
            },
            {
              path: "/admin/product-types/:productTypeId",
              element: _jsx(ProductDetails, {}),
            },
            {
              path: "/admin/product-types",
              element: _jsx(ProductTypes, {}),
            },
            {
              path: "/admin/part-options",
              element: _jsx(PartOptions, {}),
            },
            {
              path: "/admin/part_categories",
              element: _jsx(PartCategories, {}),
            },
            {
              path: "/admin/price-rules",
              element: _jsx(PriceRules, {}),
            },
          ],
        },
        {
          path: "*",
          element: _jsx(ErrorBoundary, {}),
        },
      ],
    },
  ]);
  return _jsx(RouterProvider, { router: router });
};
export default AppRouter;
