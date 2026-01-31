'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { debounce } from '@/lib/utils';

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = debounce((query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, 300);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    handleSearch(value);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-900/20 bg-[#0a0e27]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0a0e27]/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Zani
          </div>
        </Link>

        <div className="flex-1 max-w-md mx-4">
          <input
            type="text"
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search anime..."
            className="w-full px-4 py-2 bg-[#151b3d] border border-purple-900/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
          />
        </div>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/disclaimer"
            className="text-sm font-medium text-gray-300 hover:text-purple-400 transition-colors"
          >
            Disclaimer
          </Link>
        </nav>
      </div>
    </header>
  );
}
