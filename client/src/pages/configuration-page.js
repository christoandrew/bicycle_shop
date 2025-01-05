import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useSearchParams } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { AlertCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import {
  useGetPartCategoriesByProductTypeQuery,
  useGetProductQuery,
} from "@/graphql/generated/graphql.ts";
export const ConfigurePage = () => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [total, setTotal] = useState(0);
  const [searchParams] = useSearchParams();
  const productId = parseInt(searchParams.get("product_id"));
  const {
    loading: productLoading,
    error: productError,
    data: productData,
  } = useGetProductQuery({
    variables: {
      id: productId,
    },
  });
  const {
    data: partCategoriesData,
    loading: partCategoriesLoading,
    error: partCategoriesError,
  } = useGetPartCategoriesByProductTypeQuery({
    variables: {
      productType: productData?.product.productType.code,
    },
  });
  if (productLoading || partCategoriesLoading) {
    return _jsx("div", { children: "Loading..." });
  }
  if (productError || partCategoriesError) {
    console.error(
      "Error loading products:",
      productError || partCategoriesError,
    );
    return _jsx("div", { children: "Error loading products" });
  }
  const product = productData?.product;
  const partCategories = partCategoriesData?.partCategoriesByProductType;
  const handleOptionSelect = ({ categoryId, optionId }) => {
    const newSelections = {
      ...selectedOptions,
      [categoryId]: optionId,
    };
    setSelectedOptions(newSelections);
    setTotal(calculateTotal(newSelections));
  };
  const getSelectedOptionName = (categoryId) => {
    const optionId = selectedOptions[categoryId];
    if (!optionId) return null;
    const category = partCategories.find((c) => c.id === categoryId);
    const option = category.partOptions.find((o) => o.id === optionId);
    return option ? option.name : null;
  };
  const calculateTotal = (selections) => {
    let newTotal = product.basePrice;
    Object.entries(selections).forEach(([categoryId, optionId]) => {
      const category = partCategories.find(
        (c) => c.id === parseInt(categoryId),
      );
      const option = category.partOptions.find((o) => o.id === optionId);
      if (option) {
        newTotal += option.basePrice;
      }
    });
    return newTotal;
  };
  const canAddToCart = () => {
    return true;
    // return prod.categories
    //     .filter(category => category.required)
    //     .every(category => selectedOptions[category.id]);
  };
  return _jsxs("div", {
    className: "bg-gray-50",
    children: [
      _jsx("div", {
        className: "h-1/5 bg-gradient-to-r from-cyan-500 to-blue-500",
        children: _jsx("div", {
          className: "max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8",
          children: _jsx("h1", {
            className: "mt-3 text-3xl font-bold text-white",
            children: "Configure",
          }),
        }),
      }),
      _jsxs("div", {
        className: "max-w-6xl mx-auto px-4 mt-3",
        children: [
          _jsxs(Card, {
            className: "mb-6",
            children: [
              _jsx(CardHeader, {
                children: _jsx(CardTitle, {
                  className: "text-2xl font-bold",
                  children: product.name,
                }),
              }),
              _jsx(CardContent, {
                children: _jsx("p", { className: "text-gray-600" }),
              }),
            ],
          }),
          _jsxs("div", {
            className: "grid grid-cols-1 lg:grid-cols-3 gap-4",
            children: [
              _jsx("div", {
                className: "lg:col-span-2",
                children: partCategories.map((category) =>
                  _jsxs(
                    Card,
                    {
                      className: "mb-6",
                      children: [
                        _jsx(CardHeader, {
                          children: _jsxs("div", {
                            className: "flex items-center justify-between",
                            children: [
                              _jsxs(CardTitle, {
                                className: "text-lg",
                                children: [
                                  category.name,
                                  _jsx("span", {
                                    className: "text-sm text-red-500 ml-2",
                                    children: "Required",
                                  }),
                                ],
                              }),
                              getSelectedOptionName(category.id) &&
                                _jsxs("span", {
                                  className: "text-sm text-gray-600",
                                  children: [
                                    "Selected: ",
                                    getSelectedOptionName(category.id),
                                  ],
                                }),
                            ],
                          }),
                        }),
                        _jsx(CardContent, {
                          children: _jsx("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: category.partOptions.map((option) =>
                              _jsx(
                                "button",
                                {
                                  onClick: () =>
                                    handleOptionSelect({
                                      categoryId: category.id,
                                      optionId: option.id,
                                    }),
                                  disabled: !option.inStock,
                                  className: `p-4 rounded-lg border transition-all
                                                      ${
                                                        selectedOptions[
                                                          category.id
                                                        ] === Number(option.id)
                                                          ? "border-blue-500 bg-blue-50"
                                                          : "border-gray-200 hover:border-gray-300"
                                                      }
                                                      ${!option.inStock ? "opacity-50 cursor-not-allowed" : "hover:shadow-md"}
                                                    `,
                                  children: _jsxs("div", {
                                    className:
                                      "flex justify-between items-start",
                                    children: [
                                      _jsxs("div", {
                                        children: [
                                          _jsx("h3", {
                                            className: "font-medium",
                                            children: option.name,
                                          }),
                                          _jsxs("p", {
                                            className: "text-sm text-gray-600",
                                            children: [
                                              "+$",
                                              option.price.toFixed(2),
                                            ],
                                          }),
                                        ],
                                      }),
                                      !option.inStock &&
                                        _jsxs("span", {
                                          className:
                                            "text-red-500 text-sm flex items-center",
                                          children: [
                                            _jsx(AlertCircle, {
                                              className: "w-4 h-4 mr-1",
                                            }),
                                            "Out of stock",
                                          ],
                                        }),
                                    ],
                                  }),
                                },
                                option.id,
                              ),
                            ),
                          }),
                        }),
                      ],
                    },
                    category.id,
                  ),
                ),
              }),
              _jsx("div", {
                className: "lg:col-span-1",
                children: _jsxs(Card, {
                  className: "sticky top-6",
                  children: [
                    _jsx(CardHeader, {
                      children: _jsx(CardTitle, { children: "Order Summary" }),
                    }),
                    _jsx(CardContent, {
                      children: _jsxs("div", {
                        className: "space-y-4",
                        children: [
                          _jsxs("div", {
                            className: "border-b pb-4",
                            children: [
                              _jsxs("div", {
                                className: "flex justify-between mb-2",
                                children: [
                                  _jsx("span", { children: "Base Price" }),
                                  _jsxs("span", {
                                    children: [
                                      "$",
                                      product.basePrice.toFixed(2),
                                    ],
                                  }),
                                ],
                              }),
                              Object.entries(selectedOptions).map(
                                ([categoryId, optionId]) => {
                                  const category = product.partCategories.find(
                                    (c) => c.id === parseInt(categoryId),
                                  );
                                  const option = category.partOptions.find(
                                    (o) => o.id === optionId,
                                  );
                                  return _jsxs(
                                    "div",
                                    {
                                      className: "flex justify-between text-sm",
                                      children: [
                                        _jsx("span", { children: option.name }),
                                        _jsxs("span", {
                                          children: [
                                            "+$",
                                            option.price.toFixed(2),
                                          ],
                                        }),
                                      ],
                                    },
                                    categoryId,
                                  );
                                },
                              ),
                            ],
                          }),
                          _jsxs("div", {
                            className: "flex justify-between font-bold text-lg",
                            children: [
                              _jsx("span", { children: "Total" }),
                              _jsxs("span", {
                                children: ["$", total.toFixed(2)],
                              }),
                            ],
                          }),
                          _jsxs("button", {
                            onClick: () => alert("Added to cart!"),
                            disabled: !canAddToCart(),
                            className: `
                                          w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2
                                          ${
                                            canAddToCart()
                                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                                              : "bg-gray-300 cursor-not-allowed text-gray-600"
                                          }
                                        `,
                            children: [
                              _jsx(ShoppingCart, { className: "w-5 h-5" }),
                              _jsx("span", { children: "Add to Cart" }),
                            ],
                          }),
                          !canAddToCart() &&
                            _jsx("p", {
                              className: "text-sm text-red-500 text-center",
                              children: "Please select all required options",
                            }),
                        ],
                      }),
                    }),
                  ],
                }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
};
