// Helpers that enforce who can see what.
// These run on the server before showing any admin or learner page.
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireUser() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireAdmin() {
  const session = await requireUser();
  const role = (session.user as any).role;
  if (role !== "ORG_ADMIN" && role !== "SUPER_ADMIN") redirect("/learn");
  return session;
}

export async function requireSuperAdmin() {
  const session = await requireUser();
  if ((session.user as any).role !== "SUPER_ADMIN") redirect("/admin");
  return session;
}

export function getOrgId(session: any): string | null {
  return session?.user?.organizationId ?? null;
}
