import { Link } from "react-router";
import { Plus, Pencil, Trash2, Search, AlertCircle } from "lucide-react";
import {
  PriceRule,
  useDeletePriceRuleMutation,
  useGetPriceRulesQuery,
} from "@/graphql/generated/graphql.ts";
import { PriceRuleForm } from "@/components/admin/forms/price-rule-form";

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
import { useState } from "react";

interface PriceRuleModalProps {
  priceRule?: PriceRule;
  onError: (errors: string[]) => void;
  onSuccess: () => void;
}

const AddPriceRuleDialog = ({ onError, onSuccess }: PriceRuleModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add price rule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Price Rule</DialogTitle>
          <DialogDescription>
            Create a new price rule by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <PriceRuleForm
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

const EditPriceRuleDialog = ({
  priceRule,
  onError,
  onSuccess,
}: PriceRuleModalProps) => {
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
          <DialogTitle>Edit Price Rule</DialogTitle>
          <DialogDescription>
            Modify the price rule details using the form below.
          </DialogDescription>
        </DialogHeader>
        <PriceRuleForm
          actionType="Edit"
          priceRule={priceRule}
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

const DeletePriceRuleDialog = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false);
  const [deletePriceRule] = useDeletePriceRuleMutation({
    variables: { id },
    onError: (e) => {
      console.error("Error deleting price rule:", e);
      setOpen(false);
    },
    onCompleted: () => {
      setOpen(false);
    },
    refetchQueries: ["GetPriceRules"],
  });

  const handleDelete = async () => {
    try {
      await deletePriceRule();
    } catch (error) {
      console.error("Error deleting price rule:", error);
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
          <AlertDialogTitle>Delete Price Rule</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this price rule? This action cannot
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

interface PriceRulesTableProps {
  priceRules: PriceRule[];
  onSuccess: () => void;
  onError: (errors: string[]) => void;
}

const PriceRulesTable = ({
  priceRules,
  onSuccess,
  onError,
}: PriceRulesTableProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Applies To</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-[180px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {priceRules?.map((rule) => (
          <TableRow key={rule.id}>
            <TableCell>{rule.id}</TableCell>
            <TableCell>
              <div className="font-medium">{rule.description}</div>
            </TableCell>
            <TableCell>{rule.priceRuleAppliesTo}</TableCell>
            <TableCell>{formatPrice(rule.price)}</TableCell>
            <TableCell>
              <Badge variant={rule.active ? "default" : "destructive"}>
                {rule.active ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" asChild>
                  <Link to={`/admin/price-rules/${rule.id}`}>
                    <Search className="h-4 w-4" />
                  </Link>
                </Button>
                <EditPriceRuleDialog
                  priceRule={rule}
                  onSuccess={onSuccess}
                  onError={onError}
                />
                <DeletePriceRuleDialog id={rule.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export function PriceRules() {
  const [errors, setErrors] = useState<string[]>([]);
  const { loading, error, data } = useGetPriceRulesQuery();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading price rules</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Price Rules</h1>
        <AddPriceRuleDialog
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
        <PriceRulesTable
          priceRules={data?.priceRules as PriceRule[]}
          onSuccess={() => setErrors([])}
          onError={setErrors}
        />
      </div>
    </div>
  );
}
