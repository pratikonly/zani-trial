# Zani - Anime Streaming Website

A modern, production-ready anime streaming website built with Next.js 15, React, TypeScript, and Tailwind CSS.

## Features

- 🎬 **Browse & Search**: Discover thousands of anime titles with instant search
- 📺 **High-Quality Streaming**: HLS video streaming with automatic quality selection
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- 🎨 **Modern UI**: Dark theme with anime-inspired purple, pink, and cyan accents
- ⚡ **Fast Performance**: Optimized with Next.js 15 App Router and React Server Components
- 🔍 **SEO Optimized**: Proper meta tags and semantic HTML for better discoverability
- ♿ **Accessible**: Built with accessibility in mind

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Video Player**: HLS.js for adaptive streaming
- **API**: GogoAnime API via anime-api-pratik

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd zani
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_BASE_URL=https://anime-api-pratik.vercel.app
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
zani/
├── app/
│   ├── anime/[id]/          # Anime detail pages
│   ├── watch/[episodeId]/   # Video player pages
│   ├── search/              # Search results page
│   ├── disclaimer/          # Legal disclaimer
│   ├── components/          # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── AnimeCard.tsx
│   │   ├── VideoPlayer.tsx
│   │   └── SkeletonLoader.tsx
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── lib/
│   ├── api.ts               # API client functions
│   ├── types.ts             # TypeScript interfaces
│   └── utils.ts             # Utility functions
├── public/                  # Static assets
├── .env.local              # Environment variables
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables

Make sure to set the following environment variable in your Vercel project settings:

```
NEXT_PUBLIC_API_BASE_URL=https://anime-api-pratik.vercel.app
```

## Features in Detail

### Home Page
- Trending/top airing anime grid
- Responsive card layout with hover effects
- Search functionality in header

### Search
- Real-time search with 300ms debounce
- URL parameter support for bookmarkable searches
- Empty state and error handling

### Anime Details
- Full anime information (title, description, genres, status)
- Episode list with pagination
- Click to watch any episode

### Video Player
- HLS streaming support with hls.js
- Auto-quality selection
- Custom video controls
- Fullscreen support
- Loading and error states

## API Endpoints Used

- Search: `/anime/gogoanime/{query}`
- Details: `/anime/gogoanime/info/{id}`
- Watch: `/anime/gogoanime/watch/{episodeId}`
- Trending: `/anime/gogoanime/top-airing` (fallback to search)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## License

This project is for educational purposes only. Please see the [Disclaimer](/disclaimer) page for legal information.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.

---

Made with ❤️ for anime fans
