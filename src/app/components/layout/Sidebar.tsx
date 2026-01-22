"use client";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <ul className="space-y-2">
        <li><Link href="/dashboard">Overview</Link></li>
        <li><Link href="/users">Users</Link></li>
        <li><Link href="/settings">Settings</Link></li>
      </ul>
    </aside>
  );
}
