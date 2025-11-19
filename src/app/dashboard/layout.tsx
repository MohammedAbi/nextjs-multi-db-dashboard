"use client";

import "../../app/globals.css";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Users,
  Box,
  FileText,
  ShoppingCart,
  Package,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "HR", href: "/dashboard/hr", icon: <Users className="w-5 h-5" /> },
    {
      name: "Inventory",
      href: "/dashboard/inventory",
      icon: <Box className="w-5 h-5" />,
    },
    {
      name: "Invoicing",
      href: "/dashboard/invoicing",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      name: "Store",
      href: "/dashboard/store",
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      name: "Orders",
      href: "/dashboard/orders",
      icon: <Package className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 border-r border-gray-700 flex flex-col transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-6 p-2 rounded hover:bg-gray-700 self-end"
        >
          {collapsed ? (
            <ChevronRight className="w-6 h-6 text-white" />
          ) : (
            <ChevronLeft className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Logo */}
        {!collapsed && (
          <Link
            href="/"
            className="font-bold text-white mb-10 hover:text-blue-400 transition text-2xl px-4"
          >
            Multi-Database Dashboard
          </Link>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-2 px-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition
                ${collapsed ? "justify-center p-2" : "gap-3 px-4 py-2"}
              `}
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
        </header>

        <div>{children}</div>
      </main>
    </div>
  );
}
