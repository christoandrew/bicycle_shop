import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Loader2 } from "lucide-react";
import {
  CompatibilityRule,
  useCreateCompatibilityRuleMutation,
  useGetPartCategoriesByProductTypeIdQuery,
  useGetPartOptionsByPartCategoryIdQuery,
  useGetProductTypesQuery,
} from "@/graphql/generated/graphql";
import { GraphQLError } from "graphql/error";
import { Checkbox } from "@/components/ui/checkbox.tsx";

const formSchema = z
  .object({
    productTypeId: z.string().min(1, "Product type is required"),
    ruleType: z.enum(["requires", "excludes"]),
    requiringCategoryId: z.string().min(1, "Requiring category is required"),
    requiringOptionId: z.string().min(1, "Requiring option is required"),
    requiredCategoryId: z.string().min(1, "Required category is required"),
    requiredOptionId: z.string().min(1, "Required option is required"),
    active: z.boolean().default(true),
  })
  .refine((data) => data.requiringCategoryId !== data.requiredCategoryId, {
    message: "Cannot create a rule between the same category",
  })
  .refine((data) => data.requiringOptionId !== data.requiredOptionId, {
    message: "Cannot create a rule between the same option",
    path: ["requiredOptionId"],
  });

interface CompatibilityRuleFormProps {
  rule?: CompatibilityRule;
  actionType: string;
  onError: (errors: string[]) => void;
  onSuccess: () => void;
}

export const CompatibilityRuleForm = ({
  rule,
  actionType,
  onError,
  onSuccess,
}: CompatibilityRuleFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productTypeId: rule?.productTypeId ?? "",
      ruleType: rule?.ruleType ?? "requires",
      requiringCategoryId: "",
      requiringOptionId: rule?.requiringOptionId ?? "",
      requiredCategoryId: "",
      requiredOptionId: rule?.requiredOptionId ?? "",
      active: rule?.active ?? true,
    },
  });
  const [createCompatibilityRule] = useCreateCompatibilityRuleMutation();
  const { data: productTypesData, loading: loadingProductTypes } =
    useGetProductTypesQuery();

  const { data: categoriesData, loading: loadingCategories } =
    useGetPartCategoriesByProductTypeIdQuery({
      variables: { productTypeId: form.watch("productTypeId") },
      skip: !form.watch("productTypeId"),
    });

  const { data: requiringOptionsData, loading: loadingRequiringOptions } =
    useGetPartOptionsByPartCategoryIdQuery({
      variables: { partCategoryId: form.watch("requiringCategoryId") },
      skip: !form.watch("requiringCategoryId"),
    });

  const { data: requiredOptionsData, loading: loadingRequiredOptions } =
    useGetPartOptionsByPartCategoryIdQuery({
      variables: { partCategoryId: form.watch("requiredCategoryId") },
      skip: !form.watch("requiredCategoryId"),
    });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await createCompatibilityRule({
        variables: {
          input: {
            productTypeId: values.productTypeId,
            requiringOptionId: values.requiringOptionId,
            requiredOptionId: values.requiredOptionId,
            ruleType: values.ruleType,
            active: values.active,
          },
        },
        refetchQueries: ["GetCompatibilityRules"],
      });

      if (data?.createCompatibilityRule) {
        onSuccess();
      }
    } catch (err) {
      onError([err instanceof GraphQLError ? err.message : (err as string)]);
    }
  };

  const watchProductType = form.watch("productTypeId");
  const watchRequiringCategory = form.watch("requiringCategoryId");
  const watchRequiredCategory = form.watch("requiredCategoryId");

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardDescription>
          Define how different product options work together
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productTypeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadingProductTypes ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
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
              name="ruleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rule Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="requires">Requires</SelectItem>
                      <SelectItem value="excludes">Excludes</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">IF customer selects:</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requiringCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!watchProductType}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingCategories ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            categoriesData?.partCategoriesByProductTypeId.map(
                              (cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ),
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiringOptionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!watchRequiringCategory}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingRequiringOptions ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            requiringOptionsData?.partOptionsByPartCategoryId.map(
                              (opt) => (
                                <SelectItem key={opt.id} value={opt.id}>
                                  {opt.name}
                                </SelectItem>
                              ),
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">
                THEN customer{" "}
                {form.watch("ruleType") === "requires"
                  ? "must select"
                  : "cannot select"}
                :
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requiredCategoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!watchProductType}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingCategories ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            categoriesData?.partCategoriesByProductTypeId.map(
                              (cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ),
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiredOptionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Option</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!watchRequiredCategory}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingRequiredOptions ? (
                            <div className="flex items-center justify-center p-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            requiredOptionsData?.partOptionsByPartCategoryId.map(
                              (opt) => (
                                <SelectItem key={opt.id} value={opt.id}>
                                  {opt.name}
                                </SelectItem>
                              ),
                            )
                          )}
                        </SelectContent>
                      </Select>
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
                          Enable or disable this rule
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {form.formState.errors.root?.message && (
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            `${actionType} Rule`
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CompatibilityRuleForm;
