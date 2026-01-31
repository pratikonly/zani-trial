'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export default function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isMounted = true;
    let localError: string | null = null;
    let localLoading = true;

    const updateState = () => {
      if (isMounted) {
        setError(localError);
        setIsLoading(localLoading);
      }
    };

    const loadVideo = () => {
      if (!isMounted) return;

      if (src.includes('.m3u8')) {
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
          });

          hlsRef.current = hls;

          hls.loadSource(src);
          hls.attachMedia(video);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (isMounted) {
              localLoading = false;
              updateState();
              video.play().catch((err) => {
                console.error('Autoplay failed:', err);
              });
            }
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS error:', data);
            if (data.fatal && isMounted) {
              localError = 'Failed to load video stream. Please try again later.';
              localLoading = false;
              updateState();
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = src;
          const handleLoadedMetadata = () => {
            if (isMounted) {
              localLoading = false;
              updateState();
            }
          };
          const handleError = () => {
            if (isMounted) {
              localError = 'Failed to load video stream. Please try again later.';
              localLoading = false;
              updateState();
            }
          };
          video.addEventListener('loadedmetadata', handleLoadedMetadata);
          video.addEventListener('error', handleError);
        } else {
          if (isMounted) {
            localError = 'Your browser does not support HLS streaming.';
            localLoading = false;
            updateState();
          }
        }
      } else {
        video.src = src;
        const handleLoadedMetadata = () => {
          if (isMounted) {
            localLoading = false;
            updateState();
          }
        };
        const handleError = () => {
          if (isMounted) {
            localError = 'Failed to load video. Please try again later.';
            localLoading = false;
            updateState();
          }
        };
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('error', handleError);
      }
    };

    localError = null;
    localLoading = true;
    updateState();
    loadVideo();

    return () => {
      isMounted = false;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  if (error) {
    return (
      <div className="w-full aspect-video bg-[#151b3d] rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-400 text-xl mb-2">⚠️</div>
          <p className="text-white mb-2">Episode not available</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#151b3d]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}
      <video
        ref={videoRef}
        controls
        poster={poster}
        className="w-full h-full"
        playsInline
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
