export const env = {
  // AWS credentials (renamed to avoid Amplify reserved prefix)
  AWS_REGION: process.env.REGION || process.env.AWS_REGION || "us-east-1",
  AWS_ACCESS_KEY_ID: process.env.ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || "",
  AWS_SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || "",
  DYNAMODB_ENDPOINT: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
  RECIPE_TABLE_NAME: process.env.RECIPE_TABLE_NAME || "ChefGPT-Recipes-Local",
  RATE_LIMIT_TABLE_NAME: process.env.RATE_LIMIT_TABLE_NAME || "ChefGPT-RateLimit-Local",
  USE_LOCAL_DB: process.env.USE_LOCAL_DB === "true" || process.env.NODE_ENV === "development",
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
  OPENROUTER_LLM_MODEL: process.env.OPENROUTER_LLM_MODEL || "",
  // App Configuration
  MAX_RECIPES_PER_USER: parseInt(process.env.MAX_RECIPES_PER_USER || "10", 10),
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || String(30 * 60 * 1000), 10), // 30 minutes in milliseconds
} as const;
