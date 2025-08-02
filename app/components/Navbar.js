"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-extrabold tracking-tight">
          💹 BTC Trading Bot
        </h1>
        <div className="flex gap-6 text-base font-medium">
          <Link
            href="/"
            className="hover:text-yellow-400 transition duration-200"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="hover:text-yellow-400 transition duration-200"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-yellow-400 transition duration-200"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
