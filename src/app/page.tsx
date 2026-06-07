import RoomCard from "@/app/room-card";
import { Button } from "@/components/ui/button";
import { getRooms, getSavedRoomIds } from "@/data-access/rooms";
import Link from "next/link";
import { SearchBar } from "./search-bar";
import { HousePlusIcon } from "lucide-react";
import { unstable_noStore } from "next/cache";
import { FilterChips } from "./filter-chips";
import { getSession } from "@/lib/auth";

const POPULAR_LANGS = [
  "React", "TypeScript", "Python", "Node.js", "Next.js",
  "Go", "Rust", "Vue", "Docker", "AI/ML",
];

export default async function Home({
  searchParams,
}: {
  searchParams: { search: string };
}) {
  unstable_noStore();
  const [rooms, session, savedIds] = await Promise.all([
    getRooms(searchParams.search),
    getSession(),
    getSession().then((s) => (s ? getSavedRoomIds() : [])),
  ]);

  return (
    <main className="min-h-screen p-4 sm:p-8 md:p-12 lg:p-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-semibold">
          Find a Dev Room 👨🏻‍💻
        </h2>
        {session && (
          <Button asChild className="w-full sm:w-auto">
            <Link href="/create-room">
              Create Room &nbsp;
              <HousePlusIcon size={18} />
            </Link>
          </Button>
        )}
      </div>

      <div className="mb-6">
        <SearchBar />
      </div>

      <div className="mb-8">
        <FilterChips langs={POPULAR_LANGS} active={searchParams.search} />
      </div>

      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
          <p className="text-lg font-medium">No rooms found</p>
          <p className="text-sm">Try a different search or create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              isLoggedIn={!!session}
              isSaved={savedIds.includes(room.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
