import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { useOrdersQuery } from "@/graphql/generated/graphql.ts";

export const OrdersPage = () => {
  const { loading, error, data } = useOrdersQuery();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading orders</div>;
  const orders =
    data?.orders?.flatMap((item) => {
      return {
        id: item.id,
        items: item.cartItems?.map((option) => ({
          configuration: option.partOptions.reduce((acc, part) => {
            return `${acc}${part.partCategory?.name}: ${part.name}\n`;
          }, ""),
          productName: option?.product?.name,
          productType: option?.product?.productType?.name,
          price: option?.totalPrice,
        })),
      };
    }) ?? [];

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight pt-3 pb-3">Orders</h1>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Product Type</TableHead>
              <TableHead>Configuration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) =>
              order.items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.productType}</TableCell>
                  <TableCell>
                    <ScrollArea maxHeight="100px">
                      {item.configuration}
                    </ScrollArea>
                  </TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon" asChild>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )),
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
