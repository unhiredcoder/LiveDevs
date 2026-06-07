"use server"
import { db } from "@/db";
import { Room, room, savedRooms, users } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { and, eq, like, or } from "drizzle-orm";
import { unstable_noStore } from "next/cache";

export async function getRooms(search: string | undefined) {
  const where = search
    ? or(
        like(room.languages, `%${search}%`),
        like(room.name, `%${search}%`)
      )
    : undefined;
  return await db.query.room.findMany({ where });
}

export async function getUserRooms() {
  const session = await getSession();
  if (!session) throw new Error("User not authenticated");
  return await db.query.room.findMany({
    where: eq(room.userId, session.user.id),
  });
}

export async function getRoom(roomId: string) {
  return await db.query.room.findFirst({
    where: eq(room.id, roomId),
  });
}

export async function editRoom(roomData: Room) {
  return await db.update(room).set(roomData).where(eq(room.id, roomData.id));
}

export async function deleteRoom(roomId: string) {
  await db.delete(room).where(eq(room.id, roomId));
}

export async function saveRoom(roomId: string) {
  const session = await getSession();
  if (!session) throw new Error("User not authenticated");
  await db
    .insert(savedRooms)
    .values({ userId: session.user.id, roomId })
    .onConflictDoNothing();
}

export async function unsaveRoom(roomId: string) {
  const session = await getSession();
  if (!session) throw new Error("User not authenticated");
  await db
    .delete(savedRooms)
    .where(
      and(
        eq(savedRooms.userId, session.user.id),
        eq(savedRooms.roomId, roomId)
      )
    );
}

export async function getSavedRooms() {
  const session = await getSession();
  if (!session) throw new Error("User not authenticated");
  const rows = await db
    .select({ room })
    .from(savedRooms)
    .innerJoin(room, eq(savedRooms.roomId, room.id))
    .where(eq(savedRooms.userId, session.user.id));
  return rows.map((r) => r.room);
}

export async function getSavedRoomIds() {
  const session = await getSession();
  if (!session) return [];
  const rows = await db
    .select({ roomId: savedRooms.roomId })
    .from(savedRooms)
    .where(eq(savedRooms.userId, session.user.id));
  return rows.map((r) => r.roomId);
}

export async function getUserById(userId: string) {
  return await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
}

export async function updateUserProfile(bio: string, skills: string) {
  const session = await getSession();
  if (!session) throw new Error("User not authenticated");
  await db
    .update(users)
    .set({ bio, skills })
    .where(eq(users.id, session.user.id));
}

export async function getUserRoomsByUserId(userId: string) {
  return await db.query.room.findMany({
    where: eq(room.userId, userId),
  });
}
