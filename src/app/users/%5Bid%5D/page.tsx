"use client";

import { useRouter, useParams } from "next/navigation";
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

interface UserData {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      try {
        const decoded = jwt.decode(token) as User;
        setUser(decoded);
        fetchUser(token, userId);
      } catch {
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
  }, [router, userId]);

  const fetchUser = async (token: string, id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      } else if (response.status === 404) {
        setError("User not found");
      } else {
        setError("Failed to fetch user details");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching user details");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gradient-to-br from-indigo-50 to-blue-50 min-h-[calc(100vh-80px)]">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">User Details</h1>
            <p className="text-gray-600 mt-2">Viewing user profile</p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/users"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
            >
              Back to Users
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error State */}
        {error ? (
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{error}</h3>
            <p className="text-gray-600 mb-6">The user you're looking for could not be found.</p>
            <Link
              href="/users"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition duration-200"
            >
              Return to Users List
            </Link>
          </div>
        ) : userData ? (
          <div className="space-y-6">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-indigo-600">
                    {userData.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{userData.name}</h2>
                  <p className="text-gray-600">{userData.email}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 border-t pt-6">
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-mono text-lg text-gray-900">{userData.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-mono text-lg text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Created</p>
                  <p className="text-lg text-gray-900">
                    {new Date(userData.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-lg text-green-600 font-semibold">✓ Active</p>
                </div>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-2">📚</div>
                <h3 className="text-sm text-gray-600">Courses Enrolled</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-2">✅</div>
                <h3 className="text-sm text-gray-600">Completed</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-3xl mb-2">⏱️</div>
                <h3 className="text-sm text-gray-600">Learning Hours</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
              </div>
            </div>

            {/* Activity Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex gap-4">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <h3 className="font-bold text-gray-900">Account Information</h3>
                  <p className="text-gray-700 mt-1">
                    This user profile is protected and accessible only to authenticated users with valid JWT tokens.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}
