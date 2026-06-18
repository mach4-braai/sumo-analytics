import Link from "next/link";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard" },
  { href: "/rikishi", label: "Rikishi" },
  { href: "/head-to-head", label: "Head to Head" },
  { href: "/basho", label: "Basho" },
  { href: "/kimarite", label: "Kimarite" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-56 bg-surface-900 border-r border-surface-700 flex flex-col">
      <div className="p-5 border-b border-surface-700">
        <Link href="/" className="text-lg font-bold tracking-tight text-white">
          Sumo Analytics
        </Link>
      </div>
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-surface-800 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
