"use server"
import { db } from "@/db";
import { Room, room } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { eq, like } from "drizzle-orm";
import { useSession } from "next-auth/react";
import { unstable_noStore } from "next/cache";

export async function getRooms(search: string | undefined) {
    const where = search ? like(room.languages, `%${search}%`) : undefined;
    const rooms = await db.query.room.findMany({
        where,
    })
    return rooms;
}
export async function getUserRooms() {
    const session = await getSession()
    if (!session) {
        throw new Error("User not authenticatedsssss")
    }
    const rooms = await db.query.room.findMany({
        where: eq(room.userId, session.user.id)
    })
    return rooms;
}


export async function getRoom(roomId: string) {
    return await db.query.room.findFirst({
        where: eq(room.id, roomId)
    })
}

export async function editRoom(roomData: Room) {
    return await db.update(room).set(roomData).where(eq(room.id,roomData.id))
}

export async function deleteRoom(roomId: string) {
    await db.delete(room).where(eq(room.id, roomId))
}

