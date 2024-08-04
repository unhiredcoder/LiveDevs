
import { Button } from "@/components/ui/button";
import { getRooms, getUserRooms } from "@/data-access/rooms";
import Link from "next/link";
import { SearchBar } from "../search-bar";
import RoomCard from "@/app/room-card";
import UserRoomCard from "./user-room-card";
import { unstable_noStore } from "next/cache";
import { HousePlusIcon } from "lucide-react";


export default async function YourRoomsPage() {
    unstable_noStore()
    const rooms = await getUserRooms()


    return (
        <main className="min-h-screen justify-between p-20">
            <div className="flex justify-between items-center mb-12">

                <h2 className='text-4xl font-semibold'>Your's Rooms 👨🏻‍💻</h2>
                <Button asChild>
                    <Link href='/create-room' >
                        Create Room &nbsp;<HousePlusIcon size={18} />
                    </Link>
                </Button>
            </div>
            <div className="mb-12">
                <SearchBar />
            </div>
            <div className="grid grid-cols-3 gap-4">
    {rooms && rooms.length > 0 ? (
        rooms.map((room) => (
            <UserRoomCard key={room.id} room={room} />
        ))
    ) : (
        <div className="col-span-3 flex mt-20 items-center justify-center h-full">
            <span className="text-md font-sans font-semibold text-gray-400">No rooms available 🤷🏻‍♂️</span>
        </div>
    )}
</div>




        </main>
    );
}



