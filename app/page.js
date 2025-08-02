import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-6 py-12">
      <div className="text-center max-w-2xl">
        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight">
          🚀 Bitcoin Trading Dashboard
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-gray-400 mb-10 leading-relaxed">
          Welcome to your live trading bot dashboard. Monitor real-time BTC signals, run backtests, and visualize performance insights.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            href="/Analytical-Dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg shadow-lg transition-transform hover:scale-105"
          >
            📈 Start Here
          </Link>
        </div>
      </div>
    </div>
  );
}
