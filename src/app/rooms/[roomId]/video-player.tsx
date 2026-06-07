"use client"

import "@stream-io/video-react-sdk/dist/css/styles.css"
import { Room } from "@/db/schema"
import {
  Call,
  CallControls,
  CallParticipantsList,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { generateTokenAction } from "./action"
import { useRouter } from "next/navigation"
import { LoaderIcon } from "lucide-react"
import toast from "react-hot-toast"

const apiKey = process.env.NEXT_PUBLIC_GET_STREAM_API_KEY!

export function DevFinderVideo({ room }: { room: Room }) {
  const session = useSession()
  const [client, setClient] = useState<StreamVideoClient | null>(null)
  const [call, setCall] = useState<Call | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!room || !session.data) return

    const userId = session.data.user.id
    const videoClient = new StreamVideoClient({
      apiKey,
      user: {
        id: userId,
        name: session.data.user.name ?? undefined,
        image: session.data.user.image ?? undefined,
      },
      tokenProvider: () => generateTokenAction(),
    })

    const videoCall = videoClient.call("default", room.id)

    videoCall
      .join({ create: true })
      .then(() => {
        setClient(videoClient)
        setCall(videoCall)
      })
      .catch((err) => {
        console.error("Failed to join call", err)
        toast.error("Could not join the video call")
      })

    return () => {
      videoCall
        .leave()
        .then(() => videoClient.disconnectUser())
        .catch(console.error)
    }
  }, [session, room])

  if (!client || !call) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64 text-muted-foreground gap-2">
        <LoaderIcon className="animate-spin" size={22} />
        <span className="text-sm">Joining call…</span>
      </div>
    )
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme>
        <StreamCall call={call}>
          <SpeakerLayout />
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <CallControls
              onLeave={() => {
                router.push("/")
              }}
            />
          </div>
          <CallParticipantsList onClose={() => undefined} />
        </StreamCall>
      </StreamTheme>
    </StreamVideo>
  )
}
