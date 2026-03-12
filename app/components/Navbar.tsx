"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-green-700 dark:text-green-400"
        >
          <span className="text-2xl">🌲</span>
          Dievų Miškas
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium hover:text-green-700 dark:hover:text-green-400 transition-colors"
          >
            Funkcijos
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium hover:text-green-700 dark:hover:text-green-400 transition-colors"
          >
            Kaip veikia
          </a>
          <Link
            href="/skelbimas"
            className="text-sm font-medium hover:text-green-700 dark:hover:text-green-400 transition-colors"
          >
            Turgavietė
          </Link>
          <a
            href="#planner"
            className="text-sm font-medium hover:text-green-700 dark:hover:text-green-400 transition-colors"
          >
            Planavimas
          </a>
        </div>

        {session?.user && (session.user as any).role === "atstovas" && (
          <Link
            href="/skelbimas/kurti"
            className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800"
          >
            + Skelbimas
          </Link>
        )}

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-9 w-24 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          ) : session ? (
            <>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Sveiki, <span className="font-medium text-zinc-900 dark:text-zinc-100">{session.user?.name}</span>
              </span>
              <button
                onClick={() => signOut()}
                className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Atsijungti
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Prisijungti
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800"
              >
                Registruotis
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}