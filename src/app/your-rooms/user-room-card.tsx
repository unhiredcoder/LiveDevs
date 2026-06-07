'use client'
import { TagsList } from "@/components/tag-list"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Room } from "@/db/schema"
import {
  CalendarIcon,
  GithubIcon,
  LockIcon,
  PencilLineIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteRoomAction } from "./action"

export default function UserRoomCard({ room }: { room: Room }) {
  const languages = room.languages.split(",").map((l) => l.trim())

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="relative pb-3">
        <Link
          href={`/edit-room/${room.id}`}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Edit room"
        >
          <PencilLineIcon size={18} />
        </Link>
        <CardTitle className="text-base sm:text-lg pr-8 truncate">
          {room.name}
        </CardTitle>
        {room.description && (
          <CardDescription className="line-clamp-2 text-sm">
            {room.description}
          </CardDescription>
        )}
        <div className="flex flex-wrap gap-1.5 mt-1">
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
            <Badge variant="outline" className="text-xs gap-1 text-blue-600 border-blue-300">
              <CalendarIcon size={10} />
              {new Date(room.scheduledAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-3 flex-1">
        <div className="flex flex-wrap gap-1.5">
          <TagsList lang={languages} />
        </div>
        {room.githubRepo && (
          <Link
            href={room.githubRepo}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon size={14} /> GitHub
          </Link>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button asChild size="sm" className="flex-1">
          <Link href={`/rooms/${room.id}`}>Join</Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10">
              <Trash2Icon size={14} className="mr-1.5" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this room?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The room and all its data will be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => deleteRoomAction(room.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
