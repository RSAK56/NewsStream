# Newsstream

A modern newsstream web application built with React and TypeScript that pulls articles from various trusted news sources and presents them in a clean, user-friendly interface.

## Features

- **Article Search & Filtering**

  - Search articles by keywords
  - Filter results by date, category, and source
  - Advanced sorting options

- **Personalized News Feed**

  - Customize news preferences
  - Select preferred sources
  - Choose favorite categories
  - Follow specific authors

- **Responsive Design**
  - Mobile-first approach
  - Optimized for all device sizes
  - Seamless reading experience

## Tech Stack

- React.js with TypeScript
- Docker for containerization
- News APIs Integration:
  - NewsAPI
  - The Guardian
  - New York Times
    (Note: Final API selection may vary based on implementation)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Docker
- A modern web browser

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd newsstream
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your API keys:

```bash
VITE_NEWS_API_KEY=your_news_api_key
VITE_GUARDIAN_API_KEY=your_guardian_api_key
VITE_NYT_API_KEY=your_nyt_api_key
```

### Running the Application

#### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

#### Using Docker

1. Build the Docker image:

```bash
docker build -t newsstream .
```

2. Run the container:

```bash
docker run -p 3000:80 newsstream
```

The application will be available at `http://localhost:3000`

## Project Structure

```
newsstream/
├── src/
│   ├── components/
│   ├── services/
│   ├── hooks/
│   ├── types/
│   └── utils/
├── public/
├── Dockerfile
└── README.md
```

## Development Guidelines

This project follows these principles:

- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- SOLID Principles
  - Single Responsibility
  - Open-Closed
  - Liskov Substitution
  - Interface Segregation
  - Dependency Inversion

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
