'use client';

import { useEffect, useState } from 'react';
import { getTrendingAnime } from '@/lib/api';
import { Anime } from '@/lib/types';
import AnimeCard from './components/AnimeCard';
import { AnimeGridSkeleton } from './components/SkeletonLoader';

export default function Home() {
  const [trendingAnime, setTrendingAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrending() {
      try {
        setLoading(true);
        const data = await getTrendingAnime();
        setTrendingAnime(data);
      } catch (err) {
        console.error('Failed to fetch trending anime:', err);
        setError('Failed to load trending anime. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Welcome to Zani
          </h1>
          <p className="text-gray-400 text-lg">
            Discover and watch your favorite anime series
          </p>
        </div>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Trending Now
          </h2>

          {loading && <AnimeGridSkeleton count={12} />}

          {error && (
            <div className="text-center py-12 bg-[#151b3d] rounded-lg">
              <div className="text-red-400 text-xl mb-2">⚠️</div>
              <p className="text-white mb-2">Failed to load content</p>
              <p className="text-gray-400 text-sm">{error}</p>
            </div>
          )}

          {!loading && !error && trendingAnime.length === 0 && (
            <div className="text-center py-12 bg-[#151b3d] rounded-lg">
              <p className="text-gray-400">No anime found</p>
            </div>
          )}

          {!loading && !error && trendingAnime.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {trendingAnime.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          )}
        </section>

        <section className="py-8 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg px-6 mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">
            About Zani
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Zani is your ultimate destination for streaming anime online. Watch thousands of anime series and movies with high-quality video and subtitles. Our platform is designed to provide the best anime watching experience with a modern, user-friendly interface.
          </p>
        </section>
      </div>
    </div>
  );
}
