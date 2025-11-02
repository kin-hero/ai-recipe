import { auth } from "@clerk/nextjs/server";
import { getRecipeCount } from "@/lib/db/recipe";
import { NUMBER_OF_RECIPES_PER_USER } from "@/constant";

export async function GET() {
  // 1. Auth check
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Business logic
  const count = await getRecipeCount(userId);
  const canGenerateNewRecipe = count < NUMBER_OF_RECIPES_PER_USER;

  // 3. Return Response.json()
  return Response.json({
    used: count,
    max: NUMBER_OF_RECIPES_PER_USER,
    canGenerate: canGenerateNewRecipe,
  });
}
