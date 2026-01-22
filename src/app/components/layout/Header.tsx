"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="h-14 bg-blue-600 text-white px-6 flex items-center justify-between">
      <h1 className="font-bold">MyApp</h1>

      <nav className="flex gap-4">
        <Link href="/">Home</Link>
        <Link href="/dashboard">Dashboard</Link>
      </nav>
    </header>
  );
}
