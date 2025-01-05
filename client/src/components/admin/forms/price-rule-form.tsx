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
  PriceRule,
  useCreatePriceRuleMutation,
  useGetProductTypesQuery,
  useUpdatePriceRuleMutation,
} from "@/graphql/generated/graphql.ts";

const formSchema = z.object({
  description: z.string().min(1, "Description is required"),
  productTypeId: z.string().min(1, "Product type is required"),
  price: z.number().min(0, "Price must be greater than or equal to 0"),
  active: z.boolean().default(false),
});

interface PriceRuleFormProps {
  actionType: string;
  priceRule?: PriceRule;
  onError: (errors: string[]) => void;
  onSuccess: (status: boolean) => void;
}

export function PriceRuleForm({
  actionType,
  priceRule,
  onError,
  onSuccess,
}: PriceRuleFormProps) {
  const { loading, error, data: productTypesData } = useGetProductTypesQuery();
  const [createPriceRule] = useCreatePriceRuleMutation();
  const [updatePriceRule] = useUpdatePriceRuleMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: priceRule?.description ?? "",
      productTypeId: (priceRule?.productTypeId as string) ?? "",
      price: priceRule?.price ?? 0,
      active: priceRule?.active ?? false,
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const createOrUpdatePriceRule =
      actionType === "Add" ? createPriceRule : updatePriceRule;

    try {
      await createOrUpdatePriceRule({
        variables: {
          input: {
            id: priceRule?.id as string,
            description: values.description,
            productTypeId: values.productTypeId,
            price: values.price,
            active: values.active,
          },
        },
        onError: (e) => {
          onError([e.message]);
        },
        onCompleted: () => {
          onSuccess(true);
        },
        refetchQueries: ["GetPriceRules"],
      });
    } catch (e) {
      onError([e instanceof GraphQLError ? e.message : (e as string)]);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{actionType} Price Rule</CardTitle>
        <CardDescription>Create or update price rule details.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter price rule description"
                      {...field}
                    />
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
                        <SelectItem value="">Loading...</SelectItem>
                      ) : error ? (
                        <SelectItem value="">
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
                      Enable or disable this price rule
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : `${actionType} price rule`}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
