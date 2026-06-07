"use client"
import { TagsList } from "@/components/tag-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Room } from "@/db/schema";
import {
  BookmarkIcon,
  CalendarIcon,
  GithubIcon,
  LockIcon,
  UsersIcon,
} from "lucide-react";
import Link from "next/link";
import { saveRoomAction, unsaveRoomAction } from "./saved/action";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface RoomCardProps {
  room: Room;
  isLoggedIn?: boolean;
  isSaved?: boolean;
}

export default function RoomCard({
  room,
  isLoggedIn = false,
  isSaved: initialSaved = false,
}: RoomCardProps) {
  const languages = room.languages.split(",").map((l) => l.trim());
  const [saved, setSaved] = useState(initialSaved);
  const [pending, startTransition] = useTransition();

  function toggleSave() {
    if (!isLoggedIn) {
      toast.error("Sign in to save rooms");
      return;
    }
    startTransition(async () => {
      if (saved) {
        await unsaveRoomAction(room.id);
        setSaved(false);
        toast.success("Removed from saved");
      } else {
        await saveRoomAction(room.id);
        setSaved(true);
        toast.success("Room saved!");
      }
    });
  }

  const isScheduled =
    room.scheduledAt && new Date(room.scheduledAt) > new Date();

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="relative pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg truncate pr-8">
              {room.name}
            </CardTitle>
            <CardDescription className="mt-1 line-clamp-2 text-sm">
              {room.description}
            </CardDescription>
          </div>
          <button
            onClick={toggleSave}
            disabled={pending}
            className="shrink-0 mt-0.5 text-muted-foreground hover:text-primary transition-colors"
            aria-label={saved ? "Unsave room" : "Save room"}
          >
            <BookmarkIcon
              size={18}
              className={saved ? "fill-primary text-primary" : ""}
            />
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-2">
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
          {isScheduled && (
            <Badge variant="outline" className="text-xs gap-1 text-blue-600 border-blue-300">
              <CalendarIcon size={10} />
              {new Date(room.scheduledAt!).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
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
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubIcon size={14} /> GitHub Project
          </Link>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/rooms/${room.id}`}>Join Room</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
