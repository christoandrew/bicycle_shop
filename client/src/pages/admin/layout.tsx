import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  ChevronsRightLeft,
  CircuitBoard,
  CombineIcon,
  ComponentIcon,
  Menu,
  Package,
  ShoppingCart,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigation = [
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Product Types",
    href: "/admin/product-types",
    icon: ComponentIcon,
  },
  {
    name: "Part Categories",
    href: "/admin/part-categories",
    icon: Tags,
  },
  {
    name: "Part Options",
    href: "/admin/part-options",
    icon: CombineIcon,
  },
  {
    name: "Price Rules",
    href: "/admin/price-rules",
    icon: CircuitBoard,
  },
  {
    name: "Compatibility Rules",
    href: "/admin/compatibility-rules",
    icon: ChevronsRightLeft,
  },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const NavItems = () => (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-x-3 px-3 py-2 text-sm font-medium rounded-md",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted",
            )}
            onClick={() => setOpen(false)}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen">
      {/* Mobile navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed left-4 top-4 z-40"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <NavItems />
        </SheetContent>
      </Sheet>

      {/* Desktop navigation */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r px-6 py-4">
          <div className="flex h-16 shrink-0 items-center"></div>
          <NavItems />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <main className="min-h-screen px-2 lg:px-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
