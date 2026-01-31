'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getAnimeDetails } from '@/lib/api';
import { AnimeDetail } from '@/lib/types';
import { DetailsSkeleton } from '@/app/components/SkeletonLoader';

export default function AnimeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 50;

  useEffect(() => {
    async function fetchDetails() {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getAnimeDetails(id);
        if (data) {
          setAnime(data);
        } else {
          setError('Anime not found');
        }
      } catch (err) {
        console.error('Details error:', err);
        setError('Failed to load anime details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e27]">
        <div className="container mx-auto px-4 py-8 md:px-6">
          <DetailsSkeleton />
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-[#0a0e27]">
        <div className="container mx-auto px-4 py-8 md:px-6">
          <div className="text-center py-12 bg-[#151b3d] rounded-lg">
            <div className="text-red-400 text-xl mb-2">⚠️</div>
            <p className="text-white mb-2">Failed to load anime</p>
            <p className="text-gray-400 text-sm">{error}</p>
            <Link
              href="/"
              className="inline-block mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const episodes = anime.episodes || [];
  const totalPages = Math.ceil(episodes.length / episodesPerPage);
  const startIndex = (currentPage - 1) * episodesPerPage;
  const endIndex = startIndex + episodesPerPage;
  const currentEpisodes = episodes.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="aspect-[2/3] relative overflow-hidden rounded-lg shadow-2xl shadow-purple-500/20">
              <Image
                src={anime.image || '/placeholder.png'}
                alt={anime.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 320px"
                priority
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {anime.title}
            </h1>

            {anime.otherName && (
              <p className="text-gray-400 mb-4">{anime.otherName}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {anime.genres?.map((genre) => (
                <span
                  key={genre}
                  className="px-3 py-1 text-sm rounded-full bg-purple-600/20 text-purple-300 border border-purple-600/30"
                >
                  {genre}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#151b3d] p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Status</p>
                <p className="text-white font-semibold">{anime.status || 'Unknown'}</p>
              </div>
              <div className="bg-[#151b3d] p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Total Episodes</p>
                <p className="text-white font-semibold">{anime.totalEpisodes || episodes.length}</p>
              </div>
              {anime.releaseDate && (
                <div className="bg-[#151b3d] p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Release Date</p>
                  <p className="text-white font-semibold">{anime.releaseDate}</p>
                </div>
              )}
              {anime.subOrDub && (
                <div className="bg-[#151b3d] p-4 rounded-lg">
                  <p className="text-gray-400 text-sm mb-1">Type</p>
                  <p className="text-white font-semibold">{anime.subOrDub}</p>
                </div>
              )}
            </div>

            <div className="bg-[#151b3d] p-6 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-3">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed">
                {anime.description || 'No description available.'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#151b3d] p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Episodes</h2>

          {episodes.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No episodes available</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {currentEpisodes.map((episode) => (
                  <Link
                    key={episode.id}
                    href={`/watch/${episode.id}`}
                    className="bg-[#0a0e27] hover:bg-purple-600/20 border border-purple-900/30 hover:border-purple-500 rounded-lg p-4 text-center transition-all duration-200 hover:scale-105"
                  >
                    <p className="text-white font-semibold">Episode {episode.number}</p>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-white px-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
