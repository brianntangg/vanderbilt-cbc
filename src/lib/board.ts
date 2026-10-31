import { roles, type Role } from "@/content/roles";
import { site } from "@/content/site";
import { todayCentral } from "./dates";

export function openRoles(): Role[] {
  return roles.filter((role) => role.open);
}

export function isBoardApplicationOpen(today = todayCentral()): boolean {
  const { forceOpen, deadline } = site.board;
  if (forceOpen !== undefined) return forceOpen;
  return today <= deadline && openRoles().length > 0;
}

export function openPositionsLabel(count = openRoles().length): string {
  return `${count} open position${count === 1 ? "" : "s"}`;
}
