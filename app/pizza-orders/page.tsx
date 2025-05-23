"use client";

import { authClient } from "@/lib/auth-client";
import { mockPizzaOrders, PizzaOrder } from "@/lib/mockdata"; // Ensure this path is correct
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowDownUp, // For sort indicator
  ChevronDown, // For dropdown
  CircleUserRound,
  Filter, // For filter section
  ListOrdered,
  Loader2,
  LogOut,
  X, // For clearing filter
} from "lucide-react";
import { useState, useMemo, useCallback } from "react";

// Helper to get status badge styles (remains the same)
const getStatusBadgeStyle = (status: PizzaOrder["status"]) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "Preparing":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "Out for Delivery":
      return "bg-sky-100 text-sky-800 border-sky-300";
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
  const { data: session, status: authStatus } = authClient.useSession();
  const router = useRouter();

  const [orders] = useState<PizzaOrder[]>(mockPizzaOrders); // Original data

  // Sorting state
  const [sortColumn, setSortColumn] = useState<SortableColumns | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Filtering state
  const [statusFilter, setStatusFilter] = useState<PizzaOrder["status"] | "">(
    "",
  );

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email;

  const handleLogout = async () => {
    console.log("Logout action triggered. Implement authClient.signOut()");
    router.push("/login");
  };

  const handleSort = useCallback(
    (column: SortableColumns) => {
      if (sortColumn === column) {
        setSortDirection((prevDir) =>
          prevDir === "asc" ? "desc" : prevDir === "desc" ? null : "asc",
        );
        if (sortDirection === "desc") setSortColumn(null); // Reset column if going from desc to null
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

    // Apply sorting
    if (sortColumn && sortDirection) {
      processedOrders.sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];

        // Handle date sorting specifically if needed, though string comparison works for YYYY-MM-DD HH:MM
        if (sortColumn === "orderDate") {
          valA = new Date(a.orderDate).getTime();
          valB = new Date(b.orderDate).getTime();
        }

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
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

  // Loading and Unauthenticated states (restored)
  if (authStatus === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 text-slate-700">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-sky-600" />
        <p className="text-xl font-medium">Loading pizza orders...</p>
      </div>
    );
  }

  if (authStatus === "unauthenticated" || !session?.user) {
    router.push("/login");
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6 text-center text-slate-700">
        <h1 className="mb-4 text-3xl font-semibold text-red-600">
          Access Denied
        </h1>
        <p className="mb-6 text-lg">Please log in to view pizza orders.</p>
        <button
          onClick={() => router.push("/login")}
          className="rounded-md bg-sky-600 px-6 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      {/* Header (same as before) */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="group flex items-center rounded-md p-2 text-sm font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft className="h-5 w-5 text-slate-500 group-hover:text-slate-700" />
              </button>
              <div className="flex items-center">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="Avatar"
                    className="h-9 w-9 rounded-full"
                  />
                ) : (
                  <CircleUserRound className="h-9 w-9 text-slate-500" />
                )}
                <div className="ml-2.5">
                  <p className="truncate text-xs font-medium text-slate-800 sm:text-sm">
                    {userName}
                  </p>
                  {userEmail && (
                    <p className="truncate text-xs text-slate-500">
                      {userEmail}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
            >
              <LogOut className="mr-1.5 h-5 w-5 text-slate-500 group-hover:text-slate-700 sm:mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="flex items-center text-2xl font-semibold text-slate-800 sm:text-3xl">
              <ListOrdered className="mr-3 h-7 w-7 text-sky-600" />
              Pizza Orders
            </h1>
          </div>

          {/* Filters Section */}
          <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 shadow">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label
                  htmlFor="status-filter"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  <Filter className="mr-1 inline h-4 w-4" />
                  Filter by Status
                </label>
                <div className="relative">
                  <select
                    id="status-filter"
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as PizzaOrder["status"] | "",
                      )
                    }
                    className="block w-full appearance-none rounded-md border-slate-300 py-2 pl-3 pr-10 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm"
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
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
              {statusFilter && (
                <button
                  onClick={() => setStatusFilter("")}
                  className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1"
                >
                  <X className="mr-1.5 h-4 w-4" /> Clear Filter
                </button>
              )}
            </div>
          </div>

          {/* Responsive Table Container */}
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {tableHeaders.map((header) => (
                      <th
                        key={header.key}
                        scope="col"
                        className={`px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 sm:px-6 ${
                          header.sortable
                            ? "cursor-pointer hover:bg-slate-200"
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
                              className={`ml-1.5 h-4 w-4 ${
                                sortColumn === header.sortable && sortDirection
                                  ? "text-sky-600"
                                  : "text-slate-400"
                              }`}
                            />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredAndSortedOrders.length > 0 ? (
                    filteredAndSortedOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50">
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-sky-700 sm:px-6">
                          {order.id}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-700 sm:px-6">
                          {order.customerName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 sm:px-6">
                          {order.pizzaType}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-center text-sm text-slate-600 sm:px-6">
                          {order.quantity}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600 sm:px-6">
                          {order.orderDate}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm sm:px-6">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold leading-5 ${getStatusBadgeStyle(order.status)} border`}
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
                        className="px-6 py-12 text-center text-sm text-slate-500"
                      >
                        No pizza orders match your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-slate-500">
        Pizza Orders &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default PizzaOrdersPage;
