import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { Button, Modal, Table } from "flowbite-react";
import { FaPlus } from "react-icons/fa";
import {
  HiOutlineExclamationCircle,
  HiPencilAlt,
  HiTrash,
} from "react-icons/hi";
import { PartCategoryForm } from "@/components/admin/forms/part-category-form.tsx";
import { useQuery } from "@apollo/client";
import { GET_PRICE_RULES } from "@/graphql/queries.ts";
import { HiMagnifyingGlassPlus } from "react-icons/hi2";
import { Link } from "react-router";
import { useState } from "react";
export const PriceRules = () => {
  return _jsxs("div", {
    children: [
      _jsx("div", {
        className:
          "block items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800 sm:flex",
        children: _jsx("div", {
          className: "mb-1 w-full",
          children: _jsxs("div", {
            className: "mb-4",
            children: [
              _jsx("h1", {
                className:
                  "text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl",
                children: "All price rules",
              }),
              _jsx("div", {
                className: "flex w-full items-center sm:justify-end",
                children: _jsx(AddPartOptionModal, {}),
              }),
            ],
          }),
        }),
      }),
      _jsx(PriceRulesTable, {}),
    ],
  });
};
const DeletePartOptionModal = function () {
  const [isOpen, setOpen] = useState(false);
  return _jsxs(_Fragment, {
    children: [
      _jsxs(Button, {
        color: "failure",
        onClick: () => setOpen(!isOpen),
        children: [_jsx(HiTrash, { className: "mr-2 text-lg" }), "Delete item"],
      }),
      _jsxs(Modal, {
        onClose: () => setOpen(false),
        show: isOpen,
        size: "md",
        children: [
          _jsx(Modal.Header, {
            className: "px-3 pb-0 pt-3",
            children: _jsx("span", {
              className: "sr-only",
              children: "Delete product",
            }),
          }),
          _jsx(Modal.Body, {
            className: "px-6 pb-6 pt-0",
            children: _jsxs("div", {
              className: "flex flex-col items-center gap-y-6 text-center",
              children: [
                _jsx(HiOutlineExclamationCircle, {
                  className: "text-7xl text-red-600",
                }),
                _jsx("p", {
                  className: "text-lg text-gray-500 dark:text-gray-300",
                  children: "Are you sure you want to delete this product?",
                }),
                _jsxs("div", {
                  className: "flex items-center gap-x-3",
                  children: [
                    _jsx(Button, {
                      color: "failure",
                      onClick: () => setOpen(false),
                      children: "Yes, I'm sure",
                    }),
                    _jsx(Button, {
                      color: "gray",
                      onClick: () => setOpen(false),
                      children: "No, cancel",
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
};
const AddPartOptionModal = function () {
  const [isOpen, setOpen] = useState(false);
  return _jsxs(_Fragment, {
    children: [
      _jsxs(Button, {
        color: "info",
        onClick: () => setOpen(!isOpen),
        children: [_jsx(FaPlus, { className: "mr-3 text-sm" }), "Add product"],
      }),
      _jsxs(Modal, {
        onClose: () => setOpen(false),
        show: isOpen,
        children: [
          _jsx(Modal.Header, {
            className: "border-b border-gray-200 !p-6 dark:border-gray-700",
            children: _jsx("strong", { children: "Add product" }),
          }),
          _jsx(Modal.Body, {
            children: _jsx(PartCategoryForm, {
              actionType: "Add",
              onSubmit: () => {},
            }),
          }),
        ],
      }),
    ],
  });
};
const EditPartOptionModal = (product) => {
  const [isOpen, setOpen] = useState(false);
  return _jsxs(_Fragment, {
    children: [
      _jsxs(Button, {
        color: "info",
        onClick: () => setOpen(!isOpen),
        children: [_jsx(HiPencilAlt, { className: "mr-2 text-lg" }), "Edit"],
      }),
      _jsxs(Modal, {
        onClose: () => setOpen(false),
        show: isOpen,
        children: [
          _jsx(Modal.Header, {
            className: "border-b border-gray-200 !p-6 dark:border-gray-700",
            children: _jsx("strong", { children: "Edit product" }),
          }),
          _jsx(Modal.Body, { children: _jsx(PartCategoryForm, {}) }),
        ],
      }),
    ],
  });
};
const PriceRulesTable = function () {
  const { loading, error, data } = useQuery(GET_PRICE_RULES);
  if (loading) return _jsx("p", { children: "Loading..." });
  if (error) return _jsxs("p", { children: ["Error : ", error.toString()] });
  return _jsxs(Table, {
    className: "min-w-full divide-y divide-gray-200 dark:divide-gray-600",
    children: [
      _jsxs(Table.Head, {
        className: "bg-gray-100 dark:bg-gray-700",
        children: [
          _jsx(Table.HeadCell, { children: "ID" }),
          _jsx(Table.HeadCell, { children: "Description" }),
          _jsx(Table.HeadCell, { children: "Applies To" }),
          _jsx(Table.HeadCell, { children: "Actions" }),
        ],
      }),
      _jsx(Table.Body, {
        className:
          "divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800",
        children: data.priceRules.map((rule) =>
          _jsxs(Table.Row, {
            className: "hover:bg-gray-100 dark:hover:bg-gray-700",
            children: [
              _jsx(Table.Cell, { className: "w-4 p-4", children: rule.id }),
              _jsx(Table.Cell, {
                className:
                  "whitespace-nowrap p-4 text-sm font-normal text-gray-500 dark:text-gray-400",
                children: _jsx("div", {
                  className:
                    "text-base font-semibold text-gray-900 dark:text-white",
                  children: rule.description,
                }),
              }),
              _jsx(Table.Cell, {
                className:
                  "whitespace-nowrap p-4 text-base font-medium text-gray-900 dark:text-white",
                children: rule.priceRuleAppliesTo.join(", "),
              }),
              _jsx(Table.Cell, {
                className: "space-x-2 whitespace-nowrap p-4",
                children: _jsxs("div", {
                  className: "flex items-center gap-x-3",
                  children: [
                    _jsxs(Button, {
                      color: "success",
                      children: [
                        _jsx(HiMagnifyingGlassPlus, {
                          className: "mr-2 text-lg",
                        }),
                        _jsx(Link, {
                          to: `/admin/price-rules/${rule.id}`,
                          children: "View",
                        }),
                      ],
                    }),
                    _jsx(DeletePartOptionModal, {}),
                  ],
                }),
              }),
            ],
          }),
        ),
      }),
    ],
  });
};
