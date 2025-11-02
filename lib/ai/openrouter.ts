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
        Return ONLY valid JSON (no markdown, no code blocks) with this structure:
        {
          "title": "Recipe Name",
          "cuisine": "${cuisine}",
          "ingredients": [{"item": "ingredient name", "amount": "measurement"}],
          "instructions": ["step 1", "step 2", ...],
          "servingSize": number,
          "prepTime": number (in minutes),
          "cookTime": number (in minutes),
          "tags": ["tag1", "tag2"]
        }
        Do not include anything else. Return only the JSON object.`,
      },
    ],
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  const aiContent = data.choices[0].message.content;
  const recipeData = JSON.parse(aiContent);

  const validated = aiRecipeSchema.safeParse(recipeData);
  if (!validated.success) {
    throw new Error("AI returned invalid recipe format");
  }

  return validated.data;
};
