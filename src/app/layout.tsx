import Link from "next/link";
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Pirates Connect - Offline Learning",
  description: "A lightweight, offline-first learning platform for rural schools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <nav className="sticky top-0 z-50 bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
              <Link href="/" className="text-white text-2xl font-bold flex items-center gap-2">
                <span>🏴‍☠️</span>
                Pirates Connect
              </Link>

              <div className="flex gap-6">
                <Link href="/" className="text-white hover:text-indigo-100 font-medium">
                  Home
                </Link>
                <Link href="/login" className="text-white hover:text-indigo-100 font-medium">
                  Login
                </Link>
                <Link href="/signup" className="text-white hover:text-indigo-100 font-medium">
                  Sign Up
                </Link>
                <Link href="/dashboard" className="text-white hover:text-indigo-100 font-medium">
                  Dashboard
                </Link>
              </div>
            </div>
          </nav>

          <div className="min-h-[calc(100vh-80px)]">{children}</div>

          <footer className="bg-gray-800 text-white py-8 mt-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-400">
                © 2026 Pirates Connect. Building offline learning for rural education.
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
