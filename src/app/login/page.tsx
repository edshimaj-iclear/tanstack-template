import { redirect } from "next/navigation";
import { getSession, verifyCredentials, createSession } from "@/lib/auth";
import { logAction } from "@/lib/utils";

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const user = await verifyCredentials(email, password);
  if (!user) redirect("/login?e=1");
  await createSession(user);
  await logAction({ userId: user.id, action: "LOGIN", entity: "User", entityId: user.id });
  redirect("/dashboard");
}

export default async function LoginPage({ searchParams }: { searchParams: { e?: string } }) {
  if (await getSession()) redirect("/dashboard");

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand / thesis side */}
      <div className="hidden lg:flex flex-col justify-between bg-ink text-white p-12 relative overflow-hidden">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-clinic-500 text-white font-display font-bold">iC</span>
          <span className="font-display font-semibold text-lg">iClear QMS</span>
        </div>
        <div className="relative z-10">
          <div className="label text-clinic-200 mb-3">Sistemi i Menaxhimit të Cilësisë</div>
          <h1 className="font-display text-4xl font-semibold leading-tight max-w-md">
            Çdo aligner i gjurmueshëm, i riprodhueshëm dhe klinikisht i sigurt.
          </h1>
          <p className="text-white/60 mt-4 max-w-md text-sm leading-relaxed">
            Nga pranimi i skanimit deri te dërgesa — një histori e plotë dixhitale (DHR) për çdo rast,
            e ndërtuar mbi ISO 13485 dhe gjurmueshmëri të plotë.
          </p>
        </div>
        <div className="relative z-10 font-mono text-[12px] text-white/40 space-y-1">
          <div>RECEIVED → DESIGN → PRINTING → THERMOFORMING → QC → SHIPPING</div>
        </div>
        {/* subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-clinic-500 text-white font-display font-bold">iC</span>
            <span className="font-display font-semibold text-lg">iClear QMS</span>
          </div>
          <h2 className="font-display text-2xl font-semibold">Hyr në sistem</h2>
          <p className="text-sm text-muted mt-1">Vendos kredencialet për të vazhduar.</p>

          {searchParams.e && (
            <div className="mt-4 rounded-lg bg-failbg text-fail text-sm px-3 py-2">
              Email ose fjalëkalim i gabuar.
            </div>
          )}

          <form action={login} className="mt-6 space-y-4">
            <div>
              <label className="label block mb-1.5">Email</label>
              <input name="email" type="email" required className="input" placeholder="emri@iclear.al" />
            </div>
            <div>
              <label className="label block mb-1.5">Fjalëkalimi</label>
              <input name="password" type="password" required className="input" placeholder="••••••••" />
            </div>
            <button className="btn-primary w-full" type="submit">Hyr</button>
          </form>

          <div className="mt-8 rounded-lg border border-line bg-canvas p-3 text-[12px] text-muted font-mono leading-relaxed">
            Demo: <span className="text-ink">admin@iclear.al</span> / <span className="text-ink">iclear123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
