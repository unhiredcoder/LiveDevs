"use client"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { SearchIcon, XIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
  search: z.string().max(50),
})

export const SearchBar = () => {
  const query = useSearchParams()
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { search: query.get("search") ?? "" },
  })

  const search = query.get("search")

  useEffect(() => {
    form.setValue("search", search ?? "")
  }, [search, form])

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.search) {
      router.push(`/?search=${encodeURIComponent(values.search)}`)
    } else {
      router.push("/")
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-2 w-full max-w-lg"
      >
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  className="rounded-full w-full"
                  placeholder="Search rooms by language or name…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="rounded-full shrink-0">
          <SearchIcon size={16} className="mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>
        {query.get("search") && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0"
            onClick={() => {
              form.setValue("search", "")
              router.push("/")
            }}
          >
            <XIcon size={16} />
          </Button>
        )}
      </form>
    </Form>
  )
}
