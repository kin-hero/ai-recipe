import { auth } from "@clerk/nextjs/server";
import { recipeBodyRequestSchema } from "@/lib/validations/recipe";
import { dynamoDB, TABLES } from "@/lib/db/dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { getRecipeCount } from "@/lib/db/recipe";
import { checkRateLimit, generateRecord } from "@/lib/db/rateLimit";
import { generateRecipe } from "@/lib/ai/openrouter";
import { env } from "@/config/env";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    // 1. Auth check
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse & validate request body
    const body = await req.json();
    const validated = recipeBodyRequestSchema.safeParse(body);
    if (!validated.success) {
      return Response.json({ error: "Invalid request body" }, { status: 400 });
    }

    // 3. Check recipe quota
    const count = await getRecipeCount(userId);
    if (count >= env.MAX_RECIPES_PER_USER) {
      return Response.json({ error: "Recipe quota exceeded" }, { status: 403 });
    }

    // 4. Check rate limit (
    const canGenerate = await checkRateLimit(userId);
    if (!canGenerate) {
      return Response.json({ error: "Rate limited. Please wait 30 minutes." }, { status: 429 });
    }

    // 5. Generate recipe with AI
    const aiRecipe = await generateRecipe(validated.data);

    // 6. Add system field
    const completeRecipe = {
      ...aiRecipe,
      userId,
      recipeId: uuidv4(),
      createdAt: new Date().toISOString(),
    };

    // 7. Save to DynamoDB
    await dynamoDB.send(
      new PutCommand({
        TableName: TABLES.RECIPES,
        Item: completeRecipe,
      })
    );
    // 8. Generate the rate limit window
    await generateRecord(userId);

    // 9. Return the recipe
    return Response.json({ recipe: completeRecipe }, { status: 201 });
  } catch (error) {
    console.error("Recipe generation error:", error);
    return Response.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
}
