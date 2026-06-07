import { getUserById, getUserRoomsByUserId } from "@/data-access/rooms"
import { getSession } from "@/lib/auth"
import { unstable_noStore } from "next/cache"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GithubIcon, UsersIcon } from "lucide-react"
import { ProfileEditor } from "./profile-editor"
import { TagsList } from "@/components/tag-list"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function ProfilePage({
  params,
}: {
  params: { userId: string }
}) {
  unstable_noStore()
  const [user, rooms, session] = await Promise.all([
    getUserById(params.userId),
    getUserRoomsByUserId(params.userId),
    getSession(),
  ])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">User not found</p>
      </div>
    )
  }

  const isOwner = session?.user?.id === params.userId
  const skills = user.skills?.split(",").map((s) => s.trim()).filter(Boolean) ?? []

  return (
    <main className="min-h-screen p-4 sm:p-8 md:p-12 lg:p-20 max-w-4xl mx-auto">
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10">
        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 ring-2 ring-border">
          <AvatarImage src={user.image ?? ""} />
          <AvatarFallback className="text-2xl font-bold">
            {user.name?.[0] ?? "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
          {user.bio && (
            <p className="mt-2 text-sm text-foreground/80 max-w-lg">{user.bio}</p>
          )}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit profile form (own profile only) */}
      {isOwner && (
        <div className="mb-10">
          <ProfileEditor user={user} />
        </div>
      )}

      {/* Rooms */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-4">
          Rooms by {user.name?.split(" ")[0]}
        </h2>
        {rooms.length === 0 ? (
          <p className="text-sm text-muted-foreground">No rooms created yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rooms.map((room) => {
              const languages = room.languages
                .split(",")
                .map((l) => l.trim())
              return (
                <Card key={room.id} className="flex flex-col">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{room.name}</CardTitle>
                    {room.description && (
                      <CardDescription className="line-clamp-2 text-sm">
                        {room.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="flex flex-col gap-2 flex-1">
                    <div className="flex flex-wrap gap-1.5">
                      <TagsList lang={languages} />
                    </div>
                    {room.maxParticipants && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <UsersIcon size={12} /> Max {room.maxParticipants}
                      </span>
                    )}
                    {room.githubRepo && (
                      <Link
                        href={room.githubRepo}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <GithubIcon size={12} /> GitHub
                      </Link>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild size="sm" className="w-full">
                      <Link href={`/rooms/${room.id}`}>Join</Link>
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
