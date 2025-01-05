import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GraphQLError } from "graphql/error";
import {
  ProductDefinition,
  ProductSelectionInput,
  useCreateProductMutation,
  useGetProductTypesQuery,
  useUpdateProductMutation,
} from "@/graphql/generated/graphql";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { SelectedOptions } from "@/types.ts";

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  productTypeId: z.string().min(1, "Product type is required"),
  basePrice: z.number().min(0, "Price must be greater than or equal to 0"),
  description: z.string().optional(),
  preconfigured: z.boolean().default(false),
  active: z.boolean().default(true),
});

interface ProductFormProps {
  actionType: string;
  product?: ProductDefinition;
  onError: (errors: string[]) => void;
  onSuccess: () => void;
  onProductSelectionsChange?: () => SelectedOptions;
  selectedOptions: SelectedOptions;
}

export function ProductForm({
  actionType,
  product,
  onError,
  onSuccess,
  selectedOptions,
}: ProductFormProps) {
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const { loading, error, data: productTypesData } = useGetProductTypesQuery();

  const createOrUpdateProduct =
    actionType === "Add" ? createProduct : updateProduct;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      active: product?.active ?? true,
      name: product?.name ?? "",
      productTypeId: product?.productType?.id ?? "",
      basePrice: product?.basePrice ?? 0,
      description: product?.description ?? "",
      preconfigured: product?.preconfigured ?? false,
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading product types</div>;

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createOrUpdateProduct({
        variables: {
          input: {
            id: product?.id as string,
            name: values.name,
            productTypeId: values.productTypeId,
            basePrice: values.basePrice,
            description: values.description as string,
            preconfigured: values.preconfigured,
            active: values.active,
            productSelections: Object.values(selectedOptions).map((option) => ({
              productId: product?.id as string,
              partOptionId: option,
            })) as ProductSelectionInput[],
          },
        },
        onError: (e) => {
          onError([e.message]);
        },
        onCompleted: () => {
          onSuccess();
        },
        refetchQueries: ["GetProducts"],
      });
    } catch (e) {
      onError([e instanceof GraphQLError ? e.message : (e as string)]);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{actionType} Product</CardTitle>
        <CardDescription>Create or update product details.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="productTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Type</FormLabel>
                    <Select
                      disabled={loading || !!error}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a product type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loading ? (
                          <SelectItem value="loading">Loading...</SelectItem>
                        ) : error ? (
                          <SelectItem value="error">
                            Error loading product types
                          </SelectItem>
                        ) : (
                          productTypesData?.productTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              {type.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Enter base price"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        className="resize-none h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preconfigured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Preconfigured</FormLabel>
                      <FormDescription>
                        Set whether this product comes with a default
                        configuration
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Set whether this product is actuive
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : `${actionType} product`}
              </Button>
            </form>
          </Form>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
