import { roles, Role, Permission } from "@/config/roles";

export function hasPermission(
  role: Role,
  action: Permission
): boolean {
  const allowed = (roles[role] as readonly Permission[])?.includes(action) ?? false;

  console.log(
    `[RBAC] role=${role} action=${action} => ${
      allowed ? "ALLOWED" : "DENIED"
    }`
  );

  return allowed;
}
