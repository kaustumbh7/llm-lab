# LLM Lab - Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you get LLM Lab running locally in just a few minutes. Follow these steps to set up your development environment and run your first experiment.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20+** ([Download](https://nodejs.org/))
- **pnpm** (recommended) or npm
- **Git** ([Download](https://git-scm.com/))
- **Google AI Studio API Key** ([Get one here](https://aistudio.google.com/app/apikey))

### Verify Prerequisites

```bash
# Check Node.js version
node --version  # Should be 20 or higher

# Check pnpm (if using)
pnpm --version

# Check Git
git --version
```

## Step 1: Clone and Install

### Clone the Repository

```bash
git clone <repository-url>
cd llm-lab
```

### Install Dependencies

```bash
# Install all dependencies (both frontend and backend)
pnpm install

# Or install separately
cd api && pnpm install
cd ../web && pnpm install
```

## Step 2: Backend Setup

### Navigate to API Directory

```bash
cd api
```

### Environment Configuration

1. **Copy the environment template:**

   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file with your configuration:**

   ```bash
   # Required: Get from https://aistudio.google.com/app/apikey
   GOOGLE_AI_API_KEY=your_api_key_here

   # Optional: Default values (can be customized)
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   DEFAULT_MODEL=gemini-2.5-flash-lite

   # Database (development)
   DATABASE_URL="file:./dev.db"

   # Parameter combinations (how many values to test per parameter)
   TEMPERATURE_COMBINATIONS=2
   TOP_P_COMBINATIONS=2
   TOP_K_COMBINATIONS=2
   MAX_TOKENS_COMBINATIONS=2
   ```

### Database Setup

```bash
# Generate Prisma client
pnpm db:generate

# Create and migrate database
pnpm db:push

# (Optional) Open database GUI
pnpm db:studio
```

### Start the Backend

```bash
# Start development server
pnpm start:dev
```

The API will be available at `http://localhost:5000`

## Step 3: Frontend Setup

### Navigate to Web Directory

```bash
cd ../web
```

### Environment Configuration

1. **Create environment file:**
   ```bash
   echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
   ```

### Start the Frontend

```bash
# Start development server
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## Step 4: Verify Installation

### Test the API

Open a new terminal and test the API:

```bash
# Test LLM connection
curl -X POST http://localhost:5000/test-llm \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Hello, how are you?",
    "parameters": {
      "temperature": 0.5,
      "topP": 0.8,
      "topK": 20,
      "maxTokens": 50
    }
  }'
```

Expected response:

```json
{
  "content": "Hello! I'm doing well, thank you for asking...",
  "usage": {
    "promptTokens": 4,
    "completionTokens": 12,
    "totalTokens": 16
  }
}
```

### Test the Frontend

1. Open your browser and go to `http://localhost:3000`
2. You should see the LLM Lab dashboard
3. Click "Create Experiment" to test the full flow

## Step 5: Run Your First Experiment

### Using the Web Interface

1. **Navigate to the frontend** at `http://localhost:3000`
2. **Click "Create Experiment"**
3. **Fill in the experiment details:**
   - **Name**: "My First Experiment"
   - **Description**: "Testing basic LLM parameters"
   - **Prompt**: "Write a short story about a robot learning to paint."
   - **Parameter Ranges**:
     - Temperature: 0.1 to 0.9
     - Top-P: 0.1 to 0.9
     - Top-K: 10 to 50
     - Max Tokens: 100 to 500
4. **Click "Create Experiment"**
5. **Wait for the experiment to complete** (this may take a few minutes)
6. **View the results** with metrics and visualizations

### Using the API Directly

```bash
# Create an experiment via API
curl -X POST http://localhost:5000/experiments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test Experiment",
    "description": "Testing via API",
    "prompt": "Explain the concept of artificial intelligence in simple terms.",
    "temperatureMin": 0.1,
    "temperatureMax": 0.9,
    "topPMin": 0.1,
    "topPMax": 0.9,
    "topKMin": 10,
    "topKMax": 50,
    "maxTokensMin": 100,
    "maxTokensMax": 500
  }'
```

## Understanding the Results

### Quality Metrics

Your experiment will generate responses with these quality metrics:

- **Coherence Score (0-1)**: Logical flow and consistency
- **Completeness Score (0-1)**: How well the response addresses the prompt
- **Length Score (0-1)**: Appropriate response length
- **Structure Score (0-1)**: Paragraph structure and organization
- **Vocabulary Score (0-1)**: Vocabulary diversity and sophistication
- **Overall Score (0-1)**: Weighted average of all metrics

### Visualization Features

- **Response Comparison**: Side-by-side comparison of different parameter combinations
- **Metrics Visualization**: Charts showing how parameters affect quality scores
- **Parameter Analysis**: Statistical analysis of parameter effects
- **Export Functionality**: Download experiment data as JSON

## Common Issues and Solutions

### Issue: "GOOGLE_AI_API_KEY is required"

**Solution**: Make sure you've set your API key in the `.env` file:

```bash
cd api
echo "GOOGLE_AI_API_KEY=your_actual_api_key_here" >> .env
```

### Issue: Database connection error

**Solution**: Regenerate the database:

```bash
cd api
pnpm db:generate
pnpm db:push
```

### Issue: CORS errors

**Solution**: Check that your frontend URL matches the backend configuration:

```bash
# In api/.env
FRONTEND_URL=http://localhost:3000
```

### Issue: Port already in use

**Solution**: Change the port in your configuration:

```bash
# In api/.env
PORT=5001
```

Or kill the process using the port:

```bash
lsof -ti:5000 | xargs kill -9
```

### Issue: Frontend can't connect to API

**Solution**: Verify the API URL in your frontend configuration:

```bash
# In web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Development Workflow

### Making Changes

1. **Backend Changes**: Edit files in `api/src/` - the server will auto-reload
2. **Frontend Changes**: Edit files in `web/src/` - the browser will auto-reload
3. **Database Changes**: Edit `api/prisma/schema.prisma` and run `pnpm db:push`

### Useful Commands

```bash
# Backend commands
cd api
pnpm start:dev          # Start development server
pnpm build             # Build for production
pnpm test              # Run tests
pnpm db:studio         # Open database GUI
pnpm db:push           # Push schema changes
pnpm db:generate       # Generate Prisma client

# Frontend commands
cd web
pnpm dev               # Start development server
pnpm build             # Build for production
pnpm start             # Start production server
pnpm test              # Run tests
```

## Next Steps

### Explore the Codebase

- **Backend**: Check out `api/src/` for the NestJS application structure
- **Frontend**: Explore `web/src/` for the Next.js application
- **Database**: Review `api/prisma/schema.prisma` for the data model

### Customize Your Setup

- **Modify Metrics**: Edit the quality metrics in `api/src/metrics/utils/`
- **Add New Parameters**: Extend the LLM parameters in the schema
- **Customize UI**: Modify components in `web/src/components/`

### Deploy to Production

- **Railway**: Follow the deployment guide in `DEPLOYMENT.md`
- **Docker**: Use the provided Dockerfile for containerized deployment
- **Environment**: Set up production environment variables

## Getting Help

### Documentation

- **Architecture**: See `ARCHITECTURE.md` for system design details
- **Tech Stack**: Check `TECH_STACK.md` for technology information
- **Deployment**: Refer to `DEPLOYMENT.md` for production setup

### Troubleshooting

1. **Check the logs**: Both frontend and backend provide detailed logging
2. **Verify environment**: Ensure all environment variables are set correctly
3. **Test API**: Use the test endpoint to verify LLM connectivity
4. **Database**: Use Prisma Studio to inspect the database state

### Support

- **Issues**: Check the project's issue tracker
- **Documentation**: Review the comprehensive documentation
- **Community**: Join the project's community discussions

## Quick Reference

### Essential URLs

#### Development

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`
- **Database GUI**: `http://localhost:5555` (when running `pnpm db:studio`)

#### Production

- **Frontend**: `https://llm-lab.vercel.app` (Vercel)
- **Backend API**: `https://api.llm-lab.railway.app` (Railway)

### Key Files

- **Backend Config**: `api/.env`
- **Frontend Config**: `web/.env.local`
- **Database Schema**: `api/prisma/schema.prisma`
- **Package Configs**: `api/package.json`, `web/package.json`

### Important Commands

```bash
# Start everything
cd api && pnpm start:dev & cd ../web && pnpm dev

# Stop everything
# Use Ctrl+C in each terminal

# Reset database
cd api && pnpm db:reset

# View logs
# Check terminal output for both frontend and backend
```

Congratulations! You now have LLM Lab running locally and can start experimenting with LLM parameters. The system will automatically generate multiple responses with different parameter combinations and analyze their quality using custom metrics.

Happy experimenting! 🎉
