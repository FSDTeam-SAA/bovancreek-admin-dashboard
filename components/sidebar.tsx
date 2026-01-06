"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Car,
  Route,
  CreditCard,
  LogOut,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Image from "next/image";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Passenger Bookings", icon: Users, href: "/dashboard/bookings" },
  { label: "Vehicle List", icon: Car, href: "/dashboard/vehicles" },
  { label: "Driver List", icon: UserCircle, href: "/dashboard/drivers" },
  { label: "Routes", icon: Route, href: "/dashboard/routes" },
  { label: "Parents List", icon: Users, href: "/dashboard/parents" },
  { label: "Payment History", icon: CreditCard, href: "/dashboard/payments" },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: "/auth/login" });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      {/* Mobile Toggle Button - Styled better for visibility */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-sm"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

      {/* Sidebar Container */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out z-40 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header/Logo Section */}
        <div className="h-24 flex items-center justify-center border-b px-6 shrink-0">
          <Link href="/dashboard" className="relative w-full h-16">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              priority
              className="object-contain"
            />
          </Link>
        </div>

        {/* Navigation - Uses flex-grow to push logout to bottom */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 custom-scrollbar">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={18} className={isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer/Logout Section */}
        <div className="p-4 border-t bg-gray-50/50">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                <span className="font-medium text-sm">Logout</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <div className="space-y-2">
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to end your session?
                </AlertDialogDescription>
              </div>
              <div className="flex gap-3 justify-end mt-4">
                <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                >
                  Logout
                </AlertDialogAction>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </aside>

      {/* Mobile Backdrop - Smooth fade */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}