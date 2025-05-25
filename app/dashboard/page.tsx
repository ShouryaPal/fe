// app/dashboard/page.tsx
"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ArrowRight, CircleUserRound, LogOut } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";
import React from "react";

const LoadingSpinner = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="text-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent"></div>
      <p className="mt-2 text-slate-600">Loading session...</p>
    </div>
  </div>
);

const DashboardContent = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (!session) {
    // Redirect and show loading state
    router.push("/");
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent"></div>
          <p className="mt-2 text-slate-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  const userName = session.user?.name || "User";
  const userEmail = session.user?.email;
  const userImage = session.user?.image;

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
    <div className="h-screen flex flex-col">
      <div className="h-10 w-full border-b flex items-center justify-between">
        <div className="mx-10 h-10 border-r" />
        <div className="mx-10 h-10 border-l" />
      </div>

      <div className="flex-1 mx-10 flex">
        <div
          className="w-full border-x grid lg:grid-cols-[1.618fr_minmax(0,1fr)]"
          style={{ height: "100%" }}
        >
          <div className="hidden border-r lg:flex items-center justify-center h-full bg-gradient-to-br from-amber-700 to-orange-400">
            <h1 className="text-[200px] -rotate-75">🍕</h1>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 p-4">
            <div className="flex flex-col items-center gap-4 text-center">
              {userImage ? (
                <Image
                  src={userImage}
                  alt={`${userName}'s profile`}
                  width={96}
                  height={96}
                  className="rounded-full border-4 border-orange-500 shadow-lg"
                />
              ) : (
                <CircleUserRound className="h-24 w-24 text-slate-400" />
              )}
              <h1 className="text-4xl font-extrabold text-white">
                Welcome, {userName} 👋
              </h1>
              {userEmail && (
                <p className="text-lg text-slate-400">{userEmail}</p>
              )}
            </div>

            <div className="flex flex-col gap-4 w-full max-w-sm">
              <button
                onClick={handleNavigateToPizzaOrders}
                className="group flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                Order Yummy Pizza!
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleLogout}
                className="group flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200 ease-in-out transform hover:scale-105"
              >
                Log Out
                <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-10 w-full border-t flex items-center justify-between">
        <div className="mx-10 h-10 border-r" />
        <div className="mx-10 h-10 border-l" />
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardContent />
    </Suspense>
  );
};

export default Dashboard;
