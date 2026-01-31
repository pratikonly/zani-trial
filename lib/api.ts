import { Anime, AnimeDetail, WatchData } from './types';

const ANILIST_API = 'https://graphql.anilist.co';
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://anime-api-pratik.vercel.app';

const SEARCH_QUERY = `
  query ($search: String) {
    Page(perPage: 12) {
      media(search: $search, type: ANIME) {
        id
        title { romaji english native }
        coverImage { large medium }
        description
        status
        episodes
        genres
        averageScore
      }
    }
  }
`;

const TRENDING_QUERY = `
  query {
    Page(perPage: 12) {
      media(type: ANIME, sort: TRENDING_DESC) {
        id
        title { romaji english native }
        coverImage { large medium }
        description
        status
        episodes
        genres
        averageScore
      }
    }
  }
`;

const POPULAR_QUERY = `
  query {
    Page(perPage: 12) {
      media(type: ANIME, sort: POPULARITY_DESC) {
        id
        title { romaji english native }
        coverImage { large medium }
        description
        status
        episodes
        genres
        averageScore
      }
    }
  }
`;

const DETAILS_QUERY = `
  query ($id: Int!) {
    Media(id: $id, type: ANIME) {
      id
      title { romaji english native }
      description
      coverImage { large medium }
      bannerImage
      status
      episodes
      genres
      averageScore
      studios { nodes { name } }
      characters { edges { node { name { full } image { large } } } }
    }
  }
`;

async function fetchAniList<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(ANILIST_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch AniList data');
  }

  const payload = await response.json();
  if (payload.errors) {
    throw new Error(payload.errors?.[0]?.message || 'AniList GraphQL error');
  }

  return payload.data as T;
}

function normalizeTitle(title?: { romaji?: string; english?: string; native?: string } | null): string {
  return title?.romaji || title?.english || title?.native || 'Untitled';
}

function stripHtml(description?: string | null): string {
  if (!description) return '';
  return description
    .replace(/<br\s*\/?\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

function formatStatus(status?: string | null): string {
  if (!status) return 'Unknown';
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function mapAnime(media: {
  id: number;
  title?: { romaji?: string; english?: string; native?: string } | null;
  coverImage?: { large?: string | null; medium?: string | null } | null;
  description?: string | null;
  status?: string | null;
  episodes?: number | null;
  genres?: string[] | null;
  averageScore?: number | null;
}): Anime {
  return {
    id: media.id,
    title: normalizeTitle(media.title),
    image: media.coverImage?.large || media.coverImage?.medium || '/placeholder.png',
    description: stripHtml(media.description),
    status: formatStatus(media.status),
    episodes: media.episodes ?? 0,
    genres: media.genres ?? [],
    averageScore: media.averageScore ?? null,
  };
}

export async function searchAnime(query: string): Promise<Anime[]> {
  try {
    const data = await fetchAniList<{ Page: { media: any[] } }>(SEARCH_QUERY, { search: query });
    return (data.Page.media || []).map(mapAnime);
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

export async function getTrendingAnime(): Promise<Anime[]> {
  try {
    const data = await fetchAniList<{ Page: { media: any[] } }>(TRENDING_QUERY);
    return (data.Page.media || []).map(mapAnime);
  } catch (error) {
    console.error('Trending error:', error);
    return [];
  }
}

export async function getPopularAnime(): Promise<Anime[]> {
  try {
    const data = await fetchAniList<{ Page: { media: any[] } }>(POPULAR_QUERY);
    return (data.Page.media || []).map(mapAnime);
  } catch (error) {
    console.error('Popular error:', error);
    return [];
  }
}

export async function getAnimeDetails(id: number): Promise<AnimeDetail | null> {
  try {
    const data = await fetchAniList<{ Media: any }>(DETAILS_QUERY, { id });
    const media = data.Media;
    if (!media) {
      return null;
    }

    return {
      id: media.id,
      title: normalizeTitle(media.title),
      image: media.coverImage?.large || media.coverImage?.medium || '/placeholder.png',
      bannerImage: media.bannerImage ?? null,
      description: stripHtml(media.description),
      status: formatStatus(media.status),
      episodes: media.episodes ?? 0,
      genres: media.genres ?? [],
      averageScore: media.averageScore ?? null,
      studios: media.studios?.nodes?.map((studio: { name: string }) => studio.name) ?? [],
      characters:
        media.characters?.edges?.map((edge: { node?: { name?: { full?: string }; image?: { large?: string } } }) => ({
          name: edge.node?.name?.full || 'Unknown',
          image: edge.node?.image?.large || '/placeholder.png',
        })) ?? [],
    };
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
