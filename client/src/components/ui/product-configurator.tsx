import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  PartOption,
  useGetCompatibilityRulesForProductTypeQuery,
  useGetPartCategoriesByProductTypeCodeQuery,
  useGetPriceRulesForProductTypeQuery,
  useGetProductQuery,
} from "@/graphql/generated/graphql.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { Button } from "@/components/ui/button.tsx";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";

type SelectedOptions = { [key: number | string]: number | string };

interface ProductConfiguratorProps {
  productId?: string;
  preSelectedOptions?: SelectedOptions;
  onOptionsSelect?: (option: {
    categoryId: number | string;
    optionId: number | string;
  }) => void;
  onPriceRuleMessagesChange?: (
    messages: { ruleName: string; priceImpact: number }[],
  ) => void;
  onSelectedOptionsChange?: (selectedOptions: SelectedOptions) => void;
}

export const ProductConfigurator = ({
  productId,
  preSelectedOptions,
  onSelectedOptionsChange,
}: ProductConfiguratorProps) => {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(
    preSelectedOptions || {},
  );
  const [priceRuleMessages, setPriceRuleMessages] = useState<
    { ruleName: string; priceImpact: number }[]
  >([]);

  const {
    loading: productLoading,
    error: productError,
    data: productData,
  } = useGetProductQuery({
    variables: {
      id: productId as unknown as string,
    },
    onError: (error) => {
      console.error("Error loading product:", error);
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
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

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

    onSelectedOptionsChange?.(newSelections);
    setSelectedOptions(newSelections);
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

  const product = productData?.product;
  const partCategories = partCategoriesData?.partCategoriesByProductTypeCode;

  return (
    <>
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
                  const isAvailable = isOptionAvailable(option, category.id);
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
    </>
  );
};
