import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { CheckCircle2, Clock, Package } from "lucide-react";
import {
  PartOption,
  ProductDefinition,
  ProductSelection,
} from "@/graphql/generated/graphql";

interface ProductCardProps {
  product: ProductDefinition;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  // Determine availability status based on stock
  const getAvailabilityStatus = (inStock: boolean) => {
    if (inStock) {
      return {
        label: "In Stock",
        color: "bg-emerald-500/20 text-emerald-600 border-emerald-600/20",
        icon: CheckCircle2,
      };
    }
    return {
      label: "Soon available again",
      color: "bg-red-500/20 text-red-600 border-red-600/20",
      icon: Clock,
    };
  };

  const availability = getAvailabilityStatus(product.inStock);
  const Icon = availability.icon;
  const partSelection = product.productSelection
    ?.map((selection: ProductSelection) => selection.partOptions)
    .flat();

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-semibold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Package className="h-4 w-4" />
                  <span>{product.productType.name}</span>
                </div>
                {partSelection?.map((selection: PartOption) => (
                  <div key={selection.id} className="text-sm text-gray-500">
                    {selection.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price and Stock Status */}
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">
                ${product.basePrice.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500">Base price</span>
            </div>

            <Badge
              variant="outline"
              className={`${availability.color} flex items-center gap-1.5`}
            >
              <Icon className="h-3.5 w-3.5" />
              {availability.label}
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 space-x-2">
        <Button asChild className="w-full" variant="default">
          <Link
            to={`/configure/?product_type=${product.productType.code}&product_id=${product.id}`}
            className="w-full"
          >
            Add to cart
          </Link>
        </Button>
        <Button asChild className="w-full" variant="default">
          <Link
            to={`/configure/?product_type=${product.productType.code}&product_id=${product.id}`}
            className="w-full"
          >
            Make it yours
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
