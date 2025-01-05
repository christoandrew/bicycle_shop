import { useSearchParams } from "react-router";
import { useState } from "react";
import { AlertCircle, AlertTriangle, ShoppingCart } from "lucide-react";
import {
  PartOption,
  ProductDefinition,
  useAddToCartMutation,
  useGetCompatibilityRulesForProductTypeQuery,
  useGetPartCategoriesByProductTypeCodeQuery,
  useGetPriceRulesForProductTypeQuery,
  useGetProductQuery,
} from "@/graphql/generated/graphql";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";

export const ConfigurePage = () => {
  const [addToCart] = useAddToCartMutation();
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [priceRuleMessages, setPriceRuleMessages] = useState<
    { ruleName: string; priceImpact: number }[]
  >([]);
  const [total, setTotal] = useState(0);
  const [searchParams] = useSearchParams();
  const productId = parseInt(searchParams.get("product_id") as string);

  const {
    loading: productLoading,
    error: productError,
    data: productData,
  } = useGetProductQuery({
    variables: {
      id: productId as unknown as string,
    },
  });

  // Add compatibility rules query
  const {
    data: compatibilityData,
    loading: compatibilityLoading,
    error: compatibilityError,
  } = useGetCompatibilityRulesForProductTypeQuery({
    variables: {
      productTypeId: productData?.product?.productType?.id as unknown as string,
    },
  });

  const {
    loading: priceRuleLoading,
    error: priceRuleError,
    data: priceRuleData,
  } = useGetPriceRulesForProductTypeQuery({
    variables: {
      productTypeId: productData?.product?.productType?.id as unknown as string,
    },
  });

  const {
    data: partCategoriesData,
    loading: partCategoriesLoading,
    error: partCategoriesError,
  } = useGetPartCategoriesByProductTypeCodeQuery({
    variables: {
      productTypeCode: productData?.product.productType.code as string,
    },
  });

  if (
    productLoading ||
    partCategoriesLoading ||
    compatibilityLoading ||
    priceRuleLoading
  ) {
    return <div>Loading...</div>;
  }

  if (productError || partCategoriesError || compatibilityError) {
    console.error(
      "Error loading page:",
      productError ||
        partCategoriesError ||
        compatibilityError ||
        priceRuleError,
    );
    return <div>Error loading configurator</div>;
  }

  const product = productData?.product;
  const partCategories = partCategoriesData?.partCategoriesByProductTypeCode;

  const applyPriceRules = (
    total: number,
    selectedOptions: SelectedOptions,
  ): number => {
    if (!priceRuleData?.priceRulesForProductType) {
      console.error("No price rules found for the product type.");
      setPriceRuleMessages([]);
      return total;
    }

    const rules = priceRuleData.priceRulesForProductType;
    const applicableRules = rules.filter((rule) => {
      const partOptions = rule.partOptions || [];
      return partOptions.every((option) =>
        Object.values(selectedOptions).includes(option.id),
      );
    });

    const messages: { ruleName: string; priceImpact: number }[] = [];

    // Adjust total and collect rule messages
    applicableRules.forEach((rule) => {
      const partOptions = rule.partOptions || [];
      const optionPrices = partOptions.reduce(
        (sum, option) => sum + option.price,
        0,
      );
      const priceImpact = rule.price - optionPrices;
      messages.push({ ruleName: rule.description, priceImpact });

      // Adjust total price
      total -= optionPrices;
      total += rule.price;
    });

    setPriceRuleMessages(messages); // Update state with messages
    return total;
  };
  // Function to get compatibility messages for an option
  const getCompatibilityMessages = (option: PartOption) => {
    const messages: { type: "requires" | "excludes"; message: string }[] = [];
    const rules = compatibilityData?.compatibilityRulesForProductType || [];

    // Check what this option requires
    const requiresRules = rules.filter(
      (rule) =>
        rule.ruleType === "requires" && rule.requiringOption?.id === option.id,
    );

    requiresRules.forEach((rule) => {
      const requiredOption = findOptionById(rule.requiredOption?.id as string);
      if (requiredOption) {
        messages.push({
          type: "requires",
          message: `Requires ${requiredOption.name}`,
        });
      }
    });

    // Check what this option excludes
    const excludesRules = rules.filter(
      (rule) =>
        rule.ruleType === "excludes" && rule.requiringOption?.id === option.id,
    );

    excludesRules.forEach((rule) => {
      const excludedOption = findOptionById(rule.requiredOption?.id as string);
      if (excludedOption) {
        messages.push({
          type: "excludes",
          message: `Cannot be used with ${excludedOption.name}`,
        });
      }
    });

    return messages;
  };

  // Helper function to find an option by ID across all categories
  const findOptionById = (optionId: string) => {
    return partCategoriesData?.partCategoriesByProductTypeCode
      .flatMap((category) => category.partOptions)
      .find((option) => option.id === optionId);
  };

  // Function to check if an option is available based on compatibility rules
  const isOptionAvailable = (option: PartOption, categoryId: string) => {
    if (!option.inStock) return false;

    const rules = compatibilityData?.compatibilityRulesForProductType || [];

    for (const [selectedCategoryId, selectedOptionId] of Object.entries(
      selectedOptions,
    )) {
      // Skip if we're checking the same category
      if (selectedCategoryId === categoryId) continue;

      // Check 'requires' rules
      const requiresRules = rules.filter(
        (rule) =>
          rule.ruleType === "requires" &&
          rule.requiringOption?.id === selectedOptionId,
      );

      if (requiresRules.length > 0) {
        const isRequired = requiresRules.some(
          (rule) => rule.requiredOption?.id === option.id,
        );
        if (!isRequired) return false;
      }

      // Check 'excludes' rules
      const excludesRules = rules.filter(
        (rule) =>
          rule.ruleType === "excludes" &&
          rule.requiringOption?.id === selectedOptionId,
      );

      if (excludesRules.some((rule) => rule.requiredOption?.id === option.id)) {
        return false;
      }
    }

    return true;
  };

  const handleOptionSelect = ({
    categoryId,
    optionId,
  }: {
    categoryId: number | string;
    optionId: number | string;
  }) => {
    const newSelections = {
      ...selectedOptions,
      [categoryId]: optionId,
    };
    setSelectedOptions(newSelections);
    setTotal(calculateTotal(newSelections));
  };

  const getSelectedOptionName = (categoryId: number | string) => {
    const optionId = selectedOptions[categoryId];
    if (!optionId) return null;

    const category = partCategories?.find(
      (c: { id: number | string }) => c.id === categoryId,
    );
    const option = category?.partOptions.find(
      (o: { id: number | string }) => o.id === optionId,
    );
    return option ? option.name : null;
  };

  const calculateTotal = (selections: SelectedOptions) => {
    let newTotal = product?.basePrice || 0;
    Object.entries(selections).forEach(([categoryId, optionId]) => {
      const category = partCategories?.find((c) => c?.id === categoryId);
      const option = category?.partOptions.find((o) => o.id === optionId);

      if (option) {
        newTotal += option?.price || 0;
      }
    });
    applyPriceRules(newTotal, selections);
    return newTotal;
  };

  const removeOption = (categoryId: number | string) => {
    const newSelections = { ...selectedOptions };
    delete newSelections[categoryId];
    setSelectedOptions(newSelections);
    setTotal(calculateTotal(newSelections));
  };

  const canAddToCart = () => {
    return partCategoriesData?.partCategoriesByProductTypeCode
      .filter((category) => category.required)
      .every((category) => selectedOptions[category.id]);
  };

  const handleAddToCart = async (
    product: ProductDefinition,
    selectedOptions: SelectedOptions,
  ) => {
    const options = Object.entries(selectedOptions).map(
      ([categoryId, optionId]) => ({
        categoryId: categoryId,
        optionId: optionId,
      }),
    );
    try {
      const { data } = await addToCart({
        variables: {
          productId: product.id,
          quantity: 1,
          selectedOptions: options,
        },
      });
      if (data?.addToCart.errors.length) {
        alert(`Error: ${data?.addToCart.errors.join(", ")}`);
      } else {
        alert("Item added to cart!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white">
            Configure Your {product?.name}
          </h1>
          <p className="mt-2 text-blue-100">{product?.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {partCategories?.map((category: any) => (
              <Card key={category.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{category.name}</CardTitle>
                      {category.required && (
                        <Badge variant="destructive" className="ml-2">
                          Required
                        </Badge>
                      )}
                    </div>
                    {getSelectedOptionName(category.id) && (
                      <Badge variant="secondary">
                        Selected: {getSelectedOptionName(category.id)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.partOptions.map((option: PartOption) => {
                      const isAvailable = isOptionAvailable(
                        option,
                        category.id,
                      );
                      const compatibilityMessages =
                        getCompatibilityMessages(option);

                      return (
                        <TooltipProvider key={option.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={
                                  selectedOptions[category.id] === option.id
                                    ? "default"
                                    : "outline"
                                }
                                className="h-auto p-4 flex flex-col items-stretch"
                                disabled={!isAvailable}
                                onClick={() =>
                                  handleOptionSelect({
                                    categoryId: category.id,
                                    optionId: option.id,
                                  })
                                }
                              >
                                <div className="flex justify-between items-start w-full">
                                  <div className="text-left">
                                    <div className="font-semibold">
                                      {option.name}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      +{formatPrice(option.price)}
                                    </div>
                                  </div>
                                  {!option.inStock && (
                                    <Badge
                                      variant="destructive"
                                      className="flex items-center gap-1"
                                    >
                                      <AlertCircle className="h-3 w-3" />
                                      Out of stock
                                    </Badge>
                                  )}
                                  {compatibilityMessages.length > 0 && (
                                    <Badge
                                      variant="secondary"
                                      className="flex items-center gap-1"
                                    >
                                      <AlertTriangle className="h-3 w-3" />
                                      Rules Apply
                                    </Badge>
                                  )}
                                </div>
                              </Button>
                            </TooltipTrigger>
                            {compatibilityMessages.length > 0 && (
                              <TooltipContent>
                                <div className="space-y-2">
                                  {compatibilityMessages.map((msg, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2"
                                    >
                                      <AlertTriangle className="h-3 w-3" />
                                      <span>{msg.message}</span>
                                    </div>
                                  ))}
                                </div>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 z-30">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>
                    Configure your perfect setup
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Base Price
                        </span>
                        <span className="font-medium">
                          {formatPrice(product?.basePrice || 0)}
                        </span>
                      </div>
                      {priceRuleMessages.map((message, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {message.ruleName}
                          </span>
                          <span className="font-medium">
                            {message.priceImpact > 0 ? "+" : ""}
                            {formatPrice(message.priceImpact)}
                          </span>
                        </div>
                      ))}
                      {Object.entries(selectedOptions).map(
                        ([categoryId, optionId]) => {
                          const category = partCategories?.find(
                            (c) => c?.id === categoryId,
                          );
                          const option = category?.partOptions.find(
                            (o: { id: string }) => o.id === optionId,
                          );
                          return (
                            <div
                              key={categoryId}
                              className="flex justify-between text-sm"
                            >
                              <Button onClick={() => removeOption(categoryId)}>
                                X
                              </Button>
                              <span className="text-muted-foreground">
                                {option?.name}
                              </span>
                              <span className="font-medium">
                                +{formatPrice(option?.price || 0)}
                              </span>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </ScrollArea>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>

                  <Button
                    className="w-full mt-6"
                    size="lg"
                    onClick={() =>
                      handleAddToCart(
                        product as ProductDefinition,
                        selectedOptions,
                      )
                    }
                    disabled={!canAddToCart()}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>

                  {!canAddToCart() && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Missing Options</AlertTitle>
                      <AlertDescription>
                        Please select all required options before adding to cart
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
