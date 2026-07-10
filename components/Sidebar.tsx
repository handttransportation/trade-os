"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/" },
  { name: "Markets", href: "/markets" },
  { name: "Scanner", href: "/scanner" },
  { name: "Strategies", href: "/strategies" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Journal", href: "/journal" },
  { name: "News", href: "/news" },
  { name: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-2xl font-bold text-white">
          Trade OS
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Professional Trading Platform
        </p>
      </div>

      <nav className="p-4">
        <div className="space-y-2">
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-4 py-3 transition ${
                  active
                    ? "bg-sky-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
