import SpotifyLogin from "@/components/SpotifyLogin";
import TopItems from "@/components/TopItems";
import FestivalLink from "@/components/FestivalLink";
import ConnectInstruction from "@/components/ConnectInstruction";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">Festival Lineup Finder</h1>
        <ConnectInstruction />
        <SpotifyLogin />
        <FestivalLink />
        <TopItems />
      </main>
    </div>
  );
}
