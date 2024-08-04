"use client"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { SearchIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"


const formSchema = z.object({
    search: z.string().min(2).max(50),
})


export const SearchBar = () => {
    const query = useSearchParams()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            search: query.get("search") ?? ""
        },
    })

    const search = query.get("search")

    useEffect(() => {
        form.setValue("search", search ?? "")
    }, [search])

    function onSubmit(values: z.infer<typeof formSchema>) {
        //invoking server action to store data in db
        console.log(values)
        if (values.search) {
            router.push(`/?search=${values.search}`)
        } else {
            router.push("/")
        }
    }


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-x-2 flex gap-2">
                <FormField
                    control={form.control}
                    name="search"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input className="focus:outline-none focus:border-none  rounded-full w-[400px]" placeholder="Filter rooms by languages." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="rounded-full"><SearchIcon size={20} /> Search</Button>

                {
                    query.get("search") && (
                        <Button
                            variant={'link'}
                            onClick={() => {
                                form.setValue("search", "")
                                router.push("/")
                            }}
                        >
                            Clear
                        </Button>
                    )
                }
            </form>
        </Form>

    )
}




