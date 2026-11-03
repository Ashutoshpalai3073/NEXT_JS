"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ProfileUser = {
  _id: string;
  username: string;
  email: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [logoutError, setLogoutError] = useState("");
  const [profileAttempt, setProfileAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setProfileError("");
      try {
        const response = await axios.get<{ data: ProfileUser }>(
          "/api/users/me",
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
            : "Unable to load your profile.";

        setProfileError(message);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProfile();
    return () => {
      active = false;
    };
  }, [profileAttempt]);

  async function logout() {
    setLogoutError("");
    setLoggingOut(true);
    try {
      await axios.post("/api/users/logout");
      router.replace("/login");
    } catch (error: unknown) {
      const message = axios.isAxiosError<{ error?: string }>(error)
        ? error.response?.data?.error ?? error.message
        : error instanceof Error
          ? error.message
          : "Unable to log out. Please try again.";
      setLogoutError(message);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/60 via-slate-950 to-slate-950"
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-8 sm:px-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link className="flex items-center gap-3" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500 font-bold text-white shadow-lg shadow-indigo-950">
              A
            </span>
            <span className="font-semibold tracking-wide">AuthSystem</span>
          </Link>
          <Link
            className="rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
            href="/"
          >
            Back home
          </Link>
        </header>

        <section className="mx-auto my-auto w-full max-w-2xl py-12">
          <div className="mb-6">
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-indigo-300">
              Account
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Your profile
            </h1>
            <p className="mt-2 text-slate-400">
              Manage your account details and sign-in session.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 backdrop-blur sm:p-8">
            {loading && (
              <div aria-live="polite" className="space-y-5" role="status">
                <div className="h-16 animate-pulse rounded-xl bg-white/5" />
                <div className="h-24 animate-pulse rounded-xl bg-white/5" />
                <span className="sr-only">Loading your profile...</span>
              </div>
            )}

            {!loading && profileError && (
              <div
                className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-5"
                role="alert"
              >
                <p className="font-medium text-rose-200">
                  We couldn&apos;t load your profile
                </p>
                <p className="mt-2 text-sm text-rose-200/75">{profileError}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/15"
                    onClick={() => setProfileAttempt((attempt) => attempt + 1)}
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
              <>
                <div className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-600 text-2xl font-semibold text-white shadow-lg shadow-indigo-950/60">
                    {user.username.trim().slice(0, 1).toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <h2 className="break-words text-xl font-semibold">
                      {user.username}
                    </h2>
                    <p className="break-all text-sm text-slate-400">
                      {user.email}
                    </p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-medium text-emerald-300 sm:ml-auto">
                    <span
                      aria-hidden="true"
                      className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                    />
                    Signed in
                  </span>
                </div>

                <dl className="grid gap-4 py-6 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                    <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Username
                    </dt>
                    <dd className="mt-2 break-words font-medium">
                      {user.username}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4">
                    <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      Email address
                    </dt>
                    <dd className="mt-2 break-all font-medium">{user.email}</dd>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/[0.03] p-4 sm:col-span-2">
                    <dt className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      User ID
                    </dt>
                    <dd className="mt-2">
                      <Link
                        className="break-all font-mono text-sm text-indigo-300 underline decoration-indigo-300/30 underline-offset-4 transition hover:text-indigo-200"
                        href={`/Profile/${user._id}`}
                      >
                        {user._id}
                      </Link>
                    </dd>
                  </div>
                </dl>

                {logoutError && (
                  <p
                    className="mb-4 rounded-lg border border-rose-400/20 bg-rose-400/5 px-4 py-3 text-sm text-rose-200"
                    role="alert"
                  >
                    {logoutError}
                  </p>
                )}

                <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Sign out of this account on this device.
                  </p>
                  <button
                    className="rounded-lg border border-rose-400/25 px-4 py-2.5 text-sm font-medium text-rose-200 transition hover:border-rose-300/50 hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={loggingOut}
                    onClick={logout}
                    type="button"
                  >
                    {loggingOut ? "Signing out..." : "Log out"}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        <footer className="border-t border-white/10 pt-5 text-center text-xs text-slate-600">
          Your account details are private to your session.
        </footer>
      </div>
    </main>
  );
}
