import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GraphQLError } from "graphql/error";
import {
  ProductTypeDefinition,
  useCreateProductTypeMutation,
  useUpdateProductTypeMutation,
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  active: z.boolean().default(false),
});

interface ProductTypeFormProps {
  actionType: string;
  productType?: ProductTypeDefinition;
  onError: (errors: string[]) => void;
  onSuccess: () => void;
}

export function ProductTypeForm({
  actionType,
  productType,
  onError,
  onSuccess,
}: ProductTypeFormProps) {
  const [createProductType] = useCreateProductTypeMutation();
  const [updateProductType] = useUpdateProductTypeMutation();

  const createOrUpdateProductType =
    actionType === "Add" ? createProductType : updateProductType;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: productType?.name ?? "",
      code: productType?.code ?? "",
      description: productType?.description ?? "",
      active: productType?.active ?? false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createOrUpdateProductType({
        variables: {
          input: {
            id: productType?.id as string,
            ...values,
          },
        },
        onError: (e) => {
          onError([e.message]);
        },
        onCompleted: () => {
          onSuccess();
        },
        refetchQueries: ["GetProductTypes"],
      });
    } catch (e) {
      onError([e instanceof GraphQLError ? e.message : (e as string)]);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{actionType} Product Type</CardTitle>
        <CardDescription>
          Create or update product type details.
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
                    <Input placeholder="Enter product type name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product type code" {...field} />
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
                      placeholder="Enter product type description"
                      className="resize-none"
                      {...field}
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
                      Enable or disable this product type
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {actionType} product type
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
