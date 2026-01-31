import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#151b3d] rounded-lg p-8 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-3xl font-bold text-white mb-4">
          404 - Page Not Found
        </h2>
        <p className="text-gray-400 mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
