"use server"
import { updateUserProfile } from "@/data-access/rooms"
import { revalidatePath } from "next/cache"

export async function updateProfileAction(bio: string, skills: string) {
  await updateUserProfile(bio, skills)
  revalidatePath("/profile")
}
