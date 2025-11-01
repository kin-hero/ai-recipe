import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { env } from "@/config/env";

export const isLocalDb = env.USE_LOCAL_DB;
const client = new DynamoDBClient({
  region: env.AWS_REGION,
  ...(isLocalDb
    ? {
        endpoint: env.DYNAMODB_ENDPOINT,
        credentials: {
          accessKeyId: "fakeAccessKeyId",
          secretAccessKey: "fakeSecretAccessKey",
        },
      }
    : {
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
        },
      }),
});

// Create DocumentClient for easier JavaScript object handling
export const dynamoDB = DynamoDBDocumentClient.from(client);

// Table names (from centralized config)
export const TABLES = {
  RECIPES: env.RECIPE_TABLE_NAME,
  RATE_LIMIT: env.RATE_LIMIT_TABLE_NAME,
} as const;
