"use client"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { updateProfileAction } from "./action"
import toast from "react-hot-toast"
import { ChevronDownIcon, ChevronUpIcon, PencilIcon } from "lucide-react"

interface User {
  bio?: string | null
  skills?: string | null
}

export function ProfileEditor({ user }: { user: User }) {
  const [open, setOpen] = useState(false)
  const [bio, setBio] = useState(user.bio ?? "")
  const [skills, setSkills] = useState(user.skills ?? "")
  const [pending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      try {
        await updateProfileAction(bio, skills)
        toast.success("Profile updated!")
        setOpen(false)
      } catch {
        toast.error("Failed to update profile")
      }
    })
  }

  return (
    <div className="border rounded-xl p-4 bg-muted/30">
      <button
        className="flex items-center gap-2 text-sm font-medium w-full text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <PencilIcon size={14} />
        Edit Profile
        {open ? (
          <ChevronUpIcon size={14} className="ml-auto" />
        ) : (
          <ChevronDownIcon size={14} className="ml-auto" />
        )}
      </button>

      {open && (
        <div className="flex flex-col gap-4 mt-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Bio
            </label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell other devs about yourself…"
              rows={3}
              className="resize-none"
              maxLength={300}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">
              Skills (comma-separated)
            </label>
            <Input
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="React, Python, Go, Docker…"
              maxLength={200}
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={pending}
            size="sm"
            className="self-end"
          >
            {pending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}
