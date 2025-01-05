import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { HeroSection } from "@/components/layout/hero-section.tsx";
import { FeaturesSection } from "@/components/layout/feature-section.tsx";
import { PopularModelsSection } from "@/components/layout/popular-models-section.tsx";
import { TestimonialsSection } from "@/components/layout/testimonial-section.tsx";
export const HomePage = () => {
  return _jsxs("div", {
    className: "min-h-screen bg-white",
    children: [
      _jsx(HeroSection, {}),
      _jsx(FeaturesSection, {}),
      _jsx(PopularModelsSection, {}),
      _jsx(TestimonialsSection, {}),
    ],
  });
};
