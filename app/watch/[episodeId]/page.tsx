'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEpisodeStream, getEpisodes } from '@/lib/api';
import { WatchData, Episode } from '@/lib/types';
import VideoPlayer from '@/app/components/VideoPlayer';

interface EpisodeInfo {
  animeId: string;
  animeTitle: string;
  episodeNumber: number;
  episodeId: string;
}

function parseEpisodeId(episodeId: string): EpisodeInfo | null {
  // Try different parsing patterns
  // Pattern 1: {anime-id}-episode-{number}
  const parts1 = episodeId.split('-episode-');
  if (parts1.length === 2) {
    const animeId = parts1[0];
    const episodeNumber = parseInt(parts1[1], 10);
    if (animeId && !isNaN(episodeNumber)) {
      return {
        animeId,
        animeTitle: animeId.replace(/-/g, ' '),
        episodeNumber,
        episodeId,
      };
    }
  }

  // Pattern 2: {anime-id}-{number}
  const match2 = episodeId.match(/^(.+?)-(\d+)$/);
  if (match2) {
    const animeId = match2[1];
    const episodeNumber = parseInt(match2[2], 10);
    if (animeId && !isNaN(episodeNumber)) {
      return {
        animeId,
        animeTitle: animeId.replace(/-/g, ' '),
        episodeNumber,
        episodeId,
      };
    }
  }

  // Pattern 3: Just return the raw episodeId if parsing fails
  return {
    animeId: episodeId,
    animeTitle: 'Anime',
    episodeNumber: 1,
    episodeId,
  };
}

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const episodeId = params.episodeId as string;

  const [watchData, setWatchData] = useState<WatchData | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [episodeInfo, setEpisodeInfo] = useState<EpisodeInfo | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!episodeId) return;

      try {
        setLoading(true);
        setError(null);

        // Parse episode info from episodeId
        const parsedInfo = parseEpisodeId(episodeId);
        setEpisodeInfo(parsedInfo);

        if (!parsedInfo) {
          setError('Invalid episode ID format');
          setLoading(false);
          return;
        }

        // Fetch episode stream data
        const streamData = await getEpisodeStream(episodeId);
        
        if (!streamData || !streamData.sources || streamData.sources.length === 0) {
          setError('This episode cannot be played. The stream is currently unavailable.');
          setLoading(false);
          return;
        }

        setWatchData(streamData);

        // Fetch episodes list for navigation
        try {
          const episodesList = await getEpisodes(parsedInfo.animeId);
          setEpisodes(episodesList || []);
        } catch (epError) {
          console.error('Failed to fetch episodes list:', epError);
          // Continue without episode list
        }

        setLoading(false);
      } catch (err) {
        console.error('Watch data error:', err);
        setError('Failed to load video. The episode may not be available or the server is experiencing issues.');
        setLoading(false);
      }
    }

    fetchData();
  }, [episodeId]);

  const handleNextEpisode = () => {
    if (!episodeInfo || episodes.length === 0) return;
    
    const currentIndex = episodes.findIndex(
      (ep) => ep.episode_no === episodeInfo.episodeNumber
    );
    
    if (currentIndex !== -1 && currentIndex < episodes.length - 1) {
      const nextEpisode = episodes[currentIndex + 1];
      router.push(`/watch/${nextEpisode.id}`);
    }
  };

  const handlePreviousEpisode = () => {
    if (!episodeInfo || episodes.length === 0) return;
    
    const currentIndex = episodes.findIndex(
      (ep) => ep.episode_no === episodeInfo.episodeNumber
    );
    
    if (currentIndex > 0) {
      const prevEpisode = episodes[currentIndex - 1];
      router.push(`/watch/${prevEpisode.id}`);
    }
  };

  const hasNextEpisode = () => {
    if (!episodeInfo || episodes.length === 0) return false;
    return episodeInfo.episodeNumber < episodes.length;
  };

  const hasPreviousEpisode = () => {
    if (!episodeInfo || episodes.length === 0) return false;
    return episodeInfo.episodeNumber > 1;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e27]">
        <div className="container mx-auto px-4 py-8 md:px-6">
          <div className="w-full aspect-video bg-[#151b3d] rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-white text-sm">Loading episode...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !episodeInfo) {
    return (
      <div className="min-h-screen bg-[#0a0e27]">
        <div className="container mx-auto px-4 py-8 md:px-6">
          <div className="w-full aspect-video bg-[#151b3d] rounded-lg flex items-center justify-center">
            <div className="text-center p-6 max-w-2xl">
              <div className="text-red-400 text-4xl mb-4">⚠️</div>
              <h2 className="text-white text-2xl font-bold mb-2">Episode Not Available</h2>
              <p className="text-gray-300 mb-6">{error || 'Unknown error occurred'}</p>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Refresh
                </button>
                <button
                  onClick={() => router.back()}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      <div className="container mx-auto px-4 py-8 md:px-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white truncate">
                {episodeInfo.animeTitle}
              </h1>
              <p className="text-purple-300 text-lg">
                Episode {episodeInfo.episodeNumber}
              </p>
            </div>
            <button
              onClick={() => router.push(`/anime/${episodeInfo.animeId}`)}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              ← Back to Anime
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="mb-8">
          <VideoPlayer
            episodeId={episodeId}
            episodeNumber={episodeInfo.episodeNumber}
            animeTitle={episodeInfo.animeTitle}
            watchData={watchData}
            onNextEpisode={hasNextEpisode() ? handleNextEpisode : undefined}
            onPreviousEpisode={hasPreviousEpisode() ? handlePreviousEpisode : undefined}
            hasNextEpisode={hasNextEpisode()}
            hasPreviousEpisode={hasPreviousEpisode()}
          />
        </div>

        {/* Episode List for Navigation */}
        {episodes.length > 0 && (
          <div className="bg-[#151b3d] p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4">All Episodes</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2 max-h-64 overflow-y-auto">
              {episodes.map((episode) => {
                const isCurrent = episode.episode_no === episodeInfo.episodeNumber;
                return (
                  <button
                    key={episode.id}
                    onClick={() => router.push(`/watch/${episode.id}`)}
                    className={`p-3 rounded-lg text-center transition-all duration-200 ${
                      isCurrent
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#0a0e27] text-gray-300 hover:bg-purple-600/20 hover:text-white border border-purple-900/30 hover:border-purple-500'
                    }`}
                  >
                    <p className="text-sm font-semibold">{episode.episode_no}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quality Options Info */}
        {watchData.sources.length > 0 && (
          <div className="mt-6 bg-[#151b3d] p-6 rounded-lg">
            <h2 className="text-xl font-bold text-white mb-4">Available Quality Options</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {watchData.sources.map((source, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-[#0a0e27] border border-purple-900/30 rounded-lg text-white"
                >
                  {source.quality} {source.isM3U8 ? '(HLS)' : ''}
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm">
              Quality auto-selects the best option. Use the video settings to manually change quality.
            </p>
          </div>
        )}

        {/* Troubleshooting */}
        <div className="mt-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-900/30 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-2">Having issues?</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Try refreshing the page</li>
            <li>• Switch to a different quality in video settings</li>
            <li>• Check your internet connection</li>
            <li>• Some episodes may not be available in your region</li>
          </ul>
        </div>
      </div>
    </div>
  );
}