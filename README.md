# Newsstream

A modern newsstream web application built with React and TypeScript that displays news articles with filtering capabilities and user preferences.

## Features

- **News Feed**

  - Real-time news article display
  - Clean and intuitive interface
  - Article preview cards with headlines and summaries

- **Article Filtering**

  - Filter by category
  - Filter by news source
  - Dynamic filter updates

- **User Experience**
  - Responsive design for all devices
  - Dark/Light theme support
  - Smooth loading states
  - Error handling

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Zustand for state management
- NewsAPI for content
- Docker for containerization
- Supabase for backend services

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Docker & Docker Compose (for containerized setup)
- A modern web browser

### Installation

#### Local Development Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd newsstream
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory:

```bash
VITE_NEWS_API_KEY=your_news_api_key
VITE_GUARDIAN_API_KEY=your_guardian_api_key
VITE_NYTIMES_API_KEY=your_nytimes_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SITE_URL=http://localhost:5173
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Docker Setup

1. Create a `.env` file as shown above

2. Build and run using Docker Compose (recommended):

```bash
# Build and start the application
docker compose up --build -d

# View logs
docker compose logs -f

# Stop the application
docker compose down
```

Or using Docker directly:

```bash
# Build the image
docker build -t newsstream .

# Run the container
docker run -p 5173:5173 --env-file .env newsstream
```

The application will be available at `http://localhost:5173`

### Environment Variables in Docker

When using Docker, you can handle environment variables in several ways:

1. Using docker-compose.yml (recommended):

```yaml
services:
  app:
    build: .
    env_file:
      - .env
```

2. Using Docker run with --env-file:

```bash
docker run --env-file .env -p 5173:5173 newsstream
```

3. Passing individual environment variables:

```bash
docker run -e VITE_NEWS_API_KEY=your_key -p 5173:5173 newsstream
```

## Project Structure

```
newsstream/
├── src/
│   ├── components/
│   │   ├── NewsFeed.tsx    # Main news feed component
│   │   ├── Header.tsx      # Application header
│   │   └── Filters.tsx     # News filtering options
│   ├── store/
│   │   ├── useNewsStore.ts # News state management
│   │   └── useUserStore.ts # User preferences state
│   ├── App.tsx
│   └── main.tsx
├── public/
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## State Management

The application uses Zustand for state management with two main stores:

- `useNewsStore`: Manages news articles, loading states, and filtering logic
- `useUserStore`: Handles user preferences and theme settings

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
