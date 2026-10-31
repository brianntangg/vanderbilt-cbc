// Board application logic. Applications close automatically after site.board.deadline.
import { roles, type Role } from "@/content/roles";
import { site } from "@/content/site";
import { todayCentral } from "./dates";

/** Open roles, in roles.ts order. */
export function openRoles(): Role[] {
  return roles.filter((role) => role.open);
}

/**
 * Open if forceOpen is true, or if forceOpen is unset, today (Central Time)
 * is on or before the deadline, and at least one role is open.
 */
export function isBoardApplicationOpen(today = todayCentral()): boolean {
  const { forceOpen, deadline } = site.board;
  if (forceOpen !== undefined) return forceOpen;
  return today <= deadline && openRoles().length > 0;
}

/** "1 open position" / "5 open positions". */
export function openPositionsLabel(count = openRoles().length): string {
  return `${count} open position${count === 1 ? "" : "s"}`;
}
