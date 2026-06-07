"use server"
import { editRoom, getRoom } from "@/data-access/rooms"
import { Room } from "@/db/schema"
import { getSession } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function editRoomAction(roomData: Omit<Room, "userId">) {
  const session = await getSession()
  if (!session) throw new Error("You must be logged in")
  const existing = await getRoom(roomData.id)
  if (existing?.userId !== session.user.id) throw new Error("Not authorized")
  await editRoom({ ...roomData, userId: existing.userId })
  revalidatePath("/your-rooms")
  revalidatePath(`/edit-room/${roomData.id}`)
  redirect("/your-rooms")
}
