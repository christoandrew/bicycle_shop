import { useParams } from "react-router";
import { Separator } from "@/components/ui/separator";
import { ProductCard } from "@/components/layout/product-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Package } from "lucide-react";
import pluralize from "pluralize";
import {
  ProductDefinition,
  useGetPreconfiguredProductsQuery,
} from "@/graphql/generated/graphql";
import { toTitleCase } from "@/lib/utils";

export const AVAILABILITY_TYPES = {
  BOTH: {
    label: "Available online & in store",
    color: "bg-emerald-500/20 text-emerald-600 border-emerald-600/20",
  },
  ONLINE: {
    label: "Available online",
    color: "bg-blue-500/20 text-blue-600 border-blue-600/20",
  },
  STORE: {
    label: "Available in store",
    color: "bg-amber-500/20 text-amber-600 border-amber-600/20",
  },
  SOON: {
    label: "Soon available again",
    color: "bg-red-500/20 text-red-600 border-red-600/20",
  },
};

const LoadingSkeleton = () => (
  <div className="space-y-8">
    <div className="space-y-4">
      <Skeleton className="h-12 w-64" />
      <Skeleton className="h-4 w-full" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} className="h-80" />
      ))}
    </div>
  </div>
);

export const ProductTypePage = () => {
  const { productType } = useParams<{ productType: string }>();
  const { loading, error, data } = useGetPreconfiguredProductsQuery({
    variables: {
      productType: productType as string,
    },
  });
  const products = data?.preconfiguredProducts as ProductDefinition[];
  const title = toTitleCase(pluralize(productType as string));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Skeleton className="h-12 w-64 bg-white/20" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
          <Card className="p-6">
            <LoadingSkeleton />
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was a problem loading the products. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-48 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3">
            <Package className="h-8 w-8 text-white" />
            <h1 className="text-3xl font-bold text-white">Explore {title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Products
                </h2>
              </div>

              <Separator />

              {/* Availability Legend */}
              <div className="flex flex-wrap gap-3">
                {Object.entries(AVAILABILITY_TYPES).map(
                  ([key, { label, color }]) => (
                    <Badge
                      key={key}
                      variant="outline"
                      className={`${color} font-normal`}
                    >
                      {label}
                    </Badge>
                  ),
                )}
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product: ProductDefinition) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
