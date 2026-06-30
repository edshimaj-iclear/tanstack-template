import { redirect } from "next/navigation";
import { getSession, destroySession } from "@/lib/auth";
import { Sidebar } from "@/components/Sidebar";
import { ROLE_LABELS } from "@/lib/constants";

async function logout() {
  "use server";
  await destroySession();
  redirect("/login");
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (!user) redirect("/login");

  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-line bg-surface/80 backdrop-blur sticky top-0 z-10 flex items-center justify-end px-6 gap-3">
          <div className="flex items-center gap-3">
            <div className="text-right leading-tight">
              <div className="text-sm font-medium text-ink">{user.name}</div>
              <div className="text-[11px] text-faint font-mono">{ROLE_LABELS[user.role] ?? user.role}</div>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-clinic-50 text-clinic-700 font-display font-semibold text-sm">
              {initials}
            </span>
            <form action={logout}>
              <button className="btn-ghost btn-sm" type="submit">Dil</button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
