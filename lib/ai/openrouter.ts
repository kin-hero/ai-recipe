import { env } from "@/config/env";
import { AIGeneratedRecipe, RecipeBodyRequest } from "@/types/recipe";
import { aiRecipeSchema } from "@/lib/validations/recipe";

export const generateRecipe = async (body: RecipeBodyRequest): Promise<AIGeneratedRecipe> => {
  const { ingredients, cuisine } = body;
  const url = "https://openrouter.ai/api/v1/chat/completions";

  const headers = {
    Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
  };

  const payload = {
    model: `${env.OPENROUTER_LLM_MODEL}`,
    messages: [
      {
        role: "system",
        content: "You are the most creative chef in the world. You are a master of multiple cuisine. ",
      },
      {
        role: "user",
        content: `Generate a ${cuisine} recipe using these ingredients: ${ingredients.join(", ")}.

        IMPORTANT: You MUST include ALL fields in your response. Return ONLY valid JSON (no markdown, no code blocks) with this EXACT structure:
        {
          "title": "Recipe Name",
          "description": "Brief description of the recipe",
          "cuisine": "${cuisine}",
          "ingredients": [{"item": "ingredient name", "amount": "measurement"}],
          "instructions": ["step 1", "step 2", "step 3"],
          "servingSize": 4,
          "prepTime": 15,
          "cookTime": 30,
          "tags": ["easy", "quick", "healthy"]
        }

        REQUIRED FIELDS:
        - servingSize: MUST be a number (e.g., 2, 4, 6)
        - prepTime: MUST be a number in minutes (e.g., 15, 30)
        - cookTime: MUST be a number in minutes (e.g., 20, 45)
        - tags: MUST be an array of strings (e.g., ["vegetarian", "spicy"])

        Do not skip any fields. Return only the complete JSON object.`,
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const aiContent = data.choices[0].message.content;

  // Extract JSON from potential markdown code blocks or extra text
  let cleanedContent = aiContent.trim();

  // Remove markdown code blocks if present
  if (cleanedContent.startsWith("```")) {
    cleanedContent = cleanedContent.replace(/```json\n?/g, "").replace(/```\n?/g, "");
  }

  // Find the first { and last } to extract just the JSON object
  const firstBrace = cleanedContent.indexOf("{");
  const lastBrace = cleanedContent.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    console.error("AI response has no JSON object:", aiContent);
    throw new Error("AI did not return a valid JSON object");
  }

  const jsonString = cleanedContent.substring(firstBrace, lastBrace + 1);

  let recipeData;
  try {
    recipeData = JSON.parse(jsonString);
  } catch (parseError) {
    console.error("Failed to parse AI response:", jsonString);
    throw new Error(`Failed to parse AI response: ${parseError instanceof Error ? parseError.message : "Unknown error"}`);
  }

  // Add default values for missing fields (fallback safety layer)
  const recipeWithDefaults = {
    ...recipeData,
    servingSize: recipeData.servingSize ?? 4,
    prepTime: recipeData.prepTime ?? 15,
    cookTime: recipeData.cookTime ?? 30,
    tags: recipeData.tags ?? ["homemade"],
  };

  const validated = aiRecipeSchema.safeParse(recipeWithDefaults);
  if (!validated.success) {
    console.error("AI validation errors:", validated.error.issues);
    console.error("Received data:", recipeWithDefaults);
    throw new Error(`AI returned invalid recipe format: ${validated.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`);
  }

  return validated.data;
};
