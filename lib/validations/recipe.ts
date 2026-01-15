import { z } from "zod";
import { MAX_INGREDIENTS } from "@/lib/constants";

const ingredientSchema = z.object({
  item: z.string().min(1).max(100),
  amount: z.string().min(1),
});

const recipeSchema = z.object({
  userId: z.string().min(1),
  recipeId: z.uuid({ version: "v4" }),
  description: z.string().min(1).max(500),
  title: z.string().min(1).max(100),
  cuisine: z.string().min(1).max(100),
  ingredients: z.array(ingredientSchema).min(1).max(MAX_INGREDIENTS),
  instructions: z.array(z.string()),
  servingSize: z.number().min(1),
  prepTime: z.number().min(1),
  cookTime: z.number().min(1),
  tags: z.array(z.string()),
  createdAt: z.iso.datetime(),
});

const recipeBodyRequestSchema = z.object({
  ingredients: z.array(z.string()).min(1).max(MAX_INGREDIENTS),
  cuisine: z.string().min(1).max(25),
});

const aiRecipeSchema = recipeSchema.omit({ userId: true, recipeId: true, createdAt: true });

export { recipeSchema, recipeBodyRequestSchema, aiRecipeSchema };
