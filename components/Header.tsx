"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ChefHatIcon from "@/components/ChefHatIcon";

export default function Header() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/recipes");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <header className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <ChefHatIcon className="w-8 h-8 text-primary" />
        <span className="text-xl font-bold">ChefGPT</span>
      </div>

      <div className="flex items-center gap-4">
        {isLoaded && !isSignedIn ? (
          <>
            <SignInButton mode="modal">
              <button className="px-6 py-2 rounded-lg text-foreground hover:bg-card transition">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium transition">
                Sign Up
              </button>
            </SignUpButton>
          </>
        ) : (
          <UserButton />
        )}
      </div>
    </header>
  );
}
