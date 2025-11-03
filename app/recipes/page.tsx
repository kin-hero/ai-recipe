import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import RecipeGrid from "@/components/RecipeGrid";
import Footer from "@/components/Footer";
import ChefHatIcon from "@/components/ChefHatIcon";

export default async function RecipesDashboard() {
  const { userId } = await auth();

  // Redirect to landing page if not authenticated
  if (!userId) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-card">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/recipes" className="flex items-center gap-2">
            <ChefHatIcon className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold">ChefGPT</span>
          </Link>

          <Link
            href="/recipes/create"
            className="px-4 sm:px-6 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium transition text-sm sm:text-base"
          >
            Create Recipe
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12 max-w-7xl mx-auto">
        <RecipeGrid />
      </main>

      <Footer />
    </div>
  );
}
