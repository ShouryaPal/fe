"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // Ensure we're on the client side before doing any session checks
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle redirect only after client-side hydration
  useEffect(() => {
    if (isClient && session && !isPending) {
      router.push("/dashboard");
    }
  }, [isClient, session, isPending, router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  // Show consistent loading state during SSR and initial client load
  if (!isClient || isPending) {
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
              <div className="text-center flex flex-col items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent"></div>
                <p className="mt-2 text-slate-50">Loading...</p>
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
  }

  // If user has session after hydration, show redirect message
  if (session) {
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
              <div className="text-center flex flex-col items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-sky-600 border-t-transparent"></div>
                <p className="mt-2 text-slate-50">
                  Redirecting to dashboard...
                </p>
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
  }

  // Show login form only after client-side hydration and no session
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
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded w-full mb-4">
                {error}
              </div>
            )}
            <h1 className="text-slate-50 text-lg font-semibold font-mono">
              Signin to order yummy pizza!
            </h1>
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="min-w-60 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center">
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 mr-2"></div>
                ) : (
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                {loading ? "Signing in..." : "Continue with Google"}
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="h-10 w-full border-t flex items-center justify-between">
        <div className="mx-10 h-10 border-r" />
        <div className="mx-10 h-10 border-l" />
      </div>
    </div>
  );
}
