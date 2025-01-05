import React from "react";
import { useParams } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Link as LinkIcon,
  Package,
  Plus,
  Settings,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PartOption, useGetProductQuery } from "@/graphql/generated/graphql";

export function ProductDetailsPage() {
  const { id } = useParams();
  const { data, loading, error } = useGetProductQuery({
    variables: { id: id as string },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading product</div>;

  const product = data?.product;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{product?.name}</h1>
          <p className="text-muted-foreground">{product?.productType.name}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Base Price</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(product?.basePrice || 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={product?.active ? "success" : "secondary"}>
              {product?.active ? "Active" : "Inactive"}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Configuration</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={product?.preconfigured ? "default" : "outline"}>
              {product?.preconfigured ? "Preconfigured" : "Custom"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="configuration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="configuration" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Configuration Options</h2>
          </div>

          {product?.productSelection
            .map((s) => s.partOptions)
            .flat()
            .map((option: PartOption) => (
              <Card key={option.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{option.partCategory?.name}</CardTitle>
                      <CardDescription>
                        {option.partCategory?.required
                          ? "Required"
                          : "Optional"}{" "}
                        category
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Option Name</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock Status</TableHead>
                        <TableHead>Stock Quantity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {product?.productSelection
                        .map((s) => s.partOptions)
                        .flat()
                        .map.map((option) => (
                          <TableRow key={option.id}>
                            <TableCell className="font-medium">
                              {option.name}
                            </TableCell>
                            <TableCell>{formatPrice(option.price)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  option.inStock ? "success" : "destructive"
                                }
                              >
                                {option.inStock ? "In Stock" : "Out of Stock"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {option.stockQuantity || "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}

          {product?.categories?.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No categories found</AlertTitle>
              <AlertDescription>
                This product doesn't have any configuration categories yet. Add
                one to get started.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="compatibility">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Compatibility Rules</CardTitle>
                  <CardDescription>
                    Manage which options can be combined
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Compatibility rules table would go here */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No rules defined</AlertTitle>
                <AlertDescription>
                  There are no compatibility rules defined for this product yet.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Price Rules</CardTitle>
                  <CardDescription>
                    Special pricing for specific combinations
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Price Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Price rules table would go here */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>No price rules</AlertTitle>
                <AlertDescription>
                  There are no special price rules defined for this product yet.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
