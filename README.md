<h3 align="center">Netflix but Better</h3>

> [!WARNING]  
> This project **is not** affiliated with Netflix. It is a fan-made clone for educational purposes. Data can be inaccurate and the search and recommendation features can generate false positives.

<p align="center">
    A fan-made Netflix clone with full search capabilities and AI recommendations.
    <br />
    <a href="https://netflix-but-better.vercel.app"><strong>Demo</strong></a> ·
    <a href="https://vorillaz.com/netflix-but-better"><strong>Tutorial</strong></a>
    <br />
    <br />
    <a href="#introduction"><strong>Introduction</strong></a> ·
    <a href="#features"><strong>Features</strong></a> ·
    <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
    <a href="#running-the-project"><strong>Running the Project</strong></a> ·
    <a href="#acknowledments"><strong>Acknowledments</strong></a>
</p>

## Introduction

This project is a fan-made Netflix clone with full search capabilities and AI recommendations. It is built with Next.js, Tailwind CSS, and Shadcn UI powered by Neon as the database.

## Features

- Full search capabilities
- AI recommendations
- Watchlist

## Tech Stack

- [Next.js](https://nextjs.org/) – framework
- [TypeScript](https://www.typescriptlang.org/) – language
- [Tailwind](https://tailwindcss.com/) – CSS
- [Neon](https://neon.tech/) – database
- [Shadcn UI](https://ui.shadcn.com/) – components
- [OpenAI](https://openai.com/) – LLM & embeddings
- [Mistral](https://mistral.ai/) – LLM & embeddings
- [Ollama](https://ollama.com/) – LLM & embeddings
- [Vercel](https://vercel.com/) – deployments

## Running the Project

1. Clone the repository

```bash
git clone https://github.com/vorillaz/netflix-but-better.git
```

2. Install dependencies

```bash
pnpm install
```

3. Create a `.env` file and add your API keys

```bash
cp .env.sample .env
```

4. Migrate the database and add a few demo data:

```bash
pnpm db:generate
pnpm db:migrate
```

5. Start the development server

```bash
pnpm dev
```

## Acknowledments

The search and recommendation features can be a bit off due to semantic limitations during the embedding analysis.
Although Mistral has been used for extracting the metadata for the shows, OpenAI and Ollama can be also used.

There are a few scripts for enhancing the data quality:

- `pnpm run ai:embed` – Generate embeddings for the shows in the database
- `pnpm run ai:search-terms` – Analyze the shows in the database and generate search terms
