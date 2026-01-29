import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-2">Page Not Found</p>
        <p className="text-gray-600 mb-8 max-w-md">
          Sorry, the page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link 
            href="/"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200"
          >
            Go Home
          </Link>
          <Link 
            href="/dashboard"
            className="bg-white hover:bg-gray-50 text-indigo-600 px-8 py-3 rounded-lg font-semibold transition duration-200 border-2 border-indigo-600"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
