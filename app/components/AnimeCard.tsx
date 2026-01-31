import Image from 'next/image';
import Link from 'next/link';
import { Anime } from '@/lib/types';

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link href={`/anime/${anime.id}`}>
      <div className="group relative overflow-hidden rounded-lg bg-[#151b3d] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/20">
        <div className="aspect-[2/3] relative overflow-hidden">
          <Image
            src={anime.image || '/placeholder.png'}
            alt={anime.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-3">
          <h3 className="font-semibold text-white line-clamp-2 text-sm mb-1">
            {anime.title}
          </h3>
          {anime.releaseDate && (
            <p className="text-xs text-gray-400">{anime.releaseDate}</p>
          )}
          {anime.subOrDub && (
            <span className="inline-block mt-2 px-2 py-1 text-xs rounded bg-purple-600/20 text-purple-300">
              {anime.subOrDub}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
