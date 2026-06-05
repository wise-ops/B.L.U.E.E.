import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const role = (session.user as any).role;
  if (role === "SUPER_ADMIN") redirect("/super-admin");
  if (role === "ORG_ADMIN") redirect("/admin");
  redirect("/learn");
}
