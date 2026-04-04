"use client";

import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("isAuthenticated"));
  }, []);
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight flex items-center gap-2"
          >
            <img src="/images/logo.png" alt="Logo" className="h-16 w-auto" />
            <span className="text-xl font-bold text-black">WSDelgado</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            About
          </Link>
          <Link
            href={`/contact`}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Contact
          </Link>
          <Link
            href="/reports"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Reports
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <button
              className="px-4 py-2 text-gray-900 text-sm font-medium border border-gray-300 hover:border-gray-900 hover:cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                window.location.href = "/";
                localStorage.removeItem("isAuthenticated");
              }}
            >
              Log out
            </button>
          ) : (
            <button
              className="px-4 py-2 text-sm font-medium border border-gray-300 hover:border-gray-900 hover:cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                router.push("/login");
              }}
            >
              Log in
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        {
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        }
      </div>

      {/* Mobile Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white absolute w-full p-4 flex flex-col gap-4 shadow-lg">
          <Link
            href="/"
            className="block py-2 text-gray-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block py-2 text-gray-600"
            onClick={() => setIsMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block py-2 text-gray-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/reports"
            className="block py-2 text-gray-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Reports
          </Link>
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            <button className="w-full px-4 py-2 text-sm font-medium border text-gray-900 border-gray-300 rounded-lg">
              Log in
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
