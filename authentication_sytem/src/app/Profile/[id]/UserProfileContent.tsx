"use client";

import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ProfileUser = {
  _id: string;
  username: string;
};

export default function UserProfileContent() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      setLoading(true);
      setErrorMessage("");
      setUser(null);

      try {
        const response = await axios.get<{ data: ProfileUser }>(
          `/api/users/${encodeURIComponent(id)}`,
        );
        if (active) {
          setUser(response.data.data);
        }
      } catch (error: unknown) {
        if (!active) {
          return;
        }

        const message = axios.isAxiosError<{ error?: string }>(error)
          ? error.response?.data?.error ?? error.message
          : error instanceof Error
            ? error.message
            : "Unable to load this user profile.";

        setErrorMessage(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadUser();
    return () => {
      active = false;
    };
  }, [id, attempt]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-10 text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/60 via-slate-950 to-slate-950"
      />
      <section className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
        <Link
          className="text-sm text-indigo-300 transition hover:text-indigo-200"
          href="/Profile"
        >
          &larr; Back to your profile
        </Link>

        <p className="mt-8 text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
          Account lookup
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          User profile
        </h1>

        {loading && (
          <p aria-live="polite" className="mt-6 text-slate-400" role="status">
            Looking up this account...
          </p>
        )}

        {!loading && errorMessage && (
          <div
            className="mt-6 rounded-xl border border-rose-400/20 bg-rose-400/5 p-5"
            role="alert"
          >
            <p className="text-rose-200">{errorMessage}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/15"
                onClick={() => setAttempt((current) => current + 1)}
                type="button"
              >
                Try again
              </button>
              <Link
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                href="/login"
              >
                Go to login
              </Link>
            </div>
          </div>
        )}

        {!loading && user && (
          <div className="mt-6 rounded-xl border border-white/5 bg-white/[0.03] p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-600 text-xl font-semibold text-white">
                {user.username.trim().slice(0, 1).toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <h2 className="break-words text-xl font-semibold">
                  {user.username}
                </h2>
                <p className="text-sm text-slate-400">Account found</p>
              </div>
            </div>

            <dl className="mt-6 border-t border-white/10 pt-5">
              <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
                User ID
              </dt>
              <dd className="mt-2 break-all font-mono text-sm text-indigo-300">
                {user._id}
              </dd>
            </dl>
          </div>
        )}
      </section>
    </main>
  );
}
