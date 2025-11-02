"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RecipeResponse } from "@/types/recipe";
import Spinner from "@/components/Spinner";

type RecipeRouteParams = {
  params: Promise<{ id: string }>;
};

export default function RecipeDetailPage({ params }: RecipeRouteParams) {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Unwrap params Promise
  const { id } = use(params);

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/");
    }
  }, [isLoaded, userId, router]);

  // Fetch recipe
  useEffect(() => {
    if (!userId || !id) return;

    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/recipes/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Recipe not found");
          } else {
            throw new Error("Failed to fetch recipe");
          }
          return;
        }

        const data = await response.json();
        setRecipe(data.recipe);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [userId, id]);

  if (!isLoaded || !userId) {
    return null;
  }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 py-4 border-b border-card">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/recipes" className="flex items-center gap-2">
            <span className="text-primary text-2xl">🔥</span>
            <span className="text-xl font-bold">ChefGPT</span>
          </Link>

          <Link href="/recipes" className="px-4 sm:px-6 py-2 rounded-lg border border-primary/20 hover:bg-card text-foreground font-medium transition text-sm sm:text-base">
            Back to Recipes
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12 max-w-4xl mx-auto">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Spinner size={48} />
            <div className="text-muted">Loading recipe...</div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-2xl font-bold mb-2">{error}</h2>
            <p className="text-muted mb-6">This recipe might have been deleted or doesn&apos;t exist</p>
            <Link href="/recipes">
              <button className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium transition">Back to Recipes</button>
            </Link>
          </div>
        )}

        {/* Recipe Content */}
        {recipe && !loading && (
          <div className="bg-card rounded-(--radius-lg) p-8 sm:p-12 border border-primary/20">
            {/* Title Section */}
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold">{recipe.title}</h1>
                <span className="text-sm text-primary px-3 py-1 rounded-full bg-primary/10 whitespace-nowrap">{recipe.cuisine}</span>
              </div>
              <p className="text-muted text-lg">{recipe.description}</p>
            </div>

            {/* Recipe Meta */}
            <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-primary/20">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱️</span>
                <div>
                  <div className="text-xs text-muted">Total Time</div>
                  <div className="font-semibold">{formatTime(recipe.prepTime + recipe.cookTime)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">👨‍🍳</span>
                <div>
                  <div className="text-xs text-muted">Servings</div>
                  <div className="font-semibold">
                    {recipe.servingSize} {recipe.servingSize === 1 ? "serving" : "servings"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔪</span>
                <div>
                  <div className="text-xs text-muted">Prep Time</div>
                  <div className="font-semibold">{formatTime(recipe.prepTime)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍳</span>
                <div>
                  <div className="text-xs text-muted">Cook Time</div>
                  <div className="font-semibold">{formatTime(recipe.cookTime)}</div>
                </div>
              </div>
            </div>

            {/* Ingredients Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Ingredients</h2>
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-primary mt-1 text-lg">•</span>
                    <div className="flex-1 text-base">
                      <span className="font-semibold text-foreground">{ingredient.amount}</span>
                      <span className="text-foreground/80 ml-2">{ingredient.item}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Instructions</h2>
              <div className="space-y-5">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-base">{index + 1}</span>
                    <p className="flex-1 pt-1.5 text-base leading-relaxed text-foreground/90">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Section */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mb-8 pb-8 border-b border-primary/20">
                <h2 className="text-xl font-bold mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-sm text-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Delete Button */}
            <div className="flex justify-end">
              <button className="px-6 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-medium transition">Delete Recipe</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
