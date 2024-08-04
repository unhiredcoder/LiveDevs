"use client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { editRoomAction } from "./action"
import { Room } from "@/db/schema"
import toast from "react-hot-toast"


const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
  githubRepo: z.string().min(2).max(100),
  languages: z.string().min(2).max(50)
})


export const EditRoomForm = ({ room }: { room: Room }) => {
  const router = useRouter()
  const params = useParams()



  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: room.name,
      description: room.description ?? "",
      githubRepo: room.githubRepo ?? "",
      languages: room.languages
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    //invoking server action to store data in db
    console.log(values)
    editRoomAction({
      id: params.roomId as string,
      ...values
    })
    toast.success("Room updated successfully")
    router.push("/")
    // window.location.reload()
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="githubRepo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GithubRepo</FormLabel>
              <FormControl>
                <Input placeholder="Enter GithubRepo url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Progamming Languages</FormLabel>
              <FormControl>
                <Input placeholder="Enter your programming languages,frameworks,libraries" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>

  )
}




