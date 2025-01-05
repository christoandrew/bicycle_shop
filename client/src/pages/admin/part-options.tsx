import { useState } from "react";
import { Link } from "react-router";
import { Plus, Pencil, Trash2, Search, AlertCircle } from "lucide-react";
import { PartOptionForm } from "@/components/admin/forms/part-option-form";

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
import {
  PartOption,
  useDeletePartOptionMutation,
  useGetPartOptionsQuery,
} from "@/graphql/generated/graphql.ts";

interface PartOptionModalProps {
  partOption?: PartOption;
  onError: (errors: string[]) => void;
  onSuccess: () => void;
}

const AddPartOptionDialog = ({ onError, onSuccess }: PartOptionModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add part option
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Part Option</DialogTitle>
          <DialogDescription>
            Create a new part option by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <PartOptionForm
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

const EditPartOptionDialog = ({
  partOption,
  onError,
  onSuccess,
}: PartOptionModalProps) => {
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
          <DialogTitle>Edit Part Option</DialogTitle>
          <DialogDescription>
            Modify the part option details using the form below.
          </DialogDescription>
        </DialogHeader>
        <PartOptionForm
          actionType="Edit"
          partOption={partOption}
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

const DeletePartOptionDialog = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false);
  const [deletePartOption] = useDeletePartOptionMutation({
    variables: { id },
    onError: (e) => {
      console.error("Error deleting part option:", e);
      setOpen(false);
    },
    onCompleted: () => {
      setOpen(false);
    },
    refetchQueries: ["GetPartOptions"],
  });

  const handleDelete = async () => {
    try {
      await deletePartOption();
    } catch (error) {
      console.error("Error deleting part option:", error);
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
          <AlertDialogTitle>Delete Part Option</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this part option? This action cannot
            be undone.
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

interface PartOptionsTableProps {
  partOptions: PartOption[];
  onSuccess: () => void;
  onError: (errors: string[]) => void;
}

const PartOptionsTable = ({
  partOptions,
  onSuccess,
  onError,
}: PartOptionsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Product Type</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock Status</TableHead>
          <TableHead>Stock Quantity</TableHead>
          <TableHead className="w-[180px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {partOptions?.map((option) => (
          <TableRow key={option.id}>
            <TableCell>{option.id}</TableCell>
            <TableCell>
              <div className="font-medium">{option.name}</div>
            </TableCell>
            <TableCell>{option.partCategory?.name}</TableCell>
            <TableCell>{option.partCategory?.productType?.name}</TableCell>
            <TableCell>{option.price}</TableCell>
            <TableCell>
              <Badge variant={option.inStock ? "default" : "destructive"}>
                {option.inStock ? "In Stock" : "Out of Stock"}
              </Badge>
            </TableCell>
            <TableCell>
              {option.inStock ? option.stockQuantity : "N/A"}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" asChild>
                  <Link to={`/admin/part-options/${option.id}`}>
                    <Search className="h-4 w-4" />
                  </Link>
                </Button>
                <EditPartOptionDialog
                  partOption={option}
                  onSuccess={onSuccess}
                  onError={onError}
                />
                <DeletePartOptionDialog id={option.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export function PartOptions() {
  const [errors, setErrors] = useState<string[]>([]);
  const { loading, error, data } = useGetPartOptionsQuery();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading part options</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Part Options</h1>
        <AddPartOptionDialog
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
        <PartOptionsTable
          partOptions={data?.partOptions as PartOption[]}
          onSuccess={() => setErrors([])}
          onError={setErrors}
        />
      </div>
    </div>
  );
}
