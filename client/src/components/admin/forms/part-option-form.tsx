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
  PartOption,
  useCreatePartOptionMutation,
  useGetPartCategoriesQuery,
  useUpdatePartOptionMutation,
} from "@/graphql/generated/graphql.ts";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  partCategoryId: z.string().min(1, "Part category is required"),
  position: z.number().int().min(0, "Position must be a non-negative number"),
  inStock: z.boolean().default(false),
  stockQuantity: z
    .number()
    .int()
    .min(0, "Stock quantity must be a non-negative number"),
});

interface PartOptionFormProps {
  actionType: string;
  partOption?: PartOption;
  onError: (errors: string[]) => void;
  onSuccess: (status: boolean) => void;
}

export function PartOptionForm({
  actionType,
  partOption,
  onError,
  onSuccess,
}: PartOptionFormProps) {
  const {
    loading,
    error,
    data: partCategoriesData,
  } = useGetPartCategoriesQuery();
  const [createPartOption] = useCreatePartOptionMutation();
  const [updatePartOption] = useUpdatePartOptionMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: partOption?.name ?? "",
      price: partOption?.price ?? 0,
      partCategoryId: partOption?.partCategoryId ?? "",
      position: partOption?.position ?? 0,
      inStock: partOption?.inStock ?? false,
      stockQuantity: partOption?.stockQuantity ?? 0,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const createOrUpdatePartOption =
      actionType === "Add" ? createPartOption : updatePartOption;

    try {
      await createOrUpdatePartOption({
        variables: {
          input: {
            id: partOption?.id as string,
            name: values.name,
            partCategoryId: values.partCategoryId,
            position: values.position,
            inStock: values.inStock,
            stockQuantity: values.stockQuantity,
            price: values.price,
          },
        },
        onError: (e) => {
          onError([e.message]);
        },
        onCompleted: () => {
          onSuccess(true);
        },
        refetchQueries: ["GetPartOptions"],
      });
    } catch (e) {
      onError([e instanceof GraphQLError ? e.message : (e as string)]);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{actionType} Part Option</CardTitle>
        <CardDescription>Create or update part option details.</CardDescription>
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
                    <Input placeholder="Enter part option name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter price"
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
              name="partCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Part Category</FormLabel>
                  <Select
                    disabled={loading || !!error}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a part category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loading ? (
                        <SelectItem value="loading">Loading...</SelectItem>
                      ) : error ? (
                        <SelectItem value="error">
                          Error loading part categories
                        </SelectItem>
                      ) : (
                        partCategoriesData?.partCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
              name="inStock"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>In Stock</FormLabel>
                    <FormDescription>
                      Mark this part option as available in stock
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stockQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter stock quantity"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : `${actionType} part option`}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
