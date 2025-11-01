import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { TABLES, dynamoDB } from "./dynamodb";

const getRecipeCount = async (userId: string): Promise<number> => {
  const response = await dynamoDB.send(
    new QueryCommand({
      TableName: TABLES.RECIPES,
      KeyConditionExpression: "userId = :userId",
      ExpressionAttributeValues: {
        ":userId": userId,
      },
      Select: "COUNT",
    })
  );

  return response.Count ?? 0;
};

export { getRecipeCount };
