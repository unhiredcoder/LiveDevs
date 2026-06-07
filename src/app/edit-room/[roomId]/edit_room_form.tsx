"use client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { editRoomAction } from "./action"
import { Room } from "@/db/schema"
import toast from "react-hot-toast"

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(500),
  githubRepo: z.string().max(200).optional().or(z.literal("")),
  languages: z.string().min(2).max(200),
  isPrivate: z.boolean().default(false),
  password: z.string().max(50).optional().or(z.literal("")),
  maxParticipants: z.coerce.number().min(2).max(50).default(10),
  scheduledAt: z.string().optional().or(z.literal("")),
})

function toDatetimeLocal(date: Date | null | undefined) {
  if (!date) return ""
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export const EditRoomForm = ({ room }: { room: Room }) => {
  const params = useParams()
  const isPrivate = room.isPrivate ?? false

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: room.name,
      description: room.description ?? "",
      githubRepo: room.githubRepo ?? "",
      languages: room.languages,
      isPrivate,
      password: room.password ?? "",
      maxParticipants: room.maxParticipants ?? 10,
      scheduledAt: toDatetimeLocal(room.scheduledAt),
    },
  })

  const watchPrivate = form.watch("isPrivate")

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await editRoomAction({
        id: params.roomId as string,
        name: values.name,
        description: values.description,
        githubRepo: values.githubRepo || null,
        languages: values.languages,
        isPrivate: values.isPrivate,
        password: values.isPrivate ? (values.password || null) : null,
        maxParticipants: values.maxParticipants,
        scheduledAt: values.scheduledAt ? new Date(values.scheduledAt) : null,
      })
      toast.success("Room updated!")
    } catch {
      toast.error("Failed to update room")
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Name</FormLabel>
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
                <Textarea
                  placeholder="What are you working on?"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
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
              <FormLabel>Languages / Frameworks</FormLabel>
              <FormControl>
                <Input placeholder="e.g. React, TypeScript, Node.js" {...field} />
              </FormControl>
              <FormDescription>Comma-separated list</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="githubRepo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub Repo (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="maxParticipants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Participants</FormLabel>
                <FormControl>
                  <Input type="number" min={2} max={50} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduledAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Schedule (optional)</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isPrivate"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Private Room</FormLabel>
            </FormItem>
          )}
        />

        {watchPrivate && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Set a password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full sm:w-auto">
          Update Room
        </Button>
      </form>
    </Form>
  )
}
