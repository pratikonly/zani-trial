export interface Anime {
  id: string;
  title: string;
  image: string;
  releaseDate?: string;
  subOrDub?: string;
  url?: string;
}

export interface AnimeDetail {
  id: string;
  title: string;
  image: string;
  description: string;
  status: string;
  totalEpisodes: number;
  genres: string[];
  releaseDate?: string;
  subOrDub?: string;
  otherName?: string;
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  url?: string;
}

export interface VideoSource {
  url: string;
  quality: string;
  isM3U8: boolean;
}

export interface WatchData {
  headers?: {
    Referer: string;
  };
  sources: VideoSource[];
  download?: string;
}
