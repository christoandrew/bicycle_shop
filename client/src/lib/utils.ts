import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(str: string | undefined) {
  if (!str) return "";
  return str.replace(
    /\w\S*/g,
    (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase(),
  );
}

export const ensureSessionId = async () => {
  const sessionId = localStorage.getItem("session_id");
  console.log(sessionId);
  if (!sessionId) {
    // Make an initial request to trigger session creation
    const response = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: "" }), // Dummy query
    });
    const newSessionId = response.headers.get("X-Session-Id");
    if (newSessionId) {
      localStorage.setItem("session_id", newSessionId);
    }
  }
};
