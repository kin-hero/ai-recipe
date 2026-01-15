"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Spinner from "@/components/Spinner";
import ChefHatIcon from "@/components/ChefHatIcon";
import { MAX_INGREDIENTS } from "@/lib/constants";

const CUISINES = [
  { name: "Any", icon: "🌍" },
  { name: "Italian", icon: "🇮🇹" },
  { name: "Mexican", icon: "🇲🇽" },
  { name: "American", icon: "🇺🇸" },
  { name: "Japanese", icon: "🇯🇵" },
  { name: "Chinese", icon: "🇨🇳" },
  { name: "Indian", icon: "🇮🇳" },
  { name: "French", icon: "🇫🇷" },
];

export default function CreateRecipePage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<string>("Any");
  const [quota, setQuota] = useState<{ used: number; max: number } | null>(null);
  const [loadingQuota, setLoadingQuota] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/");
    }
  }, [isLoaded, userId, router]);

  // Fetch user quota
  useEffect(() => {
    if (!userId) return;

    const fetchQuota = async () => {
      try {
        const response = await fetch("/api/user/quota");
        if (response.ok) {
          const data = await response.json();
          setQuota(data);
        }
      } catch (err) {
        console.error("Failed to fetch quota:", err);
      } finally {
        setLoadingQuota(false);
      }
    };

    fetchQuota();
  }, [userId]);

  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (trimmed && !ingredients.includes(trimmed) && ingredients.length < MAX_INGREDIENTS) {
      setIngredients([...ingredients, trimmed]);
      setIngredientInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      setError("Please add at least one ingredient");
      return;
    }

    if (!quota || quota.used >= quota.max) {
      setError("You've reached your recipe limit");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/recipes/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          cuisine: selectedCuisine,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate recipe");
      }

      // Redirect to the newly created recipe
      router.push(`/recipes`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setGenerating(false);
    }
  };

  const recipesRemaining = quota ? quota.max - quota.used : 0;
  const quotaPercentage = quota ? (recipesRemaining / quota.max) * 100 : 0;

  if (!isLoaded || !userId) {
    return null;
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

          <Link href="/recipes" className="px-4 sm:px-6 py-2 rounded-lg border border-primary/20 hover:bg-card text-foreground font-medium transition text-sm sm:text-base">
            Back to Recipes
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-12 max-w-3xl mx-auto">
        <div className="bg-card rounded-(--radius-lg) p-4 sm:p-8 lg:p-12 border border-primary/20">
          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <ChefHatIcon className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Ignite Your Next Recipe</h1>
            <p className="text-muted">Tell us what you have, and our AI chef will whip up something amazing.</p>
          </div>

          {/* Quota Display */}
          {loadingQuota ? (
            <div className="mb-8 text-center text-muted">Loading quota...</div>
          ) : quota ? (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">
                  {recipesRemaining}/{quota.max} recipes remaining
                </span>
              </div>
              <div className="w-full h-3 bg-background/60 border border-muted/20 rounded-full overflow-hidden">
                <div className="h-full bg-linear-to-r from-secondary via-primary to-red-600 transition-all duration-300 shadow-sm" style={{ width: `${quotaPercentage}%` }} />
              </div>
            </div>
          ) : null}

          {/* Error Display */}
          {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>}

          {/* Ingredients Input */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-3">What&apos;s in your pantry?</label>
            <p className="text-sm text-muted mb-3">💡 Add ingredients one at a time. Type an ingredient and press Enter or click the + button.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type one ingredient (e.g., chicken)"
                disabled={generating || ingredients.length >= MAX_INGREDIENTS}
                className="flex-1 px-4 py-3 bg-background border border-muted/30 rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition"
              />
              <button
                onClick={handleAddIngredient}
                disabled={!ingredientInput.trim() || generating || ingredients.length >= MAX_INGREDIENTS}
                className="px-6 py-3 bg-primary/20 hover:bg-primary/30 border border-primary/40 rounded-lg font-bold text-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
                title="Add ingredient (or press Enter)"
              >
                + Add
              </button>
            </div>
            <p className="text-xs text-muted mt-2">{ingredients.length}/{MAX_INGREDIENTS} ingredients added</p>

            {/* Ingredient Tags */}
            {ingredients.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {ingredients.map((ingredient) => (
                  <div key={ingredient} className="flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/30 rounded-lg text-sm">
                    <span>{ingredient}</span>
                    <button onClick={() => handleRemoveIngredient(ingredient)} disabled={generating} className="text-primary hover:text-primary-hover transition disabled:opacity-50">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cuisine Selection */}
          <div className="mb-8">
            <label className="block text-lg font-semibold mb-3">Choose a Cuisine</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {CUISINES.map((cuisine) => (
                <button
                  key={cuisine.name}
                  onClick={() => setSelectedCuisine(cuisine.name)}
                  disabled={generating}
                  className={`p-4 rounded-lg border-2 transition ${
                    selectedCuisine === cuisine.name ? "bg-primary/20 border-primary" : "bg-card border-primary/20 hover:border-primary/50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="text-3xl mb-2">{cuisine.icon}</div>
                  <div className="font-medium">{cuisine.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerateRecipe}
            disabled={generating || ingredients.length === 0 || !quota || quota.used >= quota.max}
            className="w-full py-4 bg-linear-to-r from-secondary to-primary hover:shadow-lg hover:shadow-primary/50 rounded-lg text-white font-bold text-lg transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <Spinner size={24} />
                <span>Generating Recipe...</span>
              </>
            ) : (
              <>
                <span>✨</span>
                <span>Generate Recipe</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
