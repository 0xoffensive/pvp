"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Navbar from "../../components/Navbar";

interface Option {
  pavadinimas: string;
}

export default function CreateSkelbimasPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deliveryMethods, setDeliveryMethods] = useState<Option[] | []>([]);
  const [statusOptions, setStatusOptions] = useState<Option[] | []>([]);
  
  const [form, setForm] = useState({
    pavadinimas: "",
    aprasymas: "",
    kaina: "",
    min_kiekis: "",
    vieta: "",
    amzius: "",
    aukstis: "",
    plotis: "",
    lotyniskas_pav: "",
    tipas: "",
    kilme: "",
    atstumas: "",
    pristatymo_budas: '',
    statusas: "galimas",
  });

  // Fetching for dropdown
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fires both requests at once
        const [deliveryRes, statusRes] = await Promise.all([
          fetch('/api/drop-down?type=delivery'),
          fetch('/api/drop-down?type=status')
        ]);

        const deliveryData = await deliveryRes.json();
        const statusData = await statusRes.json();

        setDeliveryMethods(deliveryData);
        setStatusOptions(statusData);
      } catch (error) {
        console.error("Error loading form data:", error);
      }
    };

    fetchAllData();
  }, []);

  // Redirect if not logged in or not atstovas
  if (status !== "loading" && (!session || (session.user as any).role !== "atstovas")) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <Navbar />
        <div className="pt-32 px-6 text-center">
          <p className="text-zinc-600 dark:text-zinc-400">
            Tik pardavėjai gali kurti skelbimus.
          </p>
          <Link href="/skelbimas" className="text-green-700 dark:text-green-400 mt-4 inline-block">
            Grįžti atgal
          </Link>
        </div>
      </div>
    );
  }

  // Show loading while session is loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <Navbar />
        <div className="pt-32 px-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
        </div>
      </div>
    );
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/skelbimai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Nepavyko kurti skelbimo");
      }

      router.push("/skelbimas");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <Navbar />

      {/* HEADER */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 pt-24 pb-12">
        <div className="mx-auto max-w-3xl px-6">
          <span className="text-sm font-semibold uppercase tracking-wider text-green-700 dark:text-green-400">
            Skelbimas
          </span>
          <h1 className="mt-2 text-4xl font-bold">Sukurkite naują skelbimą</h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Visgi savo sodinukus ir pasiūlymas visiems platformos naudotojams
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="mx-auto max-w-3xl px-6 py-24">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 p-4 text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Row 1: pavadinimas, lotyniskas_pav */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">
                Pavadinimas *
              </label>
              <input
                type="text"
                name="pavadinimas"
                value={form.pavadinimas}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
                placeholder="pvz. Paprastoji eglė"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Lotyniškas pavadinimas
              </label>
              <input
                type="text"
                name="lotyniskas_pav"
                value={form.lotyniskas_pav}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
                placeholder="pvz. Picea abies"
              />
            </div>
          </div>

          {/* Row 2: tipas, kilme */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Tipas</label>
              <input
                type="text"
                name="tipas"
                value={form.tipas}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
                placeholder="pvz. Spygliuočiai"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Kilmė</label>
              <input
                type="text"
                name="kilme"
                value={form.kilme}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
                placeholder="pvz. Lietuva"
              />
            </div>
          </div>

          {/* Row 3: kaina, min_kiekis */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">
                Kaina (€) *
              </label>
              <input
                type="number"
                name="kaina"
                value={form.kaina}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Minimalus kiekis
              </label>
              <input
                type="number"
                name="min_kiekis"
                value={form.min_kiekis}
                onChange={handleChange}
                min="1"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
                placeholder="1"
              />
            </div>
          </div>

          {/* Row 4: amzius, aukstis, plotis */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium mb-2">
                Amžius (metai)
              </label>
              <input
                type="number"
                name="amzius"
                value={form.amzius}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
                placeholder="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Aukštis (cm)
              </label>
              <input
                type="number"
                name="aukstis"
                value={form.aukstis}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
                placeholder="40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Plotis (cm)
              </label>
              <input
                type="number"
                name="plotis"
                value={form.plotis}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
                placeholder="20"
              />
            </div>
          </div>

          {/* Row 5: vieta, atstumas */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">Vieta</label>
              <input
                type="text"
                name="vieta"
                value={form.vieta}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
                placeholder="pvz. Vilnius"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Atstumas (km)
              </label>
              <input
                type="number"
                name="atstumas"
                value={form.atstumas}
                onChange={handleChange}
                min="0"
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
                placeholder="100"
              />
            </div>
          </div>

          {/* Row 6: pristatymo_budas, statusas */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">
                Pristatymo būdas
              </label>
              <select
                name="pristatymo_budas"
                value={form.pristatymo_budas}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
              >
                <option value="">Pasirinkite...</option>
                    {deliveryMethods.map((opt, index) => (
                      <option key={index} value={opt.pavadinimas}>
                        {opt.pavadinimas}
                      </option>
                    ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Statusas</label>
              <select
                name="statusas"
                value={form.statusas}
                onChange={handleChange}
                className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
              >
                <option value="">Pasirinkite...</option>
                    {statusOptions.map((opt, index) => (
                      <option key={index} value={opt.pavadinimas}>
                        {opt.pavadinimas}
                      </option>
                    ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Aprašymas
            </label>
            <textarea
              name="aprasymas"
              value={form.aprasymas}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2"
              placeholder="Detaliausiai aprašykite savo sodinukus..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-green-700 px-8 py-3 text-center font-semibold text-white transition-all hover:bg-green-800 disabled:opacity-50"
            >
              {loading ? "Kuriama..." : "Sukurti skelbimą"}
            </button>
            <Link
              href="/skelbimas"
              className="flex items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 px-8 py-3 font-semibold transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Atšaukti
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}