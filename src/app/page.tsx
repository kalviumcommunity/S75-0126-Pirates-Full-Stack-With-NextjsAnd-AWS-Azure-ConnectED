import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-indigo-600">Pirates Connect</span> 🏴‍☠️
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A lightweight, offline-first learning platform designed for rural schools with limited bandwidth. 
            Access learning content reliably, even with slow or intermittent internet.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              href="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 shadow-lg"
            >
              Login
            </Link>
            <Link 
              href="/signup"
              className="bg-white hover:bg-gray-50 text-indigo-600 px-8 py-3 rounded-lg font-semibold transition duration-200 border-2 border-indigo-600"
            >
              Sign Up
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Lightweight Design</h3>
            <p className="text-gray-600">
              Optimized for low bandwidth environments. Fast loading and minimal data usage.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">🔌</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Offline First</h3>
            <p className="text-gray-600">
              Access your content even without internet connection. Sync when connected.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Content</h3>
            <p className="text-gray-600">
              Curated educational resources designed for student success and engagement.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600">1000+</div>
            <p className="text-gray-600 mt-2">Learning Resources</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600">50+</div>
            <p className="text-gray-600 mt-2">Schools Connected</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600">5000+</div>
            <p className="text-gray-600 mt-2">Active Students</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-indigo-600">24/7</div>
            <p className="text-gray-600 mt-2">Available Offline</p>
          </div>
        </div>
      </div>
    </main>
  );
}
