'use client'
import { TagsList } from "@/components/tag-list";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Room } from "@/db/schema";
import { GithubIcon, PencilIcon, PencilLineIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
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
import { deleteRoomAction } from "./action";



export default function UserRoomCard({ room }: { room: Room }) {

  const languages = room?.languages.split(',').map((lang) => lang.trim())
  // const router = useRouter()


  return (
    <Card className="box">
      <CardHeader className="relative">
        <Link href={`/edit-room/${room.id}`}>
        <PencilLineIcon className="absolute cursor-pointer top-2 right-2" size={24} onClick={()=>{}}/>
        </Link>
        {/* <Button></Button> */}
        <CardTitle>{room?.name}</CardTitle>
        <CardDescription>{room?.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <TagsList lang={languages} />
        </div>
        {
          room?.githubRepo && (
            <Link href={room?.githubRepo} className="flex items-center gap-2" target="_blank" rel="noopener noreferrer"><GithubIcon />Github Project</Link>
          )
        }
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild>
          <Link href={`/rooms/${room?.id}`}>Join room</Link>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button onClick={() => {
            }}><Trash2Icon className="mr-2" size={18} /> <span className="text-red-500">Delete</span></Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your room
                and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                deleteRoomAction(room.id)
              }}>Yes, delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </CardFooter>
    </Card>
  )
}