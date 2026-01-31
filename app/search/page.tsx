'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchAnime } from '@/lib/api';
import { Anime } from '@/lib/types';
import AnimeCard from '../components/AnimeCard';
import { AnimeGridSkeleton } from '../components/SkeletonLoader';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function performSearch() {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await searchAnime(query);
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search anime. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    performSearch();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-400">
              Showing results for: <span className="text-purple-400 font-semibold">{query}</span>
            </p>
          )}
        </div>

        {!query && (
          <div className="text-center py-12 bg-[#151b3d] rounded-lg">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400 text-lg">
              Enter a search term to find anime
            </p>
          </div>
        )}

        {loading && query && <AnimeGridSkeleton count={12} />}

        {error && (
          <div className="text-center py-12 bg-[#151b3d] rounded-lg">
            <div className="text-red-400 text-xl mb-2">⚠️</div>
            <p className="text-white mb-2">Search failed</p>
            <p className="text-gray-400 text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && query && results.length === 0 && (
          <div className="text-center py-12 bg-[#151b3d] rounded-lg">
            <div className="text-6xl mb-4">😔</div>
            <p className="text-white text-lg mb-2">No results found</p>
            <p className="text-gray-400">
              Try searching with different keywords
            </p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <>
            <p className="text-gray-400 mb-4">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<AnimeGridSkeleton count={12} />}>
      <SearchContent />
    </Suspense>
  );
}
