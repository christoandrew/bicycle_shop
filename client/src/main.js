import { jsx as _jsx } from "react/jsx-runtime";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ApolloProvider } from "@apollo/client";
import { client } from "@/graphql/client.ts";
import AppRouter from "@/router.tsx";
createRoot(document.getElementById("root")).render(
  _jsx(StrictMode, {
    children: _jsx(ApolloProvider, {
      client: client(),
      children: _jsx(AppRouter, {}),
    }),
  }),
);
