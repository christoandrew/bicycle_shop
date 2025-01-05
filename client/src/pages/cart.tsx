import React from "react";
import { CreditCard, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useCheckoutCartMutation,
  useGetCartQuery,
} from "@/graphql/generated/graphql.ts";
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

const CheckoutAlertDialog = (
  trigger: React.ReactNode,
  onCheckout: () => void,
) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you ready to checkout?</AlertDialogTitle>
          <AlertDialogDescription>
            Please review your order before proceeding to checkout.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onCheckout}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export function CartPage() {
  const sessionId = localStorage.getItem("session_id");
  const [checkoutCart] = useCheckoutCartMutation();
  const handleCheckout = async () => {
    try {
      await checkoutCart({
        variables: {
          sessionId: sessionId as string,
        },
        onError: (error) => {
          console.error("Error checking out cart:", error);
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
  const {
    loading: loadingCart,
    error: errorCart,
    data: cartData,
  } = useGetCartQuery({
    variables: {
      sessionId: sessionId as string,
    },
  });

  if (loadingCart) return <div>Loading...</div>;
  if (errorCart) return <div>Error loading cart</div>;

  const cartItems =
    cartData?.cart?.cartItems?.map((item) => {
      return {
        id: item.id,
        productName: item.product?.name,
        productSelection: item.partOptions.map((option) => ({
          partCategory: option.partCategory?.name,
          name: option.name,
          price: option?.price,
        })),
        totalPrice: item.totalPrice,
        quantity: item.quantity,
      };
    }) ?? [];
  // const updateQuantity = (itemId: number, newQuantity: number) => {
  //   setCartItems(
  //     cartItems.map((item) =>
  //       item.id === itemId ? { ...item, quantity: newQuantity } : item,
  //     ),
  //   );
  // };

  // const removeItem = (itemId: number) => {
  //   setCartItems(cartItems.filter((item) => item.id !== itemId));
  // };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.totalPrice * item.quantity,
      0,
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="text-center py-16">
          <CardContent className="space-y-6">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
            <div>
              <h2 className="text-2xl font-semibold">Your cart is empty</h2>
              <p className="text-muted-foreground mt-2">
                Looks like you haven't added any items to your cart yet.
              </p>
            </div>
            <Button className="mt-4">Continue Shopping</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shopping Cart ({cartItems.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Configurations</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="font-medium">
                                {item.productName}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {item.productSelection.map((selection, index) => (
                              <div
                                key={index}
                                className="text-sm text-muted-foreground"
                              >
                                {selection.partCategory}: {selection.name}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{formatPrice(item.totalPrice)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Select
                              disabled={true}
                              value={item.quantity.toString()}
                              onValueChange={(value) =>
                                updateQuantity(item.id, parseInt(value))
                              }
                            >
                              <SelectTrigger className="w-16">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((num) => (
                                  <SelectItem key={num} value={num.toString()}>
                                    {num}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(item.totalPrice * item.quantity)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  {formatPrice(calculateSubtotal())}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span className="font-medium">
                  {formatPrice(calculateTax())}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
            </CardContent>
            <CardFooter>
              {CheckoutAlertDialog(
                <Button className="w-full" size="lg">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Checkout
                </Button>,
                handleCheckout,
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
