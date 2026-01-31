import { Anime, AnimeDetail, WatchData } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://anime-api-pratik.vercel.app';

export async function searchAnime(query: string): Promise<Anime[]> {
  try {
    const response = await fetch(`${API_BASE}/anime/gogoanime/${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search anime');
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export async function getAnimeDetails(id: string): Promise<AnimeDetail | null> {
  try {
    const response = await fetch(`${API_BASE}/anime/gogoanime/info/${encodeURIComponent(id)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch anime details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Details error:', error);
    return null;
  }
}

export async function getWatchData(episodeId: string): Promise<WatchData | null> {
  try {
    const response = await fetch(`${API_BASE}/anime/gogoanime/watch/${encodeURIComponent(episodeId)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch watch data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Watch data error:', error);
    return null;
  }
}

export async function getTrendingAnime(): Promise<Anime[]> {
  try {
    const response = await fetch(`${API_BASE}/anime/gogoanime/top-airing`);
    if (!response.ok) {
      const searchResponse = await searchAnime('one piece');
      return searchResponse.slice(0, 12);
    }
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Trending error:', error);
    const fallback = await searchAnime('naruto');
    return fallback.slice(0, 12);
  }
}
