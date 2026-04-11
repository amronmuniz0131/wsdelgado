import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xl font-bold">WSDelgado</div>
        <p className="text-gray-500 text-sm">
          © 2026 WSDelgado Builders. All rights reserved.
        </p>
        <div className="flex gap-6">
          <Link
            href="https://facebook.com"
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            Facebook
          </Link>
          <Link
            href="https://instagram.com"
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            Instagram
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            LinkedIn
          </Link>
        </div>
      </div>
    </footer>
  );
}
