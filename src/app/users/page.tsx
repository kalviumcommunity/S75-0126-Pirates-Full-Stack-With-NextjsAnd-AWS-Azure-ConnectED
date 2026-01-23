"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import Link from "next/link";
import useSWR from "swr";
import { authFetcher } from "@/lib/authFetcher";

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

export default function UsersPage() {
  const router = useRouter();

  // Decode token once (for display + protection)
  let decodedUser: User | null = null;
  const token = Cookies.get("token");

  if (!token) {
    router.push("/login");
  } else {
    try {
      decodedUser = jwt.decode(token) as User;
    } catch {
      router.push("/login");
    }
  }

  const { data, error, isLoading } = useSWR<{ users: UserData[] }>(
    "/api/users",
    authFetcher,
    {
      revalidateOnFocus: true,
    }
  );

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <p className="text-red-600">❌ Failed to load users</p>
      </main>
    );
  }

  const users = data?.users ?? [];

  return (
    <main className="bg-gradient-to-br from-indigo-50 to-blue-50 min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Users Directory
            </h1>
            <p className="text-gray-600 mt-2">
              Authenticated as: {decodedUser?.email}
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Back to Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Users Grid */}
        {users.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((u) => (
              <div
                key={u.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-indigo-600">
                      {u.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{u.name}</h3>
                    <p className="text-sm text-gray-600">ID: {u.id}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-mono text-sm text-gray-800 break-all">
                      {u.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Joined</p>
                    <p className="text-sm text-gray-800">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <button className="mt-4 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold py-2 rounded-lg transition">
                  View Profile
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Users Found
            </h3>
            <p className="text-gray-600">
              Create a user account or invite someone to get started.
            </p>
          </div>
        )}

        {/* Protected Route Info */}
        <div className="mt-12 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex gap-4">
            <div className="text-2xl">🔒</div>
            <div>
              <h3 className="font-bold text-gray-900">Protected Route</h3>
              <p className="text-gray-700 mt-1">
                This page uses SWR with JWT-based authentication and automatic
                revalidation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
