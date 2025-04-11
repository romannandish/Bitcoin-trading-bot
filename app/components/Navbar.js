import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">BTC Trading Bot</h1>
        <div className="space-x-4">
          <Link href="/" className="hover:text-yellow-400">Home</Link>
          <Link href="/about" className="hover:text-yellow-400">About</Link>
          <Link href="/contact" className="hover:text-yellow-400">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
