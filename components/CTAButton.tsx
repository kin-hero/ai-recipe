"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function CTAButton() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // If user is signed in, redirect to create page
  if (isLoaded && isSignedIn) {
    return (
      <button
        onClick={() => router.push("/recipes/create")}
        className="px-8 py-4 rounded-lg bg-linear-to-r from-primary to-secondary text-white font-bold text-lg hover:shadow-lg hover:shadow-primary/50 transition"
      >
        Start Cooking with AI
      </button>
    );
  }

  // If user is not signed in, show sign-in modal
  return (
    <SignInButton mode="modal">
      <button className="px-8 py-4 rounded-lg bg-linear-to-r from-primary to-secondary text-white font-bold text-lg hover:shadow-lg hover:shadow-primary/50 transition">
        Start Cooking with AI
      </button>
    </SignInButton>
  );
}
