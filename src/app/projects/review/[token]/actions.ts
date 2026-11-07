"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { reviewContext } from "@/lib/projects/config";
import { decideReview } from "@/lib/projects/review";

async function decide(token: string, action: "approve" | "reject") {
  const outcome = await decideReview(token, action, reviewContext());
  if (outcome === "approved") revalidatePath("/projects");
  redirect(`/projects/review/${encodeURIComponent(token)}?done=${outcome}`);
}

export async function approveProject(token: string) {
  await decide(token, "approve");
}

export async function rejectProject(token: string) {
  await decide(token, "reject");
}
