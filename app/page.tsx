import Link from "next/link";
import SpotifyLogin from "@/components/SpotifyLogin";
import TopItems from "@/components/TopItems";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">My Spotify Stats</h1>
        <SpotifyLogin />
        <Link 
          href="/festival-matches" 
          className="rounded-full bg-purple-600 text-white px-6 py-3 font-bold hover:bg-purple-700"
        >
          Artists you should discover at festivals
        </Link>
        <TopItems />
      </main>
    </div>
  );
}
