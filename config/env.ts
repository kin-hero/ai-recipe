export const env = {
  AWS_REGION: process.env.AWS_REGION || "us-east-1",
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || "",
  DYNAMODB_ENDPOINT: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
  RECIPE_TABLE_NAME: process.env.RECIPE_TABLE_NAME || "ChefGPT-Recipes-Local",
  RATE_LIMIT_TABLE_NAME: process.env.RATE_LIMIT_TABLE_NAME || "ChefGPT-RateLimit-Local",
  USE_LOCAL_DB: process.env.USE_LOCAL_DB === "true" || process.env.NODE_ENV === "development",
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || "",
  OPENROUTER_LLM_MODEL: process.env.OPENROUTER_LLM_MODEL || "",
} as const;
