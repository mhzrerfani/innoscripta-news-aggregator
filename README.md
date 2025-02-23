# News Aggregator

A modern news aggregator built with Next.js that combines articles from multiple trusted sources.

## Features

- 🔍 Real-time search across all sources
- 📱 Responsive design
- 🗂️ Category filtering
- 📅 Date filtering
- ♾️ Infinite scroll pagination
- 🌓 Light/dark mode
- 📰 Multiple news sources:
  - NewsAPI
  - The Guardian
  - BBC News

## Running the Project

### Prerequisites

Before you begin, ensure you have:

- Docker installed
- API keys for NewsAPI and The Guardian

### Using Docker

To containerize and run the frontend application using Docker:

1. Clone the repository:

```bash
git clone https://github.com/mhzrerfani/news-aggregator.git
cd news-aggregator
```

2. Create a `.env.local` file with your API keys:

```plaintext
NEWSAPI_KEY=your_newsapi_key
GUARDIAN_API_KEY=your_guardian_key
```

3. Build the Docker image:

```bash
docker build -t news-aggregator .
```

4. Run the Docker container:

```bash
docker run -p 3000:3000 --env-file .env.local news-aggregator
```

This will start the application in a Docker container and make it accessible at `http://localhost:3000`.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **State Management**: React Query
- **Styling**: Tailwind CSS, shadcn/ui
- **Language**: TypeScript

### Why Chose This Stack

- **Next.js**: Provides a powerful framework for building server-rendered React applications with excellent performance and SEO capabilities, also by using Next.js api ew protect our api keys from exposing.
- **React Query**: Simplifies data fetching and state management, making it easier to handle complex asynchronous operations.
- **Tailwind CSS**: Offers a utility-first approach to styling, allowing for rapid and consistent UI development.
- **shadcn/ui**: Enhances the UI with a set of pre-designed components that are easy to customize.
- **TypeScript**: Adds static typing to JavaScript, improving code quality and developer productivity.

## API Limitations

| Source       | Free Tier Limits                          |
| ------------ | ----------------------------------------- |
| NewsAPI      | 100 requests/day, max 5 pages per request |
| The Guardian | 500 requests/day                          |
| BBC News     | No limit (RSS feed)                       |
