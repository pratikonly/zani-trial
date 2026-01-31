import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-purple-900/20 bg-[#0a0e27] mt-auto">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center space-x-2">
            <div className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Zani
            </div>
            <span className="text-sm text-gray-400">© 2024 All rights reserved</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              href="/disclaimer"
              className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
            >
              Disclaimer
            </Link>
            <span className="text-sm text-gray-400">
              Made with ❤️ for anime fans
            </span>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">
          This site does not store any files on our server. All content is provided by non-affiliated third parties.
        </div>
      </div>
    </footer>
  );
}
