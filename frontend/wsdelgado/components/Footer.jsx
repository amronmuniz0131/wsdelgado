import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-12" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-xl font-bold">WSDelgado Builders</div>
        <p className="text-gray-500 text-sm">
          © 2026 WSDelgado Builders. All rights reserved. Professional construction services in the Philippines.
        </p>
        <nav className="flex gap-6" aria-label="Social Media">
          <Link
            href="https://facebook.com"
            className="text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Visit WSDelgado Builders on Facebook"
          >
            Facebook
          </Link>
          <Link
            href="https://instagram.com"
            className="text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Follow WSDelgado Builders on Instagram"
          >
            Instagram
          </Link>
          <Link
            href="#"
            className="text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Connect with WSDelgado Builders on LinkedIn"
          >
            LinkedIn
          </Link>
        </nav>
      </div>
    </footer>
  );
}
