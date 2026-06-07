import { getUserRooms } from "@/data-access/rooms"
import Link from "next/link"
import UserRoomCard from "./user-room-card"
import { unstable_noStore } from "next/cache"
import { HousePlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function YourRoomsPage() {
  unstable_noStore()
  const rooms = await getUserRooms()

  return (
    <main className="min-h-screen p-4 sm:p-8 md:p-12 lg:p-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-4xl font-semibold">Your Rooms 👨🏻‍💻</h2>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/create-room">
            Create Room &nbsp;
            <HousePlusIcon size={18} />
          </Link>
        </Button>
      </div>

      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
          <p className="text-lg font-medium">No rooms yet</p>
          <p className="text-sm">Create your first dev room to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <UserRoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </main>
  )
}
