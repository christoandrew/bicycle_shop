import { useState } from "react";
import { Link } from "react-router";
import { AlertCircle, Pencil, Plus, Search, Trash2 } from "lucide-react";
import {
  ProductTypeDefinition,
  useDeleteProductTypeMutation,
} from "@/graphql/generated/graphql";
import { ProductTypeForm } from "@/components/admin/forms/product-type-form";

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
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_TYPES } from "@/graphql/queries/product-types.ts";

interface ProductTypeModalProps {
  productType?: ProductTypeDefinition;
  onError: (errors: string[]) => void;
  onSuccess: () => void;
}

const AddProductTypeDialog = ({
  onError,
  onSuccess,
}: ProductTypeModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add product type
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Product Type</DialogTitle>
          <DialogDescription>
            Create a new product type by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <ProductTypeForm
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

const EditProductTypeDialog = ({
  productType,
  onError,
  onSuccess,
}: ProductTypeModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Product Type</DialogTitle>
          <DialogDescription>
            Modify the product type details using the form below.
          </DialogDescription>
        </DialogHeader>
        <ProductTypeForm
          actionType="Edit"
          productType={productType}
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

const DeleteProductTypeDialog = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false);
  const [deleteProductType] = useDeleteProductTypeMutation();

  const handleDelete = async () => {
    try {
      await deleteProductType({
        variables: { id },
        onError: (e) => {
          console.error("Error deleting product type:", e);
          setOpen(false);
        },
        onCompleted: () => setOpen(false),
        refetchQueries: ["GetProductTypes"],
      });
    } catch (error) {
      console.error("Error deleting product type:", error);
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
          <AlertDialogTitle>Delete Product Type</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this product type? This action
            cannot be undone.
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

interface ProductTypesTableProps {
  productTypes: ProductTypeDefinition[];
  onError: (errors: string[]) => void;
  onSuccess: () => void;
}

const ProductTypesTable = ({
  productTypes,
  onError,
  onSuccess,
}: ProductTypesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[180px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {productTypes.map((type) => (
          <TableRow key={type.id}>
            <TableCell>{type.id}</TableCell>
            <TableCell>
              <div className="font-medium">{type.name}</div>
            </TableCell>
            <TableCell>{type.description}</TableCell>
            <TableCell>
              <Badge variant={type.active ? "default" : "secondary"}>
                {type.active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" asChild>
                  <Link to={`/admin/product-types/${type.id}`}>
                    <Search className="h-4 w-4" />
                  </Link>
                </Button>
                <EditProductTypeDialog
                  productType={type}
                  onSuccess={onSuccess}
                  onError={onError}
                />
                <DeleteProductTypeDialog id={type.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export function ProductTypes() {
  const [errors, setErrors] = useState<string[]>([]);
  const { loading, error, data } = useQuery(GET_PRODUCT_TYPES, {
    variables: {
      active: false,
    },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading product types</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Product Types</h1>
        <AddProductTypeDialog
          onSuccess={() => setErrors([])}
          onError={setErrors}
        />
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
        <ProductTypesTable
          productTypes={data?.productTypes as ProductTypeDefinition[]}
          onSuccess={() => setErrors([])}
          onError={setErrors}
        />
      </div>
    </div>
  );
}
