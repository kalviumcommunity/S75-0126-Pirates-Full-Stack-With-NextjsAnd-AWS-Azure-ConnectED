export const roles = {
  admin: ["create", "read", "update", "delete"],
  editor: ["read", "update"],
  viewer: ["read"],
} as const;

export type Role = keyof typeof roles;

// ✅ This line is the KEY FIX
export type Permission = typeof roles[Role][number];
