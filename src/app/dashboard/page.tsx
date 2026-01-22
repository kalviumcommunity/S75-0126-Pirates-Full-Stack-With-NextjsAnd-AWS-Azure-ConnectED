"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  iat?: number;
  exp?: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwt.decode(token) as User;
        setUser(decoded);
      } catch {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-br from-indigo-50 to-blue-50 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.email}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
          >
            Logout
          </button>
        </div>

        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4">
            <div className="text-5xl">👋</div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Your Learning Hub</h2>
              <p className="text-gray-600 mt-2">
                Only authenticated users can access this page. Your data is secure with JWT authentication.
              </p>
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Your Account Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">User ID</p>
              <p className="text-lg font-mono text-gray-900">{user?.id}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-mono text-gray-900">{user?.email}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">JWT Status</p>
              <p className="text-lg font-semibold text-green-600">✓ Active</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Authentication</p>
              <p className="text-lg font-semibold text-blue-600">✓ Verified</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link 
            href="/users/1"
            className="bg-white hover:shadow-lg p-6 rounded-lg shadow-md transition duration-200"
          >
            <div className="text-3xl mb-2">👥</div>
            <h3 className="text-lg font-bold text-gray-900">View Users</h3>
            <p className="text-gray-600 text-sm mt-1">Browse user profiles and information</p>
          </Link>

          <div className="bg-white hover:shadow-lg p-6 rounded-lg shadow-md transition duration-200 cursor-pointer">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="text-lg font-bold text-gray-900">Learning Resources</h3>
            <p className="text-gray-600 text-sm mt-1">Access educational content offline</p>
          </div>

          <div className="bg-white hover:shadow-lg p-6 rounded-lg shadow-md transition duration-200 cursor-pointer">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-lg font-bold text-gray-900">Progress Tracker</h3>
            <p className="text-gray-600 text-sm mt-1">Monitor your learning journey</p>
          </div>
        </div>

        {/* Protected Content Info */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <div className="flex gap-4">
            <div className="text-2xl">🔒</div>
            <div>
              <h3 className="font-bold text-gray-900">Protected Route</h3>
              <p className="text-gray-700 mt-1">
                This dashboard is a protected route. It requires valid JWT authentication via middleware. 
                Your token is securely stored in an HTTP-only cookie and verified on every request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
