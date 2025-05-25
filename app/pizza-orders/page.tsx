// app/dashboard/page.tsx
"use client";

import { authClient } from "@/lib/auth-client";
import { mockPizzaOrders, PizzaOrder } from "@/lib/mockdata";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowDownUp,
  ChevronDown,
  CircleUserRound,
  Filter,
  LogOut,
  X,
  Pizza,
  History,
} from "lucide-react";
import { useState, useMemo, useCallback } from "react";

// Helper to get status badge styles with improved colors
const getStatusBadgeStyle = (status: PizzaOrder["status"]) => {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "Preparing":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "Out for Delivery":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Delivered":
      return "bg-green-100 text-green-800 border-green-300";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-slate-100 text-slate-800 border-slate-300";
  }
};

type SortableColumns = "id" | "orderDate";
type SortDirection = "asc" | "desc" | null;

const PizzaOrdersPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [orders] = useState<PizzaOrder[]>(mockPizzaOrders); // Original data

  const [sortColumn, setSortColumn] = useState<SortableColumns | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [statusFilter, setStatusFilter] = useState<PizzaOrder["status"] | "">(
    "",
  );
  const userImage = session?.user?.image;

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleSort = useCallback(
    (column: SortableColumns) => {
      if (sortColumn === column) {
        setSortDirection((prevDir) =>
          prevDir === "asc" ? "desc" : prevDir === "desc" ? null : "asc",
        );
        if (sortDirection === "desc") setSortColumn(null);
      } else {
        setSortColumn(column);
        setSortDirection("asc");
      }
    },
    [sortColumn, sortDirection],
  );

  const filteredAndSortedOrders = useMemo(() => {
    let processedOrders = [...orders];

    // Apply filtering
    if (statusFilter) {
      processedOrders = processedOrders.filter(
        (order) => order.status === statusFilter,
      );
    }

    if (sortColumn && sortDirection) {
      processedOrders.sort((a, b) => {
        let comparableValueA: string | number;
        let comparableValueB: string | number;

        if (sortColumn === "orderDate") {
          comparableValueA = new Date(a.orderDate).getTime();
          comparableValueB = new Date(b.orderDate).getTime();
        } else {
          comparableValueA = a[sortColumn];
          comparableValueB = b[sortColumn];
        }

        if (comparableValueA < comparableValueB) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (comparableValueA > comparableValueB) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return processedOrders;
  }, [orders, statusFilter, sortColumn, sortDirection]);

  const tableHeaders: {
    key: string;
    label: string;
    sortable?: SortableColumns;
  }[] = [
    { key: "id", label: "Order ID", sortable: "id" },
    { key: "customerName", label: "Customer Name" },
    { key: "pizzaType", label: "Pizza Type" },
    { key: "quantity", label: "Quantity" },
    { key: "orderDate", label: "Order Date", sortable: "orderDate" },
    { key: "status", label: "Status" },
  ];

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent"></div>
          <p className="mt-2 text-slate-50">Loading pizza orders...</p>{" "}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col font-[family-name:var(--font-geist-sans)] ">
      <div className="h-10 w-full border-b  flex items-center justify-between">
        <div className="mx-10 h-10 border-r " />
        <div className="mx-10 h-10 border-l " />
      </div>

      <div className="flex-1 mx-10 flex">
        <div
          className="w-full border-x  flex flex-col bg-gradient-to-b from-orange-50 to-white"
          style={{ height: "100%" }}
        >
          <header className="flex items-center justify-between border-b border-orange-200 bg-gradient-to-r from-orange-100 to-amber-50 p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/dashboard")}
                className="group flex items-center rounded-md p-1 text-sm font-medium text-orange-600 hover:bg-orange-200 hover:text-orange-800 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:ring-offset-1"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft className="h-4 w-4 group-hover:text-orange-800" />
              </button>
              <h1 className="flex items-center text-base font-semibold text-amber-800">
                <History className="mr-1.5 h-4 w-4 text-orange-600" />
                Order History
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center mr-1">
                {userImage ? (
                  <Image
                    src={userImage}
                    alt="Avatar"
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full border border-orange-500"
                  />
                ) : (
                  <CircleUserRound className="h-6 w-6 text-orange-500" />
                )}
              </div>
              <button
                onClick={handleLogout}
                className="group flex items-center rounded-md px-1.5 py-1 text-xs font-medium text-red-600 hover:bg-red-200 hover:text-red-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-1"
              >
                <LogOut className="h-3.5 w-3.5 group-hover:text-red-700" />
              </button>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <Pizza className="mr-1 h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-amber-800">
                  {filteredAndSortedOrders.length} Orders
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-40">
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as PizzaOrder["status"] | "",
                      )
                    }
                    className="block w-full appearance-none rounded-md border-orange-300 py-1 pl-7 pr-7 text-sm shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                  >
                    <option value="">All Statuses</option>
                    {[
                      "Pending",
                      "Preparing",
                      "Out for Delivery",
                      "Delivered",
                      "Cancelled",
                    ].map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-600" />{" "}
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-400" />{" "}
                </div>
                {statusFilter && (
                  <button
                    onClick={() => setStatusFilter("")}
                    className="inline-flex items-center rounded-md border border-orange-300 bg-white px-2 py-1 text-sm font-medium text-orange-700 shadow-sm hover:bg-orange-50 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:ring-offset-1"
                  >
                    <X className="mr-1 h-4 w-4 text-orange-500" /> Clear{" "}
                  </button>
                )}
              </div>
            </div>
            <div className="h-[calc(100%-60px)] overflow-hidden rounded border border-orange-200 bg-white shadow-sm">
              <div className="h-full overflow-auto">
                <table className="min-w-full table-fixed divide-y divide-orange-100">
                  <thead className="sticky top-0 z-10 bg-gradient-to-r from-orange-50 to-amber-50">
                    <tr>
                      {tableHeaders.map((header) => (
                        <th
                          key={header.key}
                          scope="col"
                          className={`px-3 py-2 text-left text-xs font-medium uppercase tracking-wider text-amber-800 ${
                            header.sortable
                              ? "cursor-pointer hover:bg-orange-100"
                              : ""
                          }`}
                          onClick={
                            header.sortable
                              ? () => handleSort(header.sortable!)
                              : undefined
                          }
                        >
                          <div className="flex items-center">
                            {header.label}
                            {header.sortable && (
                              <ArrowDownUp
                                className={`ml-1 h-4 w-4 ${
                                  sortColumn === header.sortable &&
                                  sortDirection
                                    ? "text-orange-600"
                                    : "text-orange-400"
                                }`}
                              />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-orange-50 bg-white">
                    {filteredAndSortedOrders.length > 0 ? (
                      filteredAndSortedOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="hover:bg-orange-50/50 even:bg-orange-5"
                        >
                          <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-orange-700">
                            {order.id}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm text-slate-700">
                            {order.customerName}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-amber-700">
                            {order.pizzaType}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-center text-sm text-slate-600">
                            {order.quantity}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm text-slate-600">
                            {order.orderDate}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2 text-sm">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium leading-none ${getStatusBadgeStyle(order.status)} shadow-sm`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={tableHeaders.length}
                          className="p-4 text-center text-sm text-slate-500"
                        >
                          No pizza orders match your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      <div className="h-10 w-full border-t  flex items-center justify-between">
        <div className="mx-10 h-10 border-r " />
        <div className="mx-10 h-10 border-l " />
      </div>
    </div>
  );
};

export default PizzaOrdersPage;
