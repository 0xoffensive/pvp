"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [vardas, setVardas] = useState("");
  const [pavarde, setPavarde] = useState("");
  const [ePastas, setEPastas] = useState("");
  const [slapyvardis, setSlapyvardis] = useState("");
  const [slaptazodis, setSlaptazodis] = useState("");
  const [confirmSlaptazodis, setConfirmSlaptazodis] = useState("");
  const [role, setRole] = useState<"vartotojas" | "atstovas">("vartotojas");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (slaptazodis !== confirmSlaptazodis) {
      setError("Slaptažodžiai nesutampa.");
      return;
    }

    if (slaptazodis.length < 6) {
      setError("Slaptažodis turi būti bent 6 simbolių.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vardas,
          pavarde,
          e_pastas: ePastas,
          slapyvardis,
          slaptazodis,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registracijos klaida.");
        setLoading(false);
        return;
      }

      // Auto-login after registration
      const loginResult = await signIn("credentials", {
        e_pastas: ePastas,
        slaptazodis,
        redirect: false,
      });

      if (loginResult?.error) {
        router.push("/login");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Serverio klaida. Bandykite vėliau.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12 dark:bg-zinc-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-green-200/40 blur-3xl dark:bg-green-900/20" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-bold text-green-700 dark:text-green-400"
          >
            <span className="text-3xl">🌲</span>
            Dievų Miškas
          </Link>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Registracija
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Sukurkite paskyrą ir prisijunkite prie miško sodinukų bendruomenės.
          </p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Vardas & Pavardė side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="vardas"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Vardas
                </label>
                <input
                  id="vardas"
                  type="text"
                  required
                  value={vardas}
                  onChange={(e) => setVardas(e.target.value)}
                  placeholder="Jonas"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-green-700 focus:ring-1 focus:ring-green-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-green-400 dark:focus:ring-green-400"
                />
              </div>
              <div>
                <label
                  htmlFor="pavarde"
                  className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Pavardė
                </label>
                <input
                  id="pavarde"
                  type="text"
                  required
                  value={pavarde}
                  onChange={(e) => setPavarde(e.target.value)}
                  placeholder="Jonaitis"
                  className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-green-700 focus:ring-1 focus:ring-green-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-green-400 dark:focus:ring-green-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="slapyvardis"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Slapyvardis
              </label>
              <input
                id="slapyvardis"
                type="text"
                required
                value={slapyvardis}
                onChange={(e) => setSlapyvardis(e.target.value)}
                placeholder="jonas123"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-green-700 focus:ring-1 focus:ring-green-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-green-400 dark:focus:ring-green-400"
              />
            </div>

            <div>
              <label
                htmlFor="ePastas"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                El. paštas
              </label>
              <input
                id="ePastas"
                type="email"
                required
                value={ePastas}
                onChange={(e) => setEPastas(e.target.value)}
                placeholder="jusu@pastas.lt"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-green-700 focus:ring-1 focus:ring-green-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-green-400 dark:focus:ring-green-400"
              />
            </div>

            <div>
              <label
                htmlFor="slaptazodis"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Slaptažodis
              </label>
              <input
                id="slaptazodis"
                type="password"
                required
                value={slaptazodis}
                onChange={(e) => setSlaptazodis(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-green-700 focus:ring-1 focus:ring-green-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-green-400 dark:focus:ring-green-400"
              />
            </div>

            <div>
              <label
                htmlFor="confirmSlaptazodis"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Pakartokite slaptažodį
              </label>
              <input
                id="confirmSlaptazodis"
                type="password"
                required
                value={confirmSlaptazodis}
                onChange={(e) => setConfirmSlaptazodis(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-green-700 focus:ring-1 focus:ring-green-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-green-400 dark:focus:ring-green-400"
              />
            </div>

            {/* Role toggle: Vartotojas (buyer) vs Atstovas (business rep) */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Paskyros tipas
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("vartotojas")}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    role === "vartotojas"
                      ? "border-green-700 bg-green-700 text-white shadow-lg shadow-green-700/25 dark:border-green-400 dark:bg-green-400 dark:text-zinc-900"
                      : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  🛒 Pirkėjas
                </button>
                <button
                  type="button"
                  onClick={() => setRole("atstovas")}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    role === "atstovas"
                      ? "border-green-700 bg-green-700 text-white shadow-lg shadow-green-700/25 dark:border-green-400 dark:bg-green-400 dark:text-zinc-900"
                      : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  🌲 Pardavėjas
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-xl bg-green-700 text-sm font-semibold text-white shadow-lg shadow-green-700/25 transition-all hover:bg-green-800 hover:shadow-xl hover:shadow-green-700/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Registruojama..." : "Registruotis"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Jau turite paskyrą?{" "}
          <Link
            href="/login"
            className="font-medium text-green-700 hover:underline dark:text-green-400"
          >
            Prisijungti
          </Link>
        </p>
      </div>
    </div>
  );
}