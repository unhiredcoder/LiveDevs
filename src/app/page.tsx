
import RoomCard from "@/app/room-card";
import { Button } from "@/components/ui/button";
import { getRooms } from "@/data-access/rooms";
import Link from "next/link";
import { SearchBar } from "./search-bar";
import { HousePlusIcon } from "lucide-react";
import { unstable_noStore } from "next/cache";


export default async function Home({ searchParams }: { searchParams: { search: string } }) {
  unstable_noStore()
  const rooms = await getRooms(searchParams.search)

  return (
    <main className="min-h-screen justify-between p-20">
      <div className="flex justify-between items-center mb-12">

        <h2 className='text-4xl font-semibold'>Find Devs Room 👨🏻‍💻</h2>
        <Button asChild>
          <Link href='/create-room' >
            Create Room &nbsp; <HousePlusIcon size={18} />
          </Link>
        </Button>
      </div>
      <div className="mb-12">
        <SearchBar />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {
          rooms?.map((room) => {
            return <RoomCard key={room.id} room={room} />
          })
        }
      </div>
    </main>
  );
}



