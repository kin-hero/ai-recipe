import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { TABLES, dynamoDB } from "./dynamodb";
import { env } from "@/config/env";

const checkRateLimit = async (userId: string): Promise<boolean> => {
  const timeDeadline = Date.now() - env.RATE_LIMIT_WINDOW_MS;
  const requestIdStart = `gen#${timeDeadline}`;

  const response = await dynamoDB.send(
    new QueryCommand({
      TableName: TABLES.RATE_LIMIT,
      KeyConditionExpression: "userId = :userId AND requestId > :windowStart",
      ExpressionAttributeValues: {
        ":userId": userId,
        ":windowStart": requestIdStart,
      },
      Select: "COUNT",
    })
  );

  // If Count === 0, no recent generations, user is allowed
  return (response.Count ?? 0) === 0;
};

const generateRecord = async (userId: string): Promise<void> => {
  const requestId = `gen#${Date.now()}`;
  const ttl = Math.floor((Date.now() + env.RATE_LIMIT_WINDOW_MS) / 1000); // Convert to Unix seconds for DynamoDB TTL
  const params = {
    TableName: TABLES.RATE_LIMIT,
    Item: {
      userId,
      requestId,
      ttl,
    },
  };

  const command = new PutCommand(params);
  await dynamoDB.send(command);
};

export { checkRateLimit, generateRecord };
