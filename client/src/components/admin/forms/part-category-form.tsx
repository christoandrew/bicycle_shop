import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GraphQLError } from "graphql/error";

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
import {
  PartCategory,
  useCreatePartCategoryMutation,
  useGetProductTypesQuery,
  useUpdatePartCategoryMutation,
} from "@/graphql/generated/graphql.ts";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  productTypeId: z.string().min(1, "Product type is required"),
  position: z.number().int().min(0, "Position must be a non-negative number"),
  required: z.boolean().default(false),
  active: z.boolean().default(true),
});

interface PartCategoryFormProps {
  actionType: string;
  partCategory?: PartCategory;
  onError: (errors: string[]) => void;
  onSuccess: (status: boolean) => void;
}

export function PartCategoryForm({
  actionType,
  partCategory,
  onError,
  onSuccess,
}: PartCategoryFormProps) {
  const { loading, error, data: productTypesData } = useGetProductTypesQuery();
  const [createPartCategory] = useCreatePartCategoryMutation();
  const [updatePartCategory] = useUpdatePartCategoryMutation();

  // Handle disabled states for select
  const isSelectDisabled =
    loading || !!error || !productTypesData?.productTypes.length;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: partCategory?.name ?? "",
      productTypeId: partCategory?.productTypeId ?? "",
      position: partCategory?.position ?? 0,
      required: partCategory?.required ?? false,
      active: partCategory?.active ?? true,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const createOrUpdatePartCategory =
      actionType === "Add" ? createPartCategory : updatePartCategory;

    try {
      await createOrUpdatePartCategory({
        variables: {
          input: {
            id: partCategory?.id as string,
            name: values.name,
            productTypeId: values.productTypeId,
            position: values.position,
            required: values.required,
            active: values.active,
          },
        },
        onError: (e) => {
          onError([e.message]);
        },
        onCompleted: () => {
          onSuccess(true);
        },
        refetchQueries: ["GetPartCategories"],
      });
    } catch (e) {
      onError([e instanceof GraphQLError ? e.message : (e as string)]);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{actionType} Part Category</CardTitle>
        <CardDescription>
          Create or update part category details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter part category name" {...field} />
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
                    disabled={isSelectDisabled}
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
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter position"
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
              name="required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Required</FormLabel>
                    <FormDescription>
                      Mark if this category is required for the product
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
                      Enable or disable this part category
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : `${actionType} part category`}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
