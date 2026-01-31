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
  const id = Number(params.id);
  const isValidId = Number.isFinite(id);

  const [anime, setAnime] = useState<AnimeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const episodesPerPage = 50;

  useEffect(() => {
    async function fetchDetails() {
      if (!isValidId) {
        setError('Invalid anime ID.');
        setLoading(false);
        return;
      }

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
  }, [id, isValidId]);

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

  const totalEpisodes = anime.episodes || 0;
  const totalPages = Math.ceil(totalEpisodes / episodesPerPage);
  const startIndex = (currentPage - 1) * episodesPerPage + 1;
  const endIndex = Math.min(startIndex + episodesPerPage - 1, totalEpisodes);
  const currentEpisodes = Array.from({ length: Math.max(0, endIndex - startIndex + 1) }, (_, index) => startIndex + index);

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      <div className="container mx-auto px-4 py-8 md:px-6">
        {anime.bannerImage && (
          <div className="relative mb-8 h-40 md:h-56 overflow-hidden rounded-lg">
            <Image
              src={anime.bannerImage}
              alt={`${anime.title} banner`}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e27] via-[#0a0e27]/70 to-transparent" />
          </div>
        )}

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
                <p className="text-white font-semibold">{anime.episodes || 'TBA'}</p>
              </div>
              <div className="bg-[#151b3d] p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Score</p>
                <p className="text-white font-semibold">
                  {anime.averageScore ? `${anime.averageScore}%` : 'N/A'}
                </p>
              </div>
              <div className="bg-[#151b3d] p-4 rounded-lg">
                <p className="text-gray-400 text-sm mb-1">Studios</p>
                <p className="text-white font-semibold">
                  {anime.studios.length > 0 ? anime.studios.join(', ') : 'Unknown'}
                </p>
              </div>
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

          {totalEpisodes === 0 ? (
            <p className="text-gray-400 text-center py-8">Episode count not available</p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {currentEpisodes.map((episodeNumber) => (
                  <Link
                    key={episodeNumber}
                    href={`/watch/${anime.id}-episode-${episodeNumber}`}
                    className="bg-[#0a0e27] hover:bg-purple-600/20 border border-purple-900/30 hover:border-purple-500 rounded-lg p-4 text-center transition-all duration-200 hover:scale-105"
                  >
                    <p className="text-white font-semibold">Episode {episodeNumber}</p>
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

              <p className="mt-4 text-sm text-gray-400 text-center">
                Episodes are sourced from external providers and may be limited.
              </p>
            </>
          )}
        </div>

        {anime.characters.length > 0 && (
          <div className="mt-8 bg-[#151b3d] p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-white mb-4">Main Characters</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {anime.characters.slice(0, 10).map((character) => (
                <div key={character.name} className="text-center">
                  <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg mb-2">
                    <Image
                      src={character.image}
                      alt={character.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 200px"
                    />
                  </div>
                  <p className="text-sm text-white font-medium line-clamp-2">{character.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
