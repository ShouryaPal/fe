// app/dashboard/page.tsx
"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleUserRound, LogOut } from "lucide-react";
import Image from "next/image";
// No need for useEffect redirect here if layout.tsx handles it

const Dashboard = () => {
  // Use session directly; the layout ensures it's present or redirects
  // isPending can still be useful if the session can refresh or change client-side
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  // If the server-side layout handles redirection,
  // this client-side check is less critical for initial load,
  // but good for subsequent client-side navigation or session changes.
  // It's a fallback if `authClient.useSession()` somehow loses session client-side.
  if (!session && !isPending) {
    router.push("/");
    return null; // Don't render until redirected or session loads
  }

  // Still show loading state if isPending is true after hydration (e.g., re-fetching)
  // This is for cases where session data is being refreshed, not the initial check
  if (isPending || !session) {
    // Added !session for safety
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent"></div>
          <p className="mt-2 text-slate-600">Loading session...</p>
        </div>
      </div>
    );
  }

  const userName = session.user?.name || "User";
  const userEmail = session.user?.email;

  const handleNavigateToPizzaOrders = () => {
    router.push("/pizza-orders");
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <CircleUserRound className="h-10 w-10 text-slate-500" />
              )}
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-800">{userName}</p>
                {userEmail && (
                  <p className="text-xs text-slate-500">{userEmail}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              <LogOut className="mr-2 h-5 w-5 text-slate-500 group-hover:text-slate-700" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="mx-auto max-w-3xl py-12 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-lg bg-white p-8 text-center shadow-lg">
            <div className="mb-8 flex justify-center">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt="User Avatar"
                  width={112}
                  height={112}
                  className="h-28 w-28 rounded-full border-4 border-slate-200 object-cover"
                />
              ) : (
                <CircleUserRound
                  className="h-28 w-28 text-slate-400"
                  strokeWidth={1.5}
                />
              )}
            </div>

            <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
              Hello, <span className="text-sky-600">{userName}!</span>
            </h1>
            <p className="mb-10 text-lg text-slate-600">
              Welcome to your dashboard. Ready to manage your pizza orders?
            </p>

            <button
              onClick={handleNavigateToPizzaOrders}
              className="group inline-flex items-center justify-center rounded-lg bg-sky-600 px-8 py-3 text-base font-semibold text-white shadow-md transition-colors duration-150 ease-in-out hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 active:bg-sky-800"
            >
              View Pizza Orders
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-slate-500">
        Frontend AI Engineer Assignment &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default Dashboard;
