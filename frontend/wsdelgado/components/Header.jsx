"use client";

import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("isAuthenticated"));
    setUserRole(localStorage.getItem("user") || "");
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight flex items-center gap-2"
            aria-label="WSDelgado Builders Home"
          >
            <Image
              src="/images/logo.png"
              alt="WSDelgado Builders Logo"
              width={64}
              height={64}
              className="h-16 w-auto"
            />
            <span className="text-xl font-bold text-black">WSDelgado</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          <Link
            href={isAuthenticated ? "/dashboard" : "/"}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Home
          </Link>
          {!isAuthenticated && (
            <Link
              href="/about"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              About
            </Link>
          )}
          {!isAuthenticated && (
            <Link
              href={`/contact`}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Contact
            </Link>
          )}
          {isAuthenticated && (
            <Link
              href="/reports"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Reports
            </Link>
          )}
          {isAuthenticated && (
            <Link
              href="/employees"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Employees
            </Link>
          )}
          {isAuthenticated && userRole === "admin" && (
            <Link
              href="/accounts"
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Accounts
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <button
              className="px-4 py-2 text-gray-900 text-sm font-medium border border-black hover:border-gray-900 hover:cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                window.location.href = "/";
                localStorage.removeItem("isAuthenticated");
                localStorage.removeItem("user");
              }}
              aria-label="Log out of your account"
            >
              Log out
            </button>
          ) : (
            <button
              className="px-4 py-2 text-sm font-medium text-black border border-black hover:border-gray-900 hover:cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                router.push("/login");
              }}
              aria-label="Log into your account"
            >
              Log in
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
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
          {!isAuthenticated && (
            <Link
              href="/about"
              className="block py-2 text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
          )}
          {!isAuthenticated && (
            <Link
              href={`/contact`}
              className="block py-2 text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
          )}
          {isAuthenticated && (
            <Link
              href="/reports"
              className="block py-2 text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Reports
            </Link>
          )}
          {isAuthenticated && (
            <Link
              href="/employees"
              className="block py-2 text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Employees
            </Link>
          )}
          {isAuthenticated && userRole === "admin" && (
            <Link
              href="/accounts"
              className="block py-2 text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Accounts
            </Link>
          )}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            <button onClick={() => {
              window.location.href = "/login";
            }} className="w-full px-4 py-2 text-sm font-medium border text-gray-900 border-gray-300 rounded-lg">
              Log in
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
