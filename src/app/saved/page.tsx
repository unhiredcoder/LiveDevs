import { getSavedRooms, getSavedRoomIds } from "@/data-access/rooms"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { unstable_noStore } from "next/cache"
import RoomCard from "@/app/room-card"
import { BookmarkIcon } from "lucide-react"

export default async function SavedRoomsPage() {
  unstable_noStore()
  const session = await getSession()
  if (!session) redirect("/")

  const [rooms, savedIds] = await Promise.all([
    getSavedRooms(),
    getSavedRoomIds(),
  ])

  return (
    <main className="min-h-screen p-4 sm:p-8 md:p-12 lg:p-20">
      <div className="flex items-center gap-3 mb-10">
        <BookmarkIcon size={28} className="text-primary" />
        <h2 className="text-2xl sm:text-4xl font-semibold">Saved Rooms</h2>
      </div>

      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-muted-foreground">
          <BookmarkIcon size={40} strokeWidth={1.5} />
          <p className="text-lg font-medium">No saved rooms yet</p>
          <p className="text-sm">Bookmark rooms from the home page</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              isLoggedIn
              isSaved={savedIds.includes(room.id)}
            />
          ))}
        </div>
      )}
    </main>
  )
}
