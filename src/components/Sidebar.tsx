"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar({
  role,
  userName,
}: {
  role: string;
  userName: string;
}) {
  const pathname = usePathname();

  const links =
    role === "SUPER_ADMIN"
      ? [
          { href: "/super-admin", label: "Overview" },
          { href: "/super-admin/courses", label: "Course Library" },
          { href: "/super-admin/course-builder", label: "AI Course Builder" },
          { href: "/super-admin/organizations", label: "Clinics" },
        ]
      : role === "ORG_ADMIN"
      ? [
          { href: "/admin", label: "Dashboard" },
          { href: "/admin/courses", label: "Courses" },
          { href: "/admin/users", label: "Staff" },
          { href: "/admin/assignments", label: "Assignments" },
        ]
      : [
          { href: "/learn", label: "My Training" },
        ];

  return (
    <aside className="w-60 min-h-screen bg-bluee-navy text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="text-2xl font-bold tracking-tight">
          B<span className="text-bluee-steel">.</span>L
          <span className="text-bluee-steel">.</span>U
          <span className="text-bluee-orange">.</span>E
          <span className="text-bluee-olive">.</span>E
        </div>
        <div className="text-xs text-white/50 mt-1">
          {role === "SUPER_ADMIN"
            ? "Platform HQ"
            : role === "ORG_ADMIN"
            ? "Clinic Admin"
            : "Learner"}
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`block px-3 py-2 rounded-lg text-sm transition ${
                active
                  ? "bg-bluee-steel text-white"
                  : "text-white/70 hover:bg-white/10"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="text-sm text-white/80 mb-2 truncate">{userName}</div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-xs text-white/50 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
