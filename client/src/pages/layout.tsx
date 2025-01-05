import { Outlet } from "react-router";
import Header from "@/components/layout/header.tsx";

export const Layout = () => {
  return (
    <div className="bg-gray-50">
      <div className="flex flex-1 flex-col ">
        <div>
          <Header />
          <Outlet />
        </div>
      </div>
    </div>
  );
};
