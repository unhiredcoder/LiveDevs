
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
import { GithubIcon } from "lucide-react";
import Link from "next/link";


export default function RoomCard({ room }: { room: Room }) {

    const languages = room?.languages.split(',').map((lang) => lang.trim())
    // const router = useRouter()
  
  
    return (
      <Card className="box">
        <CardHeader>
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
        <CardFooter>
          <Button asChild>
            <Link href={`/rooms/${room?.id}`}>Join room</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }