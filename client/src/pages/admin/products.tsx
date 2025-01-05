import { Link } from "react-router";
import { AlertCircle, Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  ProductDefinition,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/graphql/generated/graphql";
import { ProductForm } from "@/components/admin/forms/product-form";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { ProductConfigurator } from "@/components/ui/product-configurator.tsx";

interface ProductModalProps {
  product?: ProductDefinition;
  onError: (errors: string[]) => void;
  onSuccess: () => void;
}

const AddProductDialog = ({ onError, onSuccess }: ProductModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Create a new product by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          actionType="Add"
          onError={(errors) => {
            onError(errors);
            setOpen(false);
          }}
          onSuccess={() => {
            onSuccess();
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

const EditProductDialog = ({
  product,
  onError,
  onSuccess,
}: ProductModalProps) => {
  const [open, setOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({});

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto max-w-[60vw]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Modify the product details using the form below.
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          actionType="Edit"
          product={product}
          onError={(errors) => {
            onError(errors);
            setOpen(false);
          }}
          onSuccess={() => {
            onSuccess();
            setOpen(false);
          }}
          onProductSelectionsChange={() => {
            return selectedOptions;
          }}
          selectedOptions={selectedOptions}
        />
        <ProductConfigurator
          productId={product?.id}
          onSelectedOptionsChange={(selectedOptions) => {
            setSelectedOptions(selectedOptions);
          }}
          preSelectedOptions={selectedOptions}
        />
      </DialogContent>
    </Dialog>
  );
};

const DeleteProductDialog = ({ id }: { id: string | number }) => {
  const [open, setOpen] = useState(false);
  const [deleteProduct] = useDeleteProductMutation();

  const handleDelete = async () => {
    try {
      await deleteProduct({
        variables: { id: id.toString() },
        onError: (error) => {
          console.error("Error deleting product:", error);
          setOpen(false);
        },
        onCompleted: () => setOpen(false),
        refetchQueries: ["GetProducts"],
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      setOpen(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface ProductsTableProps {
  products: ProductDefinition[];
  onSuccess: () => void;
  onError: (errors: string[]) => void;
}

const ProductsTable = ({
  products,
  onSuccess,
  onError,
}: ProductsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">ID</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Product Type</TableHead>
          <TableHead>Base Price</TableHead>
          <TableHead>Active</TableHead>
          <TableHead>Preconfigured</TableHead>
          <TableHead className="w-[180px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => {
          const preSelectedOptions = product?.productSelection
            ?.map((selection) => selection.partOptions)
            ?.flat()
            ?.map((partOption) => ({
              [partOption.partCategoryId]: partOption.id,
            }));
          console.log(preSelectedOptions);
          return (
            <TableRow key={product.id}>
              <TableCell>{product.id}</TableCell>
              <TableCell>
                <div className="font-medium">{product.name}</div>
                <div className="text-sm text-muted-foreground">
                  {product.description}
                </div>
              </TableCell>
              <TableCell>{product.productType.name}</TableCell>
              <TableCell>{product.basePrice}</TableCell>
              <TableCell>{product.active ? "Yes" : "No"}</TableCell>
              <TableCell>{product.preconfigured ? "Yes" : "No"}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <Link to={`/admin/products/${product.id}`}>
                      <Search className="h-4 w-4" />
                    </Link>
                  </Button>
                  <EditProductDialog
                    product={product}
                    onSuccess={onSuccess}
                    onError={onError}
                  />
                  <DeleteProductDialog id={product.id} />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export function ProductsPage() {
  const [errors, setErrors] = useState<string[]>([]);
  const { loading, error, data } = useGetProductsQuery();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <AddProductDialog onSuccess={() => setErrors([])} onError={setErrors} />
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      <div className="rounded-md border">
        <ProductsTable
          products={data?.products as ProductDefinition[]}
          onSuccess={() => setErrors([])}
          onError={setErrors}
        />
      </div>
    </div>
  );
}
