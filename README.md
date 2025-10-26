# LLM Lab

A full-stack web application for experimenting with LLM parameters and analyzing response quality. This project allows users to input prompts, specify parameter ranges, generate multiple LLM responses, and analyze them with custom quality metrics.

## 🚀 Features

- **Parameter Experimentation**: Test different combinations of temperature, top-p, top-k, and max-tokens
- **Custom Quality Metrics**: 5 programmatically calculated quality metrics (Coherence, Completeness, Length, Structure, Vocabulary)
- **Response Analysis**: Compare responses with detailed metrics and export functionality
- **Modern UI**: Built with Next.js and Tailwind CSS
- **Robust Backend**: NestJS API with Prisma ORM and PostgreSQL

## 🏗️ Architecture

- **Frontend**: Next.js 16 with TypeScript and Tailwind CSS (deployed on Vercel)
- **Backend**: NestJS with TypeScript (deployed on Railway)
- **Database**: PostgreSQL with Prisma ORM (Railway)
- **LLM Integration**: Google Gemini API
- **Quality Metrics**: Custom algorithms for response evaluation

## 📚 Documentation

This project includes comprehensive documentation to help you understand, deploy, and extend the system:

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes with step-by-step setup instructions
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture, design decisions, and component structure
- **[TECH_STACK.md](./TECH_STACK.md)** - Complete technology stack with versions and configurations
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Deployment strategies for Vercel (frontend) and Railway (backend)
- **[QUALITY_METRICS.md](./QUALITY_METRICS.md)** - Detailed explanation of quality metrics with formulas and examples
- **[UI_UX_DESIGN.md](./UI_UX_DESIGN.md)** - Design system, user journey, and accessibility guidelines
- **[ASSUMPTIONS_AND_DESIGN_DECISIONS.md](./ASSUMPTIONS_AND_DESIGN_DECISIONS.md)** - Core assumptions, trade-offs, and rationale behind key decisions
- **[PROJECT_PLAN.csv](./PROJECT_PLAN.csv)** - Development timeline with task breakdown and time estimates

## 📋 Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Google AI Studio API key

## 🛠️ Quick Setup

For detailed setup instructions, see [QUICK_START.md](./QUICK_START.md).

```bash
# 1. Clone and install dependencies
git clone <repository-url>
cd llm-lab
pnpm install

# 2. Setup backend
cd api
cp .env.example .env
# Edit .env with your GOOGLE_AI_API_KEY
pnpm db:generate && pnpm db:push
pnpm start:dev

# 3. Setup frontend (in new terminal)
cd web
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
pnpm dev
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

## 🎯 Key Features

### API Endpoints

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| `POST` | `/test-llm`               | Test LLM API connection       |
| `POST` | `/experiments`            | Create and run new experiment |
| `GET`  | `/experiments`            | List all experiments          |
| `GET`  | `/experiments/:id`        | Get experiment details        |
| `GET`  | `/experiments/:id/export` | Export experiment data (JSON) |

### Quality Metrics

- **Coherence** (0-1): Logical flow and consistency
- **Completeness** (0-1): How well response addresses the prompt
- **Length** (0-1): Appropriate response length
- **Structure** (0-1): Paragraph organization
- **Vocabulary** (0-1): Vocabulary diversity and sophistication

For detailed metric explanations with formulas and examples, see [QUALITY_METRICS.md](./QUALITY_METRICS.md).

## 📁 Project Structure

```
llm-lab/
├── api/                    # NestJS Backend (Railway)
│   ├── src/
│   │   ├── experiments/    # Experiment management
│   │   ├── llm/           # LLM integration
│   │   ├── metrics/       # Quality metrics
│   │   └── prisma/        # Database service
│   └── prisma/            # Database schema
├── web/                   # Next.js Frontend (Vercel)
│   ├── src/
│   │   ├── app/           # App router pages
│   │   └── components/    # UI components
│   └── public/            # Static assets
└── *.md                   # Documentation files
```

## 🌐 Deployment

- **Frontend**: Deployed on Vercel with global CDN
- **Backend**: Deployed on Railway with PostgreSQL
- **Database**: PostgreSQL on Railway

For detailed deployment instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md).

## 🤝 Contributing

For information about the architecture, design decisions, and development guidelines, please refer to:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and design
- [TECH_STACK.md](./TECH_STACK.md) - Technology stack details
- [ASSUMPTIONS_AND_DESIGN_DECISIONS.md](./ASSUMPTIONS_AND_DESIGN_DECISIONS.md) - Design rationale

## 📄 License

This project is licensed under the terms specified in the repository.
