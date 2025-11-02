# ChefGPT - AI Recipe Generator

[**View the Live Demo**](https://your-live-demo-url.com) | [**Read the Full Case Study**](https://your-portfolio.com/projects/chefgpt)

A production-grade, full-stack AI-powered recipe generation platform built with Next.js, AWS serverless infrastructure, and OpenRouter AI. Transform your ingredients into culinary magic with intelligent recipe suggestions, complete with detailed instructions, cooking times, and nutritional information.

## Core Features

- **AI-Powered Recipe Generation:** Generate custom recipes using advanced LLMs via OpenRouter API
- **Smart Rate Limiting:** 1 recipe generation per 30 minutes with automatic DynamoDB TTL cleanup
- **Recipe Quota Management:** Maximum 10 saved recipes per user to optimize storage costs
- **Secure Authentication:** User sign-up, sign-in, and session management using Clerk
- **Full CRUD Functionality:** Create, read, update, and delete recipes
- **Client-Side Filtering:** Fast cuisine-based filtering without additional API calls
- **Real-time Quota Display:** Live updates showing remaining recipe slots
- **Responsive Design:** Mobile-first UI with Tailwind CSS and dark mode support

## Technical Architecture

This project uses a modern, serverless monorepo architecture to ensure cost-effectiveness, maintainability, and optimal performance for a portfolio/showcase application.

### Tech Stack

| Area               | Technology                                                                 |
| ------------------ | -------------------------------------------------------------------------- |
| **Frontend**       | Next.js 16 (App Router), React 19, TypeScript (strict mode), Tailwind CSS |
| **Backend API**    | Next.js API Routes (serverless)                                            |
| **Database**       | AWS DynamoDB (two tables: Recipes, RateLimit)                              |
| **Authentication** | Clerk (frontend + backend)                                                 |
| **AI Provider**    | OpenRouter API (supports multiple LLMs)                                    |
| **Validation**     | Zod for runtime type safety                                                |
| **Deployment**     | AWS Amplify (full-stack hosting)                                           |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Browser                             │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Landing   │  │   Sign In    │  │   Recipe Dashboard   │  │
│  │     Page    │─▶│   (Clerk)    │─▶│   (List/Create)      │  │
│  └─────────────┘  └──────────────┘  └──────────────────────┘  │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│              Next.js App (AWS Amplify Hosting)                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                   API Routes Layer                        │  │
│  │  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐  │  │
│  │  │ /api/      │  │ /api/user/  │  │ /api/recipes/    │  │  │
│  │  │ recipes/   │  │ quota       │  │ generate         │  │  │
│  │  │ [id]       │  │             │  │                  │  │  │
│  │  └────────────┘  └─────────────┘  └──────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────────┬─────────────────┬──────────────────┬───────────────┘
            │                 │                  │
            │                 │                  │
            ▼                 ▼                  ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
    │ Clerk Auth   │  │  DynamoDB    │  │  OpenRouter API  │
    │   Service    │  │              │  │   (AI Models)    │
    │              │  │ - Recipes    │  │                  │
    │              │  │ - RateLimit  │  │  - GPT-4         │
    └──────────────┘  └──────────────┘  │  - Claude        │
                                         │  - Llama, etc.   │
                                         └──────────────────┘
```

### Key Architectural Decisions

**Monorepo Approach** - Next.js API Routes handle backend logic instead of separate Lambda functions:
- ✅ Single deployment (AWS Amplify)
- ✅ Simplified authentication (Clerk middleware)
- ✅ Shared TypeScript types between frontend/backend
- ✅ Lower operational overhead (no API Gateway, fewer Lambda cold starts)
- ✅ Cost-effective for low-traffic portfolio projects (~$1-2/month for 100 users)

**DynamoDB Over PostgreSQL**:
- ✅ Serverless with zero maintenance
- ✅ Built-in TTL for automatic rate limit cleanup (no cron jobs)
- ✅ Pay-per-request pricing (ideal for low traffic)
- ✅ Sub-10ms latency with on-demand scaling

**Client-Side Filtering**:
- ✅ Max 10 recipes per user = small dataset
- ✅ No additional API calls for filtering
- ✅ Instant UI response
- ✅ Future-ready for server-side filtering with DynamoDB GSI

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- AWS Account (for DynamoDB)
- Clerk Account (for authentication)
- OpenRouter API Key (for AI recipe generation)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-recipe.git
cd ai-recipe

# Install dependencies
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# AWS DynamoDB
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_KEY

# DynamoDB Table Names
RECIPE_TABLE_NAME=ChefGPT-Recipes
RATE_LIMIT_TABLE_NAME=ChefGPT-RateLimit

# For local development (optional)
USE_LOCAL_DB=true  # Set to false for production
DYNAMODB_ENDPOINT=http://localhost:8000  # Only for local DynamoDB

# OpenRouter AI
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_LLM_MODEL=openai/gpt-3.5-turbo

# App Configuration (optional, has defaults)
MAX_RECIPES_PER_USER=10
RATE_LIMIT_WINDOW_MS=1800000  # 30 minutes in milliseconds
```

### 3. AWS DynamoDB Setup

#### Option A: Use Local DynamoDB (Development)

```bash
# Install DynamoDB Local using Docker
docker run -p 8000:8000 amazon/dynamodb-local

# Create tables using AWS CLI
aws dynamodb create-table \
  --table-name ChefGPT-Recipes-Local \
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=recipeId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=recipeId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000

aws dynamodb create-table \
  --table-name ChefGPT-RateLimit-Local \
  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=requestId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH AttributeName=requestId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000
```

#### Option B: Use AWS DynamoDB (Production)

Create two tables in your AWS Console or via AWS CLI:

**Table 1: Recipes**
- Table Name: `ChefGPT-Recipes`
- Partition Key: `userId` (String)
- Sort Key: `recipeId` (String)
- Billing Mode: On-Demand

**Table 2: RateLimit**
- Table Name: `ChefGPT-RateLimit`
- Partition Key: `userId` (String)
- Sort Key: `requestId` (String)
- Billing Mode: On-Demand
- TTL Attribute: `ttl` (Enable TTL on this attribute)

### 4. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## API Endpoints

A brief overview of the main API routes handled by Next.js API Routes.

| Method   | Endpoint                    | Description                          | Auth |
| -------- | --------------------------- | ------------------------------------ | ---- |
| `GET`    | `/api/recipes`              | Gets all user's recipes              | Yes  |
| `GET`    | `/api/recipes/:id`          | Gets a single recipe                 | Yes  |
| `POST`   | `/api/recipes/generate`     | Generates a new AI recipe            | Yes  |
| `DELETE` | `/api/recipes/:id`          | Deletes a recipe                     | Yes  |
| `GET`    | `/api/user/quota`           | Gets user's quota info               | Yes  |

### API Request/Response Examples

#### Generate a Recipe

**Request:**
```bash
POST /api/recipes/generate
Content-Type: application/json
Authorization: Bearer <clerk-session-token>

{
  "ingredients": ["chicken", "garlic", "olive oil"],
  "cuisine": "Italian"
}
```

**Response (201 Created):**
```json
{
  "recipe": {
    "recipeId": "01f4b542-1391-415d-b500-e8f0a3b4465c",
    "userId": "user_abc123",
    "title": "Garlic Butter Chicken",
    "description": "A simple and flavorful Italian-inspired chicken dish",
    "cuisine": "Italian",
    "ingredients": [
      { "item": "chicken breast", "amount": "2 pieces" },
      { "item": "garlic", "amount": "4 cloves" },
      { "item": "olive oil", "amount": "2 tbsp" }
    ],
    "instructions": [
      "Preheat your pan over medium heat...",
      "Season the chicken with salt and pepper...",
      "Cook until golden brown..."
    ],
    "servingSize": 2,
    "prepTime": 10,
    "cookTime": 20,
    "tags": ["easy", "quick", "weeknight dinner"],
    "createdAt": "2025-01-15T12:00:00.000Z"
  }
}
```

**Error Response (429 Rate Limited):**
```json
{
  "error": "Rate limited. Please wait 30 minutes."
}
```

**Error Response (403 Quota Exceeded):**
```json
{
  "error": "Recipe quota exceeded"
}
```

## Project Structure

```
ai-recipe/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── recipes/
│   │   │   ├── generate/       # POST - AI recipe generation
│   │   │   │   └── route.ts
│   │   │   ├── route.ts        # GET - List user recipes
│   │   │   └── [id]/           # GET/DELETE - Single recipe
│   │   │       └── route.ts
│   │   └── user/
│   │       └── quota/          # GET - Check recipe quota
│   │           └── route.ts
│   ├── recipes/                # Frontend pages
│   │   ├── page.tsx            # Recipe list page
│   │   ├── create/
│   │   │   └── page.tsx        # Recipe creation page
│   │   └── [id]/
│   │       └── page.tsx        # Recipe detail page
│   ├── layout.tsx              # Root layout with Clerk provider
│   ├── page.tsx                # Landing page
│   ├── icon.tsx                # Custom favicon generator
│   └── globals.css             # Global styles
├── lib/                        # Shared utilities
│   ├── db/
│   │   ├── dynamodb.ts         # DynamoDB client setup
│   │   ├── recipe.ts           # Recipe CRUD operations
│   │   └── rateLimit.ts        # Rate limiting logic
│   ├── ai/
│   │   └── openrouter.ts       # OpenRouter API integration
│   └── validations/
│       └── recipe.ts           # Zod schemas
├── components/                 # React components
│   ├── Spinner.tsx
│   ├── DeleteModal.tsx
│   └── ...
├── types/                      # TypeScript type definitions
│   └── recipe.ts
├── config/
│   └── env.ts                  # Environment configuration
├── middleware.ts               # Clerk authentication middleware
├── CLAUDE.md                   # Project documentation for AI assistants
└── README.md                   # This file
```

## Key Features Deep Dive

### Rate Limiting Strategy

**Two-layer protection:**

1. **Recipe Quota**: Max 10 saved recipes per user (prevents storage bloat)
2. **Rate Limit**: 1 generation per 30 minutes (prevents API cost abuse)

**Why separate from recipe count?**
- User could delete recipes and spam generate → high OpenRouter API costs
- Rate limit persists even if user has 0 recipes
- Uses DynamoDB TTL for automatic cleanup (no cron jobs needed)

**Implementation:**
```typescript
// lib/db/rateLimit.ts
const checkRateLimit = async (userId: string): Promise<boolean> => {
  const thirtyMinsAgo = Date.now() - RATE_LIMIT_WINDOW;
  // Query DynamoDB for any generation requests in last 30 minutes
  // If found, user is rate limited
  // TTL automatically deletes old records
};
```

### Authentication Pattern

**Clerk Integration:**
- Frontend: `<ClerkProvider>` wraps app in `app/layout.tsx`
- Backend: Use `auth()` from `@clerk/nextjs/server` in API routes
- Middleware: Clerk's middleware protects routes automatically

```typescript
// app/api/recipes/generate/route.ts
export async function POST(req: Request) {
  // 1. Authentication check
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  // 2. Validation with Zod
  const validated = schema.safeParse(await req.json());
  if (!validated.success) return Response.json({ error: "..." }, { status: 400 });

  // 3. Business logic checks (quota, rate limits)
  // 4. Execute operation
  // 5. Return response
}
```

## Deployment

### Deploy to AWS Amplify

1. **Connect your GitHub repository** to AWS Amplify
2. **Configure build settings:**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
3. **Add environment variables** in Amplify Console (all variables from `.env.local`)
4. **Deploy** - Amplify will automatically deploy on every push to main

### Cost Estimates (100 MAU)

- **AWS Amplify Hosting**: ~$0.15/month
- **DynamoDB**: ~$0.25/month (on-demand pricing)
- **OpenRouter API**: ~$1.00/month (assuming 100 recipes @ $0.01 each)
- **Clerk Auth**: Free (< 10,000 MAU)

**Total: ~$1.40/month**

## Future Enhancements

These are potential additions to showcase additional skills:

- [ ] **Server-side Filtering**: Add DynamoDB GSI for complex queries
- [ ] **Image Generation**: AI-generated recipe images using DALL-E/Stable Diffusion
- [ ] **Nutritional Info**: Calculate calories, macros from ingredients
- [ ] **Recipe Sharing**: Public recipe URLs with custom slugs
- [ ] **Shopping List**: Export ingredients to shopping list
- [ ] **Meal Planning**: Weekly meal plan generator
- [ ] **Recipe Collections**: User-created recipe collections/cookbooks
- [ ] **ElasticSearch**: Advanced recipe search functionality
- [ ] **Caching**: Add Redis/ElastiCache for frequently accessed recipes

## Development Notes

- This is a **portfolio project** optimized for demonstrating skills, not production scale
- Prioritizes **code clarity** and **architectural decisions** over premature optimization
- Documents **why** decisions were made (valuable for interviews)
- Focus on cost-effective infrastructure (~$1-2/month target)

## Testing

```bash
# Run unit tests (coming soon)
npm run test

# Run component tests (coming soon)
npm run test:components

# Run integration tests (coming soon)
npm run test:integration
```

## Contributing

This is a personal portfolio project, but feedback and suggestions are welcome! Please open an issue or submit a pull request.

## License

MIT License - feel free to use this project as a reference for your own work.

## Contact

- **Portfolio**: [your-portfolio.com](https://your-portfolio.com)
- **LinkedIn**: [linkedin.com/in/yourname](https://linkedin.com/in/yourname)
- **Email**: your.email@example.com

---

Built with ❤️ using Next.js, AWS, and OpenRouter AI
