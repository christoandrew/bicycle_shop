import { AlertCircle, Pencil, Plus, Trash2 } from "lucide-react";
import {
  CompatibilityRule,
  useDeleteCompatibilityRuleMutation,
  useGetCompatibilityRulesQuery,
} from "@/graphql/generated/graphql";

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
import CompatibilityRuleForm from "@/components/admin/forms/compatibility-rule-form.tsx";

interface CompatibilityModalProps {
  compatibilityRule?: CompatibilityRule;
  onError: (errors: string[]) => void;
  onSuccess: () => void;
}

const AddCompatibilityRuleDialog = ({
  onError,
  onSuccess,
}: CompatibilityModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add compatibility rule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add rule</DialogTitle>
          <DialogDescription>
            Create a new rule by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <CompatibilityRuleForm
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

const EditCompatibilityRuleDialog = ({
  compatibilityRule,
  onError,
  onSuccess,
}: CompatibilityModalProps) => {
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
          <DialogTitle>Edit Rule</DialogTitle>
          <DialogDescription>
            Modify the rule details using the form below.
          </DialogDescription>
        </DialogHeader>
        <CompatibilityRuleForm
          actionType="Edit"
          rule={compatibilityRule}
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

const DeleteCompatibilityRuleDialog = ({ id }: { id: string | number }) => {
  const [open, setOpen] = useState(false);
  const [deleteCompatibilityRule] = useDeleteCompatibilityRuleMutation();

  const handleDelete = async () => {
    try {
      await deleteCompatibilityRule({
        variables: { id: id.toString() },
        onError: (error) => {
          console.error("Error deleting rule:", error);
          setOpen(false);
        },
        onCompleted: () => setOpen(false),
        refetchQueries: ["GetCompatibilityRules"],
      });
    } catch (error) {
      console.error("Error deleting rule:", error);
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
          <AlertDialogTitle>Delete Rule</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this rule? This action cannot be
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

interface CompatibilityRuleTableProps {
  rules: CompatibilityRule[];
  onSuccess: () => void;
  onError: (errors: string[]) => void;
}

const CompatibilityRulesTable = ({
  rules,
  onSuccess,
  onError,
}: CompatibilityRuleTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product Type</TableHead>
          <TableHead>Requires</TableHead>
          <TableHead>Required</TableHead>
          <TableHead>Rule type</TableHead>
          <TableHead>Active</TableHead>
          <TableHead className="w-[180px]">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rules.map((rule) => (
          <TableRow key={rule.id}>
            <TableCell>{rule.productType?.name}</TableCell>
            <TableCell>{rule.requiringOption?.name}</TableCell>
            <TableCell>{rule.requiredOption?.name}</TableCell>
            <TableCell>{rule.ruleType}</TableCell>
            <TableCell>{rule.active ? "Yes" : "No"}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <EditCompatibilityRuleDialog
                  compatibilityRule={rule}
                  onSuccess={onSuccess}
                  onError={onError}
                />
                <DeleteCompatibilityRuleDialog id={rule.id} />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export function CompatibilityRules() {
  const [errors, setErrors] = useState<string[]>([]);
  const { loading, error, data } = useGetCompatibilityRulesQuery();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading rules</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          Compatibility rules
        </h1>
        <AddCompatibilityRuleDialog
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
        <CompatibilityRulesTable
          rules={data?.compatibilityRules as CompatibilityRule[]}
          onSuccess={() => setErrors([])}
          onError={setErrors}
        />
      </div>
    </div>
  );
}
