// Router setup component
import { RouterProvider } from "react-router/dom";
import { createBrowserRouter } from "react-router";
import { ProductTypePage } from "@/pages/product-type-page.tsx";
import { HomePage } from "@/pages/home-page.tsx";
import { ConfigurePage } from "@/pages/configuration-page.tsx";
import { Layout } from "@/pages/layout.tsx";
import { ErrorBoundary } from "@/pages/error-boundary.tsx";
import AdminPageLayout from "@/pages/admin/layout.tsx";
import { OrdersPage } from "@/pages/admin/orders.tsx";
import { ProductsPage } from "@/pages/admin/products.tsx";
import { ProductDetailsPage } from "@/pages/admin/product-details.tsx";
import { ProductTypes } from "@/pages/admin/product-types.tsx";
import { PartOptions } from "@/pages/admin/part-options.tsx";
import { PartCategories } from "@/pages/admin/part-categories.tsx";
import { PriceRules } from "@/pages/admin/price-rules.tsx";
import { CompatibilityRules } from "@/pages/admin/compatibility-rules.tsx";
import { useEffect } from "react";
import { ensureSessionId } from "@/lib/utils.ts";
import { CartPage } from "@/pages/cart.tsx";

const AppRouter = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: "/",
          element: <HomePage />,
          index: true,
        },
        {
          path: "/products/:productType",
          element: <ProductTypePage />,
        },
        {
          path: "/configure",
          element: <ConfigurePage />,
        },
        {
          path: "/cart",
          element: <CartPage />,
        },
        {
          path: "/admin",
          element: <AdminPageLayout />,
          children: [
            {
              path: "/admin",
              element: <OrdersPage />,
            },
            {
              path: "/admin/orders",
              element: <OrdersPage />,
            },
            {
              path: "/admin/products",
              element: <ProductsPage />,
            },
            {
              path: "/admin/products/:id",
              element: <ProductDetailsPage />,
            },
            {
              path: "/admin/product-types/:productTypeId",
              element: <ProductDetailsPage />,
            },
            {
              path: "/admin/product-types",
              element: <ProductTypes />,
            },
            {
              path: "/admin/part-options",
              element: <PartOptions />,
            },
            {
              path: "/admin/part-categories",
              element: <PartCategories />,
            },
            {
              path: "/admin/price-rules",
              element: <PriceRules />,
            },
            {
              path: "/admin/compatibility-rules",
              element: <CompatibilityRules />,
            },
          ],
        },
        {
          path: "*",
          element: <ErrorBoundary />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

const App = () => {
  useEffect(() => {
    ensureSessionId();
  }, []);
  return <AppRouter />;
};

export default App;
