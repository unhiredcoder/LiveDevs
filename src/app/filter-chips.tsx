"use client"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function FilterChips({
  langs,
  active,
}: {
  langs: string[]
  active?: string
}) {
  const router = useRouter()

  return (
    <div className="flex flex-wrap gap-2">
      {langs.map((lang) => {
        const isActive = active?.toLowerCase() === lang.toLowerCase()
        return (
          <button
            key={lang}
            onClick={() =>
              isActive
                ? router.push("/")
                : router.push(`/?search=${encodeURIComponent(lang)}`)
            }
            className={cn(
              "px-3 py-1 rounded-full text-sm font-medium border transition-colors",
              isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-muted border-border"
            )}
          >
            {lang}
          </button>
        )
      })}
    </div>
  )
}
