"use client";
import { useState } from "react";
import ConfirmModal from "@/app/components/confirmModal.";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";

export default function Home() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useUI();
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold text-gray-900">
        Welcome to <span className="text-indigo-600">Pirates Connect</span>
      </h1>

      <p className="text-xl text-gray-600 text-center max-w-xl">
        A lightweight, offline-first learning platform designed for rural schools with limited bandwidth.
      </p>

      {/* Auth Demo */}
      {isAuthenticated ? (
        <div className="flex gap-4">
          <span className="font-medium">Logged in as {user}</span>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => login("PirateUser")}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Login (Context)
        </button>
      )}

      {/* UI Demo */}
      <button
        onClick={toggleTheme}
        className="bg-indigo-600 text-white px-6 py-2 rounded"
      >
        Toggle Theme ({theme})
      </button>


      <button onClick={() => setShowModal(true)}>Logout</button>

<ConfirmModal
  isOpen={showModal}
  onConfirm={() => {
    logout();
    setShowModal(false);
  }}
  onClose={() => setShowModal(false)}
/>
      {/* Navigation CTA */}
      <div className="flex gap-4 mt-4">
        <Link href="/login" className="border border-indigo-600 px-6 py-2 rounded text-indigo-600">
          Go to Login Page
        </Link>
        <Link href="/signup" className="border border-indigo-600 px-6 py-2 rounded text-indigo-600">
          Sign Up
        </Link>
      </div>
    </main>
  );
}
