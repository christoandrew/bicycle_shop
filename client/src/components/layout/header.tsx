import { useState } from "react";
import { Link } from "react-router";
import { Menu, ShoppingCart, X } from "lucide-react";
import {
  ProductTypeDefinition,
  useGetCartQuery,
  useGetProductTypesQuery,
} from "@/graphql/generated/graphql";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const sessionId = localStorage.getItem("session_id");
  const {
    loading: loadingCart,
    error: errorCart,
    data: dataCart,
  } = useGetCartQuery({
    variables: {
      sessionId: sessionId as string,
    },
  });
  const { loading, error, data } = useGetProductTypesQuery({
    variables: {
      active: true,
    },
  });
  const productTypes = data?.productTypes as ProductTypeDefinition[];

  if (loading || loadingCart) return <div>Loading...</div>;
  if (error || errorCart) return <div>Error loading navigation</div>;

  const cartItems =
    dataCart?.cart?.cartItems?.map((item) => ({
      id: item.id,
      product: item.product?.name,
      productType: item.product?.productType?.name,
      quantity: item.quantity,
      totalPrice: item.totalPrice,
    })) ?? [];

  return (
    <header className="pl-8 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">
            Marcus's Shop
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="hidden w-full flex-1 md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {productTypes.map((productType) => (
                  <NavigationMenuItem key={productType.id}>
                    <Link
                      to={`/products/${productType.code.toLowerCase()}`}
                      className={navigationMenuTriggerStyle()}
                    >
                      {productType.name}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center space-x-4">
            {/* Shopping Cart Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(!isCartOpen)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Open Cart</span>
              </Button>
              {isCartOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-white shadow-lg">
                  <div className="p-4">
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between py-2 border-b"
                        >
                          <div>
                            <p className="text-md font-medium">
                              {item?.product}
                            </p>
                            <p className="text-sm text-gray-500 font-bold">
                              ${item.totalPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        Your cart is empty.
                      </p>
                    )}
                    <p className="font-medium mt-3">
                      Total: $
                      {cartItems.length > 0 && dataCart?.cart?.totalPrice}
                    </p>
                  </div>
                  <div className="p-4">
                    <Button asChild>
                      <Link to="/cart">Go to Cart</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Button */}
            <Button variant="outline" asChild className="mr-2">
              <Link to="/admin">Admin</Link>
            </Button>
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="container md:hidden">
          <nav className="flex flex-col space-y-4 py-4">
            {productTypes.map((productType) => (
              <Link
                key={productType.id}
                to={`/products/${productType.code.toLowerCase()}`}
                className="text-sm font-medium hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {productType.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
