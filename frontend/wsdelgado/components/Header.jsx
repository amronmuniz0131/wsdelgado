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
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [userData, setUserData] = useState("")
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("isAuthenticated"));
    setUserRole(localStorage.getItem("user") || "");
    setUserData(JSON.parse(localStorage.getItem("userData")) || "")
    console.log(JSON.parse(localStorage.getItem("userData")))
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("userData");
    localStorage.removeItem("sent_amount")
    window.location.href = "/login";
  };

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
            href={isAuthenticated ? (userData?.first_login === 0 ? "#" : "/dashboard") : "/"}
            className={`text-sm font-medium transition-colors ${
              isAuthenticated && userData?.first_login === 0
                ? "text-gray-400 cursor-not-allowed pointer-events-none"
                : "text-gray-600 hover:text-gray-900"
            }`}
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
          {isAuthenticated && userRole === "admin" && (
            <Link
              href="/reports"
              className={`text-sm font-medium transition-colors ${
                userData?.first_login === 0
                  ? "text-gray-400 cursor-not-allowed pointer-events-none"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Reports
            </Link>
          )}
          {isAuthenticated && (
            <Link
              href="/profile"
              className={`text-sm font-medium transition-colors ${
                userData?.first_login === 0
                  ? "text-gray-400 cursor-not-allowed pointer-events-none"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Profile
            </Link>
          )}
          {isAuthenticated && (userRole === "admin" || userRole === "engineer") && (
            <Link
              href="/employees"
              className={`text-sm font-medium transition-colors ${
                userData?.first_login === 0
                  ? "text-gray-400 cursor-not-allowed pointer-events-none"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Employees
            </Link>
          )}
          {isAuthenticated && userRole === "admin" && (
            <Link
              href="/accounts"
              className={`text-sm font-medium transition-colors ${
                userData?.first_login === 0
                  ? "text-gray-400 cursor-not-allowed pointer-events-none"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Accounts
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <button
              className="px-4 py-2 text-gray-900 text-sm font-medium border border-black hover:border-gray-900 hover:cursor-pointer rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setShowLogoutDialog(true)}
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
          {isAuthenticated && userRole === "admin" && (
            <Link
              href="/reports"
              className={`block py-2 transition-colors ${
                userData?.first_login === 0
                  ? "text-gray-400 cursor-not-allowed pointer-events-none"
                  : "text-gray-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Reports
            </Link>
          )}
          {isAuthenticated && userRole === "admin" && (
            <Link
              href="/employees"
              className={`block py-2 transition-colors ${
                userData?.first_login === 0
                  ? "text-gray-400 cursor-not-allowed pointer-events-none"
                  : "text-gray-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Employees
            </Link>
          )}
          {isAuthenticated && userRole === "admin" && (
            <Link
              href="/accounts"
              className={`block py-2 transition-colors ${
                userData?.first_login === 0
                  ? "text-gray-400 cursor-not-allowed pointer-events-none"
                  : "text-gray-600"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Accounts
            </Link>
          )}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setShowLogoutDialog(true);
                }}
                className="w-full px-4 py-2 text-sm font-medium border text-red-600 border-red-200 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                Log out
              </button>
            ) : (
              <button
                onClick={() => {
                  router.push("/login");
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2 text-sm font-medium border text-gray-900 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-[100] h-screen flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full text-red-600">
                <X size={20} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Log out</h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to log out? You will need to log back in to access your dashboard.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="cursor-pointer px-6 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-all active:scale-95"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
