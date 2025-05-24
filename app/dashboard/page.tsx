"use client";

import { authClient } from "@/lib/auth-client"; // Using your specified auth client
import { useRouter } from "next/navigation";
import { ArrowRight, CircleUserRound, LogOut } from "lucide-react";
import Image from "next/image";

const Dashboard = () => {
  const { data } = authClient.useSession();
  const router = useRouter();

  const userName = data?.user?.name || "User";
  const userEmail = data?.user?.email; // Assuming email might be useful

  const handleNavigateToPizzaOrders = () => {
    // As per assignment: "Pizza Orders" Page accessible via a navigation link
    router.push("/pizza-orders"); // Adjust this path as needed
  };

  const handleLogout = async () => {
    // You'll need to implement the actual logout logic with your authClient
    // For example, it might be something like:
    // await authClient.signOut();
    // router.push('/login'); // Redirect to login after logout
    console.log("Logout action triggered. Implement authClient.signOut()");
    // For now, just redirecting to a hypothetical login page
    router.push("/login");
  };

  // if (status === "loading") {
  //   return (
  //     <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 text-slate-700">
  //       <Loader2 className="mb-4 h-12 w-12 animate-spin text-sky-600" />
  //       <p className="text-xl font-medium">Loading your dashboard...</p>
  //     </div>
  //   );
  // }

  // // As per assignment: "Protected Routes... Unauthenticated users ... should be redirected to the login page."
  // if (status === "unauthenticated" || !data?.user) {
  //   // It's good practice to redirect server-side if possible for protected routes,
  //   // but client-side redirect is a fallback.
  //   // router.push('/login'); // Uncomment and adjust if you want immediate redirect
  //   return (
  //     <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-6 text-center text-slate-700">
  //       <h1 className="mb-4 text-3xl font-semibold text-red-600">
  //         Access Denied
  //       </h1>
  //       <p className="mb-6 text-lg">Please log in to access the dashboard.</p>
  //       <button
  //         onClick={() => router.push("/login")} // Adjust login path
  //         className="rounded-md bg-sky-600 px-6 py-2.5 font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
  //       >
  //         Go to Login
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      {/* Header - Simple version for logout and user info */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {data?.user.image ? (
                <Image
                  src={data.user.image}
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

      {/* Main Content Area */}
      <main className="flex-grow">
        <div className="mx-auto max-w-3xl py-12 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-lg bg-white p-8 text-center shadow-lg">
            <div className="mb-8 flex justify-center">
              {data?.user.image ? (
                <Image
                  src={data.user.image}
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
