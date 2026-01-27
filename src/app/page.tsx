"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";
import ConfirmModal from "@/app/components/confirmModal.";

export default function Home() {
  const { user, login, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useUI();
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center gap-6 px-4 py-12
      bg-gradient-to-br from-brand-light via-white to-brand-light
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      text-gray-900 dark:text-gray-100 transition-colors"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
        Welcome to <span className="text-indigo-600">Pirates Connect</span>
      </h1>

      <p className="text-lg text-center max-w-xl text-gray-600 dark:text-gray-300">
        A lightweight, offline-first learning platform designed for rural schools with limited bandwidth.
      </p>

      {/* Auth Demo */}
      {isAuthenticated ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col gap-3">
          <span className="font-medium">Logged in as {user}</span>
          <button
            onClick={() => setShowModal(true)}
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

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="bg-indigo-600 text-white px-6 py-2 rounded"
        aria-label="Toggle Theme"
      >
        Toggle Theme ({theme})
      </button>

      {/* Modal */}
      <ConfirmModal
        isOpen={showModal}
        onConfirm={() => {
          logout();
          setShowModal(false);
        }}
        onClose={() => setShowModal(false)}
      />

      {/* Navigation */}
      <div className="flex flex-wrap gap-4 mt-4 justify-center">
        <Link
          href="/login"
          className="border border-indigo-600 px-6 py-2 rounded text-indigo-600 dark:text-indigo-400"
        >
          Go to Login Page
        </Link>
        <Link
          href="/signup"
          className="border border-indigo-600 px-6 py-2 rounded text-indigo-600 dark:text-indigo-400"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}
