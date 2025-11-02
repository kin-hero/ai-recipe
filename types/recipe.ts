import z from "zod";
import { recipeSchema, recipeBodyRequestSchema, aiRecipeSchema } from "@/lib/validations/recipe";

export type RecipeResponse = z.infer<typeof recipeSchema>;
export type RecipeBodyRequest = z.infer<typeof recipeBodyRequestSchema>;
export type AIGeneratedRecipe = z.infer<typeof aiRecipeSchema>;
