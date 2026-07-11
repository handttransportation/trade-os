"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", shortName: "Home", href: "/" },
  { name: "Markets", shortName: "Markets", href: "/markets" },
  { name: "Scanner", shortName: "Scanner", href: "/scanner" },
  { name: "Strategies", shortName: "Strategy", href: "/strategies" },
  { name: "Portfolio", shortName: "Portfolio", href: "/portfolio" },
  { name: "Journal", shortName: "Journal", href: "/journal" },
  { name: "News", shortName: "News", href: "/news" },
  { name: "Settings", shortName: "Settings", href: "/settings" },
];

function isActiveRoute(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-800 bg-slate-950 md:block">
        <div className="border-b border-slate-800 px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-400">
            Trading Intelligence
          </p>

          <h1 className="mt-2 text-2xl font-bold text-white">
            Trade OS
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Research. Plan. Execute.
          </p>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            {links.map((link) => {
              const active = isActiveRoute(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-sky-600 text-white shadow-lg shadow-sky-950/30"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  <span>{link.name}</span>

                  <span
                    className={`h-1.5 w-1.5 rounded-full transition ${
                      active
                        ? "bg-white"
                        : "bg-slate-700 group-hover:bg-slate-500"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full border-t border-slate-800 p-4">
          <div className="rounded-lg bg-slate-900 p-4">
            <p className="text-xs font-semibold text-slate-300">
              Paper Trading Mode
            </p>

            <p className="mt-1 text-xs text-slate-500">
              No live orders are being submitted.
            </p>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-800 bg-slate-950/95 px-2 py-2 backdrop-blur md:hidden">
        <div className="flex gap-1 overflow-x-auto">
          {links.map((link) => {
            const active = isActiveRoute(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`min-w-[72px] flex-1 rounded-lg px-2 py-2 text-center text-xs font-medium transition ${
                  active
                    ? "bg-sky-600 text-white"
                    : "text-slate-500 hover:bg-slate-900 hover:text-white"
                }`}
              >
                {link.shortName}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
