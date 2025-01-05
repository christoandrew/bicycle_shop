import { useState } from "react";
import { Link } from "react-router";
import { Plus, Pencil, Trash2, Search, AlertCircle } from "lucide-react";
import { PartCategoryForm } from "@/components/admin/forms/part-category-form";

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
import {
  PartCategory,
  useDeletePartCategoryMutation,
  useGetPartCategoriesQuery,
} from "@/graphql/generated/graphql.ts";

interface PartCategoryModalProps {
  partCategory?: PartCategory;
  onError: (errors: string[]) => void;
  onSuccess: () => void;
}

const AddPartCategoryDialog = ({
  onError,
  onSuccess,
}: PartCategoryModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add part category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Part Category</DialogTitle>
          <DialogDescription>
            Create a new part category by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <PartCategoryForm
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

const EditPartCategoryDialog = ({
  partCategory,
  onError,
  onSuccess,
}: PartCategoryModalProps) => {
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
          <DialogTitle>Edit Part Category</DialogTitle>
          <DialogDescription>
            Modify the part category details using the form below.
          </DialogDescription>
        </DialogHeader>
        <PartCategoryForm
          actionType="Edit"
          partCategory={partCategory}
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

const DeletePartCategoryDialog = ({ id }: { id: string | number }) => {
  const [open, setOpen] = useState(false);
  const [deletePartCategory] = useDeletePartCategoryMutation();

  const handleDelete = async () => {
    try {
      await deletePartCategory({
        variables: { id: id.toString() },
        onError: (error) => {
          console.error("Error deleting part category:", error);
          setOpen(false);
        },
        onCompleted: () => setOpen(false),
        refetchQueries: ["GetPartCategories"],
      });
    } catch (error) {
      console.error("Error deleting part category:", error);
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
          <AlertDialogTitle>Delete Part Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this part category? This action
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

interface PartCategoriesTableProps {
  partCategories: PartCategory[];
  onSuccessfulMutation: () => void;
  onError: (errors: string[]) => void;
}

const PartCategoriesTable = ({
  partCategories,
  onSuccessfulMutation,
  onError,
}: PartCategoriesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Product Type</TableHead>
          <TableHead>Active</TableHead>
          <TableHead className="w-[180px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {partCategories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>{category.id}</TableCell>
            <TableCell>
              <div className="font-medium">{category.name}</div>
            </TableCell>
            <TableCell>{category.position}</TableCell>
            <TableCell>{category.productType.name}</TableCell>
            <TableCell>{category.active ? "Yes" : "No"}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" asChild>
                  <Link to={`/admin/part-categories/${category.id}`}>
                    <Search className="h-4 w-4" />
                  </Link>
                </Button>
                <EditPartCategoryDialog
                  partCategory={category}
                  onSuccess={onSuccessfulMutation}
                  onError={onError}
                />
                <DeletePartCategoryDialog id={category.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export function PartCategories() {
  const [errors, setErrors] = useState<string[]>([]);
  const { loading, error, data } = useGetPartCategoriesQuery();

  const transformedCategories =
    data?.partCategories.map(
      (category) =>
        ({
          ...category,
          productTypeId: category.productType.id,
        }) as PartCategory,
    ) || [];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading part categories</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Part Categories</h1>
        <AddPartCategoryDialog
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
        <PartCategoriesTable
          partCategories={transformedCategories}
          onSuccessfulMutation={() => setErrors([])}
          onError={setErrors}
        />
      </div>
    </div>
  );
}
