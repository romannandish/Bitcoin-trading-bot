import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">🚀 Bitcoin Trading Dashboard</h1>
      <p className="text-lg mb-10 text-gray-400 text-center max-w-xl">
        Welcome to your live trading bot dashboard. Choose a chart type to start analyzing Bitcoin price movements.
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        <Link 
          href="/trading-view"
          className="bg-blue-600 hover:bg-blue-700 transition-all px-8 py-4 rounded-xl text-xl shadow-lg text-center"
        >
          📈 Start Here
        </Link>
      </div>
    </div>
  );
}