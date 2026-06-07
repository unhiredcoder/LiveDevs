"use server"
import { saveRoom, unsaveRoom } from "@/data-access/rooms"
import { revalidatePath } from "next/cache"

export async function saveRoomAction(roomId: string) {
  await saveRoom(roomId)
  revalidatePath("/")
  revalidatePath("/saved")
}

export async function unsaveRoomAction(roomId: string) {
  await unsaveRoom(roomId)
  revalidatePath("/")
  revalidatePath("/saved")
}
