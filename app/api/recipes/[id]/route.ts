import { auth } from "@clerk/nextjs/server";
import { TABLES, dynamoDB } from "@/lib/db/dynamodb";
import { NextRequest } from "next/server";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

type RecipeRouteParams = {
  params: { id: string };
};

export async function GET(req: NextRequest, { params }: RecipeRouteParams) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: recipeId } = await params;

    const parameters = {
      TableName: TABLES.RECIPES,
      Key: {
        userId: userId,
        recipeId: recipeId,
      },
    };

    const response = await dynamoDB.send(new GetCommand(parameters));

    if (!response.Item) {
      return Response.json({ error: "Recipe not found" }, { status: 404 });
    }
    return Response.json({ recipe: response.Item }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch a single recipe:", error);
    return Response.json({ error: "Failed to fetch a single recipe" }, { status: 500 });
  }
}
