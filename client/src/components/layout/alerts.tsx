import { Alert } from "flowbite-react";

export const SuccessAlert = ({ message }: { message: string }) => {
  return (
    <Alert color="success" className="mb-3 mt-3" onDismiss={() => {}}>
      <div className="flex-1">
        <span className="text-green-700 dark:text-green-400">Success!</span>{" "}
        {message}
      </div>
    </Alert>
  );
};

export const ErrorAlert = ({ message }: { message: string }) => {
  return (
    <Alert color="danger" className="mb-3 mt-3" onDismiss={() => {}}>
      <div className="flex-1">
        <span className="text-red-700 dark:text-red-400">Error!</span> {message}
      </div>
    </Alert>
  );
};
