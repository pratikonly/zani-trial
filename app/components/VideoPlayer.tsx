'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { WatchData, VideoSource } from '@/lib/types';

interface VideoPlayerProps {
  episodeId: string;
  episodeNumber: number;
  animeTitle: string;
  watchData: WatchData | null;
  onNextEpisode?: () => void;
  onPreviousEpisode?: () => void;
  hasNextEpisode?: boolean;
  hasPreviousEpisode?: boolean;
}

export default function VideoPlayer({
  episodeId,
  episodeNumber,
  animeTitle,
  watchData,
  onNextEpisode,
  onPreviousEpisode,
  hasNextEpisode = false,
  hasPreviousEpisode = false,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<string>('auto');
  const [showQualitySelector, setShowQualitySelector] = useState(false);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !watchData) return;

    let isMounted = true;
    setIsLoading(true);
    setError(null);

    // Find best quality source (default/auto or highest quality)
    const bestSource = watchData.sources.find((s) => s.quality === 'default' || s.quality === 'auto') || 
                       watchData.sources[0];
    
    if (!bestSource) {
      setError('No video sources available');
      setIsLoading(false);
      return;
    }

    const loadVideo = () => {
      if (!isMounted || !video) return;

      // Set referer header if provided
      if (watchData.headers?.Referer) {
        // Note: Setting headers on video element is not directly possible
        // The API should handle this, or we might need to proxy the request
        console.log('Referer header required:', watchData.headers.Referer);
      }

      if (bestSource.url.includes('.m3u8') || bestSource.isM3U8) {
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            maxBufferLength: 120,
            maxMaxBufferLength: 300,
          });

          hlsRef.current = hls;

          hls.loadSource(bestSource.url);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (isMounted) {
              setIsLoading(false);
              setCurrentQuality('auto');
              // Auto-play when ready
              video.play().catch((err) => {
                console.error('Autoplay failed:', err);
              });
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS error:', data);
            if (data.fatal && isMounted) {
              handleVideoError('Video stream error. Please try again or select different quality.');
            }
          });

          hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
            if (isMounted && data.level !== undefined) {
              const level = hls.levels[data.level];
              if (level) {
                setCurrentQuality(`${level.height}p`);
              }
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari)
          video.src = bestSource.url;
          const handleLoadedMetadata = () => {
            if (isMounted) {
              setIsLoading(false);
            }
          };
          const handleError = () => {
            handleVideoError('Failed to load video stream. Please try again.');
          };
          video.addEventListener('loadedmetadata', handleLoadedMetadata);
          video.addEventListener('error', handleError);
        } else {
          handleVideoError('Your browser does not support HLS streaming.');
        }
      } else {
        // Regular video source
        video.src = bestSource.url;
        const handleLoadedMetadata = () => {
          if (isMounted) {
            setIsLoading(false);
          }
        };
        const handleError = () => {
          handleVideoError('Failed to load video. Please try again.');
        };
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('error', handleError);
      }

      // Set up event listeners
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);
      
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);

      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
      };
    };

    const handleVideoError = (message: string) => {
      if (isMounted) {
        setError(message);
        setIsLoading(false);
      }
    };

    const cleanup = loadVideo();

    return () => {
      isMounted = false;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [episodeId, watchData]);

  const handleQualityChange = (source: VideoSource) => {
    if (!videoRef.current || !watchData) return;
    
    setIsLoading(true);
    setCurrentQuality(source.quality);
    
    // Reload video with new source
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    
    const video = videoRef.current;
    video.pause();
    video.src = '';
    
    // Create a minimal watchData object with just the selected source
    const newWatchData: WatchData = {
      ...watchData,
      sources: [source],
    };
    
    // Use a minimal version of the useEffect logic for quality switching
    if (source.url.includes('.m3u8') || source.isM3U8) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });
        
        hlsRef.current = hls;
        hls.loadSource(source.url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          video.play().catch(() => {});
        });
        
        hls.on(Hls.Events.ERROR, () => {
          setError('Failed to switch quality. Please try again.');
          setIsLoading(false);
        });
      } else {
        setError('Your browser does not support HLS streaming.');
        setIsLoading(false);
      }
    } else {
      video.src = source.url;
      video.load();
      video.play().catch(() => {});
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="w-full aspect-video bg-[#151b3d] rounded-lg flex flex-col items-center justify-center relative">
        <div className="text-center p-6">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h3 className="text-white text-xl font-bold mb-2">Episode Not Available</h3>
          <p className="text-gray-300 mb-6 max-w-md">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!watchData || watchData.sources.length === 0) {
    return (
      <div className="w-full aspect-video bg-[#151b3d] rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-sm">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#151b3d] z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Video Player */}
      <video
        ref={videoRef}
        controls
        className="w-full h-full"
        playsInline
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>

      {/* Episode Info Overlay */}
      {!isLoading && (
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4">
            <h2 className="text-white text-lg md:text-xl font-bold truncate">{animeTitle}</h2>
            <p className="text-purple-300 text-sm">Episode {episodeNumber}</p>
            <p className="text-gray-300 text-xs mt-1">Click settings in video controls to change quality</p>
          </div>
        </div>
      )}

      {/* Quality Selector */}
      {watchData.sources.length > 1 && !isLoading && (
        <div className="absolute top-4 right-4 z-10">
          <div className="relative">
            <button
              onClick={() => setShowQualitySelector(!showQualitySelector)}
              className="bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-black/80 transition-colors"
            >
              {currentQuality || 'Quality'} ▼
            </button>
            
            {showQualitySelector && (
              <div className="absolute right-0 mt-2 w-40 bg-[#151b3d] border border-purple-900/30 rounded-lg shadow-xl overflow-hidden">
                {watchData.sources.map((source, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleQualityChange(source);
                      setShowQualitySelector(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-600/20 transition-colors ${
                      currentQuality === source.quality ? 'bg-purple-600/40 text-white' : 'text-gray-300'
                    }`}
                  >
                    {source.quality} {source.isM3U8 ? '(HLS)' : ''}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-10">
        <div className="flex justify-between items-end">
          {hasPreviousEpisode && onPreviousEpisode && (
            <button
              onClick={onPreviousEpisode}
              className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/80 transition-colors flex items-center gap-2"
            >
              ← Previous Episode
            </button>
          )}
          
          {hasNextEpisode && onNextEpisode && (
            <button
              onClick={onNextEpisode}
              className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black/80 transition-colors flex items-center gap-2 ml-auto"
            >
              Next Episode →
            </button>
          )}
        </div>
      </div>

      {/* Download Button */}
      {watchData.download && !isLoading && (
        <div className="absolute bottom-4 right-4 z-10">
          <a
            href={watchData.download}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
          >
            Download
          </a>
        </div>
      )}
    </div>
  );
}