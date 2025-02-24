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

**NOTE:** For steps on how to get your API keys, refer to the [API Keys](#api-keys) section below.

### Using Docker

To containerize and run the frontend application using Docker:

1. Clone the repository:

```bash
git clone https://github.com/mhzrerfani/innoscripta-news-aggregator.git
cd innoscripta-news-aggregator
```

2. Create a `.env.local` file with your API keys. Optionally, you can copy the `.env.example` file and rename it to `.env.local`:

```plaintext
NEWSAPI_KEY=your_newsapi_key
GUARDIAN_API_KEY=your_guardian_key
```

3. Build and run the Docker container:

- Using pre-built image

```bash
docker run --rm -p 3000:3000 --env-file .env.local ghcr.io/mhzrerfani/innoscripta-news-aggregator:main
```

- Building locally

```bash
docker build -t innoscripta-news-aggregator .
docker run --rm -p 3000:3000 --env-file .env.local innoscripta-news-aggregator
```

This will start the application in a Docker container and make it accessible at `http://localhost:3000`.

## API Keys

Please follow the instructions below to obtain your API keys for NewsAPI and The Guardian.

### NewsAPI

1. Go to the [NewsAPI Registration](https://newsapi.org/register) or [NewsAPI Login](https://newsapi.org/account) page.
2. Complete the form to register or log in.
3. Once logged in, You'll see the page containing your API key.
4. Copy the API key and paste it into your `.env.local` file as `NEWSAPI_KEY`.
5. Save the file.

### Guardian API

The Guardian API gets sent to the email once you register.

1. Go to the [Guardian API Registration](https://bonobo.capi.gutools.co.uk/register/developer) page.
2. Complete the form to register.
3. Verify your email.
4. Once verified, you'll receive an email containing your API key.
5. Copy the API key and paste it into your `.env.local` file as `GUARDIAN_API_KEY`.
6. Save the file.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **State Management**: React Query
- **Styling**: Tailwind CSS, shadcn/ui
- **Language**: TypeScript

### Why Chose This Stack

- **Next.js**: Provides a powerful framework for building server-rendered React applications with excellent performance and SEO capabilities, also by using Next.js api we protect our api keys from exposing.
- **React Query**: Simplifies data fetching and state management, making it easier to handle complex asynchronous operations.
- **Tailwind CSS**: Offers a utility-first approach to styling, allowing for rapid and consistent UI development.
- **shadcn/ui**: Enhances the UI with a set of pre-designed components that are easy to customize.
- **TypeScript**: Adds static typing to JavaScript, improving code quality and developer productivity.

## API Limitations

| Source       | Free Tier Limits                           |
| ------------ | ------------------------------------------ |
| NewsAPI      | 1000 requests/day, max 5 pages per request |
| The Guardian | 500 requests/day                           |
| BBC News     | No limit (RSS feed)                        |
