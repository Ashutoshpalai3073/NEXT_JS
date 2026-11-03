import { Suspense } from "react";
import UserProfileContent from "./UserProfileContent";

function ProfileLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-slate-300">
      <p role="status">Loading user profile...</p>
    </main>
  );
}

export default function UserProfilePage() {
  return (
    <Suspense fallback={<ProfileLoading />}>
      <UserProfileContent />
    </Suspense>
  );
}
