"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { RecipeResponse } from "@/types/recipe";
import Spinner from "@/components/Spinner";

export default function RecipeGrid() {
  const { userId } = useAuth();
  const [recipes, setRecipes] = useState<RecipeResponse[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<RecipeResponse[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recipes from API
  useEffect(() => {
    if (!userId) return;

    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/recipes");

        if (!response.ok) {
          throw new Error("Failed to fetch recipes");
        }

        const data = await response.json();
        setRecipes(data.recipes);
        setFilteredRecipes(data.recipes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [userId]);

  // Filter recipes by cuisine
  useEffect(() => {
    if (selectedCuisine === "All") {
      setFilteredRecipes(recipes);
    } else {
      setFilteredRecipes(
        recipes.filter((recipe) => recipe.cuisine.toLowerCase() === selectedCuisine.toLowerCase())
      );
    }
  }, [selectedCuisine, recipes]);

  // Extract unique cuisines from recipes
  const cuisines = ["All", ...Array.from(new Set(recipes.map((r) => r.cuisine)))];

  // Format time display
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">My Recipes</h1>
        <p className="text-muted">
          {loading ? "Loading..." : `${recipes.length} recipe${recipes.length !== 1 ? "s" : ""} generated`}
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Filter Buttons - Only show if we have recipes */}
      {!loading && recipes.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          {cuisines.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => setSelectedCuisine(cuisine)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCuisine === cuisine
                  ? "bg-primary text-white"
                  : "bg-card text-muted hover:bg-primary hover:text-white"
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Spinner size={48} />
          <div className="text-muted">Loading your recipes...</div>
        </div>
      )}

      {/* Recipe Grid */}
      {!loading && filteredRecipes.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Link
              key={recipe.recipeId}
              href={`/recipes/${recipe.recipeId}`}
              className="bg-card rounded-(--radius-lg) p-6 border border-primary/20 hover:border-primary/50 transition cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{recipe.title}</h3>
                  <span className="text-xs text-primary px-2 py-1 rounded-full bg-primary/10">
                    {recipe.cuisine}
                  </span>
                </div>
              </div>
              <p className="text-muted text-sm mb-4 line-clamp-2">{recipe.description}</p>
              <div className="flex gap-4 text-xs text-muted">
                <span>⏱️ {formatTime(recipe.prepTime + recipe.cookTime)}</span>
                <span>
                  👨‍🍳 {recipe.servingSize} serving{recipe.servingSize !== 1 ? "s" : ""}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Empty State - Show when no recipes */}
      {!loading && recipes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">🍳</div>
          <h2 className="text-2xl font-bold mb-2">No recipes yet</h2>
          <p className="text-muted mb-6">Start creating your first AI-generated recipe!</p>
          <Link href="/recipes/create">
            <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg hover:shadow-primary/50 transition">
              Create Your First Recipe
            </button>
          </Link>
        </div>
      )}

      {/* No Results for Filter */}
      {!loading && recipes.length > 0 && filteredRecipes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">No {selectedCuisine} recipes</h2>
          <p className="text-muted mb-6">Try selecting a different cuisine filter</p>
          <button
            onClick={() => setSelectedCuisine("All")}
            className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium transition"
          >
            Show All Recipes
          </button>
        </div>
      )}
    </>
  );
}
