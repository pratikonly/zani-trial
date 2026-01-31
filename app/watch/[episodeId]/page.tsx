'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getWatchData } from '@/lib/api';
import { WatchData } from '@/lib/types';
import VideoPlayer from '@/app/components/VideoPlayer';

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const episodeId = params.episodeId as string;

  const [watchData, setWatchData] = useState<WatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWatchData() {
      if (!episodeId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getWatchData(episodeId);
        if (data && data.sources && data.sources.length > 0) {
          setWatchData(data);
        } else {
          setError('No video sources available for this episode.');
        }
      } catch (err) {
        console.error('Watch data error:', err);
        setError('Failed to load video. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchWatchData();
  }, [episodeId]);

  const extractAnimeIdFromEpisodeId = (epId: string): string | null => {
    const parts = epId.split('-episode-');
    if (parts.length > 0) {
      return parts[0];
    }
    return null;
  };

  const animeId = extractAnimeIdFromEpisodeId(episodeId);

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

  if (error || !watchData) {
    return (
      <div className="min-h-screen bg-[#0a0e27]">
        <div className="container mx-auto px-4 py-8 md:px-6">
          <div className="w-full aspect-video bg-[#151b3d] rounded-lg flex items-center justify-center">
            <div className="text-center p-6">
              <div className="text-red-400 text-xl mb-2">⚠️</div>
              <p className="text-white mb-2">Episode not available</p>
              <p className="text-gray-400 text-sm mb-4">{error}</p>
              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const bestSource = watchData.sources.find((s) => s.quality === 'default' || s.quality === 'auto') || watchData.sources[0];

  return (
    <div className="min-h-screen bg-[#0a0e27]">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {episodeId.replace(/-/g, ' ').replace(/episode/i, 'Episode')}
          </h1>
          {animeId && (
            <button
              onClick={() => router.push(`/anime/${animeId}`)}
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
            >
              ← Back to Anime Details
            </button>
          )}
        </div>

        <div className="mb-8">
          <VideoPlayer src={bestSource.url} />
        </div>

        <div className="bg-[#151b3d] p-6 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">Available Quality Options</h2>
          <div className="flex flex-wrap gap-2">
            {watchData.sources.map((source, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-[#0a0e27] border border-purple-900/30 rounded-lg text-white"
              >
                {source.quality} {source.isM3U8 ? '(HLS)' : ''}
              </div>
            ))}
          </div>
          {watchData.download && (
            <div className="mt-4">
              <a
                href={watchData.download}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Download Episode
              </a>
            </div>
          )}
        </div>

        <div className="mt-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg p-4">
          <p className="text-gray-300 text-sm text-center">
            Having issues? Try refreshing the page or switching to a different quality.
          </p>
        </div>
      </div>
    </div>
  );
}
