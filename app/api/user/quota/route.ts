import { auth } from "@clerk/nextjs/server";
import { getRecipeCount } from "@/lib/db/recipe";
import { env } from "@/config/env";

export async function GET() {
  // 1. Auth check
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Business logic
  const count = await getRecipeCount(userId);
  const canGenerateNewRecipe = count < env.MAX_RECIPES_PER_USER;

  // 3. Return Response.json()
  return Response.json({
    used: count,
    max: env.MAX_RECIPES_PER_USER,
    canGenerate: canGenerateNewRecipe,
  });
}
