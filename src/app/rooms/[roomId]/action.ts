"use server";

import { getSession } from "@/lib/auth";
import { StreamChat } from "stream-chat";

export async function generateTokenAction() {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const api_key = process.env.NEXT_PUBLIC_GET_STREAM_API_KEY!;
  const api_secret = process.env.GET_STREAM_SECRET_KEY!;
  const serverClient = StreamChat.getInstance(api_key, api_secret);

  // Upsert so the user exists in Stream before the video client connects
  await serverClient.upsertUser({
    id: session.user.id,
    name: session.user.name ?? undefined,
    image: session.user.image ?? undefined,
  });

  return serverClient.createToken(session.user.id);
}

/**
 * Creates (or gets) the messaging channel server-side using admin credentials,
 * adds the current user as a member, and returns a fresh token.
 * This is necessary because users with the default "user" role cannot call
 * GetOrCreateChannel — only the server-side admin client can.
 */
export async function initializeChatChannelAction(
  roomId: string,
  roomName: string
) {
  const session = await getSession();
  if (!session) throw new Error("No session found");

  const api_key = process.env.NEXT_PUBLIC_GET_STREAM_API_KEY!;
  const api_secret = process.env.GET_STREAM_SECRET_KEY!;
  const serverClient = StreamChat.getInstance(api_key, api_secret);

  await serverClient.upsertUser({
    id: session.user.id,
    name: session.user.name ?? undefined,
    image: session.user.image ?? undefined,
  });

  const channel = serverClient.channel("messaging", roomId, {
    name: roomName,
    created_by_id: session.user.id,
  });

  // create() is idempotent — safe to call even if the channel already exists
  await channel.create();
  await channel.addMembers([session.user.id]);

  return serverClient.createToken(session.user.id);
}
