import { auth } from "@clerk/nextjs/server";
import { TABLES, dynamoDB } from "@/lib/db/dynamodb";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const params = {
      TableName: TABLES.RECIPES,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      ScanIndexForward: false,
    };

    const response = await dynamoDB.send(new QueryCommand(params));

    return Response.json({ recipes: response.Items || [] }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    return Response.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}
