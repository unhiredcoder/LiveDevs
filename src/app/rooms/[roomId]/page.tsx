"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getRoom } from "@/data-access/rooms"
import {
  CalendarIcon,
  CodeIcon,
  GithubIcon,
  LoaderIcon,
  LockIcon,
  MessageSquareIcon,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { DevFinderVideo } from "./video-player"
import {
  Chat,
  Channel,
  MessageInput,
  MessageList,
  Window,
  ChannelHeader,
} from "stream-chat-react"
import { StreamChat } from "stream-chat"
import "stream-chat-react/dist/css/index.css"
import { initializeChatChannelAction } from "./action"
import { useTheme } from "next-themes"
import { useSession } from "next-auth/react"
import { CodeEditor } from "./code-editor"

interface Activity {
  id: string
  text: string
  time: string
}

interface Props {
  params: { roomId: string }
}

export default function RoomPage({ params }: Props) {
  const { roomId } = params
  const [room, setRoom] = useState<any>(null)
  const [chatClient, setChatClient] = useState<any>(null)
  const [channel, setChannel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordUnlocked, setPasswordUnlocked] = useState(false)
  const [activity, setActivity] = useState<Activity[]>([])
  const { data: session } = useSession()
  const { theme } = useTheme()

  function addActivity(text: string) {
    setActivity((prev) => [
      { id: crypto.randomUUID(), text, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 49),
    ])
  }

  useEffect(() => {
    const fetchRoom = async () => {
      const fetched = await getRoom(roomId)
      setRoom(fetched)
      setLoading(false)
    }
    fetchRoom()
  }, [roomId])

  useEffect(() => {
    if (!room || !session) return
    if (room.isPrivate && !passwordUnlocked) return

    let cancelled = false
    let activeClient: any = null
    let activeChannel: any = null

    const setup = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GET_STREAM_API_KEY!
      const client = new StreamChat(apiKey)
      const userId = session.user.id

      const token = await initializeChatChannelAction(roomId, room.name)

      // Bail out if the effect was already cleaned up while we awaited the server action
      if (cancelled) {
        client.disconnectUser().catch(() => {})
        return
      }

      await client.connectUser(
        {
          id: userId,
          name: session.user.name ?? undefined,
          image: session.user.image ?? undefined,
        },
        token
      )

      if (cancelled) {
        client.disconnectUser().catch(() => {})
        return
      }

      const ch = client.channel("messaging", roomId, { name: room.name })
      await ch.watch()

      if (cancelled) {
        ch.stopWatching().catch(() => {})
        client.disconnectUser().catch(() => {})
        return
      }

      ch.on("user.watching.start", (e: any) => {
        if (e.user?.id !== userId) {
          addActivity(`${e.user?.name ?? "Someone"} joined the chat`)
        }
      })
      ch.on("user.watching.stop", (e: any) => {
        addActivity(`${e.user?.name ?? "Someone"} left the chat`)
      })

      addActivity("You joined the room")
      activeClient = client
      activeChannel = ch
      setChatClient(client)
      setChannel(ch)
    }

    setup()

    return () => {
      cancelled = true
      activeChannel?.stopWatching().catch(() => {})
      activeClient?.disconnectUser().catch(() => {})
      setChatClient(null)
      setChannel(null)
    }
  }, [room, session, passwordUnlocked, roomId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderIcon className="animate-spin" size={30} />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">Room not found</p>
      </div>
    )
  }

  if (room.isPrivate && !passwordUnlocked) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-sm flex flex-col gap-5 border rounded-xl p-6 shadow-lg bg-card">
          <div className="flex flex-col items-center gap-2 text-center">
            <LockIcon size={36} className="text-muted-foreground" />
            <h2 className="text-xl font-bold">{room.name}</h2>
            <p className="text-sm text-muted-foreground">
              This is a private room. Enter the password to join.
            </p>
          </div>
          <Input
            type="password"
            placeholder="Room password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (password === room.password) {
                  setPasswordUnlocked(true)
                  setPasswordError("")
                } else {
                  setPasswordError("Incorrect password")
                }
              }
            }}
          />
          {passwordError && (
            <p className="text-xs text-destructive">{passwordError}</p>
          )}
          <Button
            onClick={() => {
              if (password === room.password) {
                setPasswordUnlocked(true)
                setPasswordError("")
              } else {
                setPasswordError("Incorrect password")
              }
            }}
          >
            Join Room
          </Button>
        </div>
      </div>
    )
  }

  const languages = room.languages?.split(",").map((l: string) => l.trim())

  const Sidebar = (
    <div className="flex flex-col h-full gap-3">
      <div>
        <h1 className="font-extrabold text-xl leading-tight">{room.name}</h1>
        {room.description && (
          <p className="text-sm text-muted-foreground mt-1">{room.description}</p>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {languages?.map((lang: string) => (
            <Badge className="text-xs capitalize" key={lang}>
              {lang}
            </Badge>
          ))}
          {room.isPrivate && (
            <Badge variant="secondary" className="text-xs gap-1">
              <LockIcon size={10} /> Private
            </Badge>
          )}
          {room.maxParticipants && (
            <Badge variant="outline" className="text-xs gap-1">
              <UsersIcon size={10} /> Max {room.maxParticipants}
            </Badge>
          )}
          {room.scheduledAt && (
            <Badge variant="outline" className="text-xs gap-1">
              <CalendarIcon size={10} />
              {new Date(room.scheduledAt).toLocaleDateString()}
            </Badge>
          )}
        </div>
        {room.githubRepo && (
          <Link
            href={room.githubRepo}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mt-2 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon size={14} /> GitHub
          </Link>
        )}
      </div>

      <Tabs defaultValue="chat" className="flex flex-col flex-1 min-h-0">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="chat" className="text-xs gap-1">
            <MessageSquareIcon size={12} /> Chat
          </TabsTrigger>
          <TabsTrigger value="code" className="text-xs gap-1">
            <CodeIcon size={12} /> Code
          </TabsTrigger>
          <TabsTrigger value="activity" className="text-xs gap-1">
            <UsersIcon size={12} /> Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 min-h-0 mt-2 overflow-hidden">
          {chatClient && channel ? (
            <div className="h-full border rounded-lg overflow-hidden">
              <Chat
                client={chatClient}
                theme={`messaging ${theme === "dark" ? "dark" : "light"}`}
              >
                <Channel channel={channel}>
                  <Window>
                    <ChannelHeader
                      title="Discuss problems"
                      image={session?.user?.image ?? undefined}
                    />
                    <MessageList />
                    <MessageInput />
                  </Window>
                </Channel>
              </Chat>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              <LoaderIcon className="animate-spin mr-2" size={16} />
              Connecting chat…
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="code"
          className="flex-1 min-h-0 mt-2 overflow-hidden rounded-lg border"
          style={{ height: "400px" }}
        >
          <CodeEditor channel={channel} />
        </TabsContent>

        <TabsContent value="activity" className="flex-1 min-h-0 mt-2 overflow-hidden">
          <ScrollArea className="h-full border rounded-lg p-3">
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center pt-4">
                No activity yet
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {activity.map((a) => (
                  <div key={a.id} className="text-xs">
                    <span className="text-muted-foreground">{a.time}</span>{" "}
                    <span>{a.text}</span>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 min-h-screen">
      {/* Video section */}
      <div className="lg:col-span-3 p-3 sm:p-4 pb-0 lg:pb-4">
        <div className="bg-muted/30 text-card-foreground rounded-lg border shadow-sm p-3 sm:p-6">
          <DevFinderVideo room={room} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1 p-3 sm:p-4 lg:pt-4 lg:pl-0">
        <div className="bg-muted/30 text-card-foreground rounded-lg border shadow-sm p-3 sm:p-4 h-full lg:min-h-[calc(100vh-6rem)]">
          {Sidebar}
        </div>
      </div>
    </div>
  )
}
