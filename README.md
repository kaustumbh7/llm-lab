# LLM Lab

A full-stack web application for experimenting with LLM parameters and analyzing response quality. This project allows users to input prompts, specify parameter ranges, generate multiple LLM responses, and analyze them with custom quality metrics.

## 🚀 Features

- **Parameter Experimentation**: Test different combinations of temperature, top-p, top-k, and max-tokens
- **Custom Quality Metrics**: 5 programmatically calculated quality metrics (Coherence, Completeness, Length, Structure, Vocabulary)
- **Response Analysis**: Compare responses with detailed metrics and export functionality
- **Modern UI**: Built with Next.js and Tailwind CSS
- **Robust Backend**: NestJS API with Prisma ORM and SQLite database

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Backend**: NestJS with TypeScript
- **Database**: SQLite with Prisma ORM
- **LLM Integration**: Google Gemini API
- **Quality Metrics**: Custom algorithms for response evaluation

## 📋 Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Google AI Studio API key

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install dependencies for both frontend and backend
pnpm install

# Or install separately
cd api && pnpm install
cd ../web && pnpm install
```

### 2. Backend Setup (API)

```bash
cd api

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
# Required: GOOGLE_AI_API_KEY (get from https://aistudio.google.com/app/apikey)

# Generate Prisma client
pnpm db:generate

# Run database migrations
pnpm db:push

# View and modify database via UI
pnpm db:studio

# Start the development server
pnpm start:dev
```

The API will be available at `http://localhost:5000`

### 3. Frontend Setup (Web)

```bash
cd web

# Start the development server
pnpm dev
```

The frontend will be available at `http://localhost:3000`

## 🎯 Backend API Achievements

### ✅ Core Infrastructure

- **NestJS Framework**: Modular, scalable backend architecture
- **Prisma ORM**: Type-safe database operations with SQLite
- **Environment Configuration**: Centralized config management
- **CORS & Validation**: Secure API with input validation

### ✅ Database Schema

- **Experiments**: Store experiment configurations with parameter ranges
- **Responses**: Track LLM responses with parameter values
- **Metrics**: Store calculated quality metrics for each response
- **Relationships**: Proper foreign key relationships with cascade deletes

### ✅ LLM Integration

- **Google Gemini API**: Production-ready LLM integration
- **Parameter Support**: Temperature, Top-P, Top-K, Max Tokens
- **Error Handling**: Robust error handling for API failures
- **Rate Limiting**: Configurable concurrent request limits

### ✅ Experiment Management

- **Dynamic Parameter Generation**: Automatic combination generation based on ranges
- **Batch Processing**: Efficient handling of multiple parameter combinations
- **Metrics Integration**: Automatic quality metrics calculation
- **Export Functionality**: JSON export with complete experiment data

### ✅ Quality Metrics System

- **5 Custom Metrics**: Coherence, Completeness, Length, Structure, Vocabulary
- **Modular Architecture**: Separate utility classes for each metric
- **Weighted Scoring**: Configurable weights for overall score calculation
- **Text Analysis**: Advanced text processing for metric calculation

### ✅ API Endpoints

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| `POST` | `/test-llm`               | Test LLM API connection       |
| `POST` | `/experiments`            | Create and run new experiment |
| `GET`  | `/experiments`            | List all experiments          |
| `GET`  | `/experiments/:id`        | Get experiment details        |
| `GET`  | `/experiments/:id/export` | Export experiment data (JSON) |

## 🧪 Testing the API

### 1. Start the Backend

```bash
cd api
pnpm start:dev
```

### 2. Test with cURL

#### Test LLM API connection

```bash
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

#### Create an Experiment

```bash
curl -X POST http://localhost:5000/experiments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Experiment",
    "description": "Testing LLM parameters",
    "prompt": "Write a short story about a robot learning to paint.",
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

#### List Experiments

```bash
curl http://localhost:5000/experiments
```

#### Get Experiment Details

```bash
curl http://localhost:5000/experiments/{experiment-id}
```

#### Export Experiment Data

```bash
curl http://localhost:5000/experiments/{experiment-id}/export \
  -H "Accept: application/json" \
  -o experiment-export.json
```

## 📊 Quality Metrics Explained

### 1. **Coherence Score (0-1)**

- Measures logical flow and consistency
- Analyzes connector words, pronoun consistency, topic consistency
- Higher scores indicate better logical structure

### 2. **Completeness Score (0-1)**

- Evaluates how well the response addresses the prompt
- Checks keyword coverage, question answering, task fulfillment
- Higher scores indicate more complete responses

### 3. **Length Score (0-1)**

- Assesses appropriate response length relative to prompt
- Optimal range: 2-5x the prompt length
- Penalizes responses that are too short or too long

### 4. **Structure Score (0-1)**

- Evaluates paragraph structure and organization
- Checks for introduction/conclusion, logical progression
- Higher scores indicate better structural organization

### 5. **Vocabulary Score (0-1)**

- Measures vocabulary diversity and sophistication
- Analyzes word variety, sophisticated word usage, repetition
- Higher scores indicate richer vocabulary

## 📁 Project Structure

```
llm-lab/
├── api/                    # NestJS Backend
│   ├── src/
│   │   ├── experiments/    # Experiment management
│   │   ├── llm/           # LLM integration
│   │   ├── metrics/       # Quality metrics
│   │   └── prisma/        # Database service
│   ├── prisma/            # Database schema
│   └── .env.example       # Environment template
├── web/                   # Next.js Frontend
│   ├── src/
│   │   └── app/           # App router pages
│   └── public/            # Static assets
└── README.md              # This file
```

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection Error**

   ```bash
   cd api
   pnpm db:generate
   pnpm db:push
   ```

2. **Google AI API Key Error**

   - Ensure `GOOGLE_AI_API_KEY` is set in `.env`
   - Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

3. **CORS Issues**

   - Check `FRONTEND_URL` in `.env` matches your frontend URL
   - Default: `http://localhost:3000`

4. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Or kill process: `lsof -ti:5000 | xargs kill -9`

## 📈 Performance Notes

- **Rate Limiting**: Configured to prevent API quota exhaustion
- **Concurrent Requests**: Limited to 3 simultaneous requests
- **Request Delays**: 2-second delay between requests
- **Database Optimization**: Efficient queries with proper indexing
