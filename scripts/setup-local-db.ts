import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CreateTableCommand, ListTablesCommand, UpdateTimeToLiveCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({
  region: "ap-northeast-3",
  endpoint: "http://localhost:8000",
  credentials: {
    accessKeyId: "fakeAccessKeyId",
    secretAccessKey: "fakeSecretAccessKey",
  },
  maxAttempts: 5,
});

async function setupTables() {
  try {
    // List existing tables
    const { TableNames } = await client.send(new ListTablesCommand({}));
    console.log("📋 Existing tables:", TableNames || []);

    // Create Recipes Table
    if (!TableNames?.includes("ChefGPT-Recipes-Local")) {
      console.log("📦 Creating Recipes table...");
      await client.send(
        new CreateTableCommand({
          TableName: "ChefGPT-Recipes-Local",
          KeySchema: [
            { AttributeName: "userId", KeyType: "HASH" },
            { AttributeName: "recipeId", KeyType: "RANGE" },
          ],
          AttributeDefinitions: [
            { AttributeName: "userId", AttributeType: "S" },
            { AttributeName: "recipeId", AttributeType: "S" },
          ],
          BillingMode: "PAY_PER_REQUEST",
        })
      );
      console.log("✅ Recipes table created");
    } else {
      console.log("⏭️  Recipes table already exists");
    }

    // Create RateLimit Table
    if (!TableNames?.includes("ChefGPT-RateLimit-Local")) {
      console.log("📦 Creating RateLimit table...");
      await client.send(
        new CreateTableCommand({
          TableName: "ChefGPT-RateLimit-Local",
          KeySchema: [
            { AttributeName: "userId", KeyType: "HASH" },
            { AttributeName: "requestId", KeyType: "RANGE" },
          ],
          AttributeDefinitions: [
            { AttributeName: "userId", AttributeType: "S" },
            { AttributeName: "requestId", AttributeType: "S" },
          ],
          BillingMode: "PAY_PER_REQUEST",
        })
      );

      // Enable TTL
      await client.send(
        new UpdateTimeToLiveCommand({
          TableName: "ChefGPT-RateLimit-Local",
          TimeToLiveSpecification: {
            Enabled: true,
            AttributeName: "ttl",
          },
        })
      );
      console.log("✅ RateLimit table created with TTL enabled");
    } else {
      console.log("⏭️  RateLimit table already exists");
    }

    console.log("\n🎉 Local database setup complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting up tables:", error);
    process.exit(1);
  }
}

setupTables();
