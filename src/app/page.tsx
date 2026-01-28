"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";
import ConfirmModal from "@/app/components/confirmModal.";
import { hasPermission } from "@/lib/hasPermission";

export default function Home() {
  const { user, login, logout, isAuthenticated, role } = useAuth();
  const { theme, toggleTheme } = useUI();
  const [showModal, setShowModal] = useState(false);

  return (
    <main className="min-h-screen flex flex-col items-center gap-6 px-4 py-12
      bg-gradient-to-br from-brand-light via-white to-brand-light
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
      transition-colors"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
        Welcome to <span className="text-indigo-600">Pirates Connect</span>
      </h1>

      <p className="text-lg text-center max-w-xl text-gray-600 dark:text-gray-300">
        Offline-first learning platform for rural schools.
      </p>

      {isAuthenticated ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <span>Logged in as {user}</span>
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
          Login
        </button>
      )}

      <button
        onClick={toggleTheme}
        className="bg-indigo-600 text-white px-6 py-2 rounded"
      >
        Toggle Theme ({theme})
      </button>

      {/* RBAC UI */}
      {hasPermission(role, "delete") && (
        <button className="bg-red-600 text-white px-6 py-2 rounded">
          Delete User
        </button>
      )}

      <ConfirmModal
        isOpen={showModal}
        onConfirm={() => {
          logout();
          setShowModal(false);
        }}
        onClose={() => setShowModal(false)}
      />

      <div className="flex gap-4">
        <Link href="/login">Login</Link>
        <Link href="/signup">Signup</Link>
      </div>
    </main>
  );
}
