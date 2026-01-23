"use client";

import { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";

export default function AddUser() {
  const { data } = useSWR("/api/users", fetcher);
  const [name, setName] = useState("");

  const handleAddUser = async () => {
    if (!name || !data) return;

    const optimisticUser = {
      id: Date.now(),
      name,
      email: "temp@user.com",
    };

    // 1️⃣ Optimistic update (UI updates immediately)
    mutate("/api/users", [...data, optimisticUser], false);

    // 2️⃣ Actual API call
    await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email: "temp@user.com",
      }),
    });

    // 3️⃣ Revalidate to sync with server
    mutate("/api/users");

    setName("");
  };

  return (
    <div className="mt-6">
      <input
        className="border px-3 py-1 mr-2 rounded"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New user name"
      />
      <button
        onClick={handleAddUser}
        className="bg-blue-600 text-white px-4 py-1 rounded"
      >
        Add User
      </button>
    </div>
  );
}
