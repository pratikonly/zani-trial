export interface Anime {
  id: number;
  title: string;
  image: string;
  description: string;
  status: string;
  episodes: number;
  genres: string[];
  averageScore?: number | null;
}

export interface CharacterSummary {
  name: string;
  image: string;
}

export interface AnimeDetail {
  id: number;
  title: string;
  image: string;
  bannerImage?: string | null;
  description: string;
  status: string;
  episodes: number;
  genres: string[];
  averageScore?: number | null;
  studios: string[];
  characters: CharacterSummary[];
}

export interface Episode {
  episode_no: number;
  id: string;
  data_id: string;
  title?: string;
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
